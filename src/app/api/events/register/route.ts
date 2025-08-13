import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEventConfirmationEmail } from '@/lib/email'
import { z } from 'zod'

// Schema for registration data validation
const registrationInputSchema = z.object({
    eventId: z.string().min(1, 'Event ID is required'),
    registrationNumber: z.string()
        .min(1, 'Registration number is required')
        .regex(/^\d+$/, 'Registration number must contain only digits'),
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    semester: z.coerce.number().min(1, 'Semester must be between 1-8').max(8, 'Semester must be between 1-8')
})

export async function POST(req: NextRequest) {
    try {
        const user = await requireAuth()

        // Parse and validate request body
        const body = await req.json()
        const validationResult = registrationInputSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    message: 'Invalid input data',
                    errors: validationResult.error.flatten().fieldErrors
                },
                { status: 400 }
            )
        }

        const { eventId, registrationNumber, fullName, semester } = validationResult.data

        // Check if event exists and has capacity
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                _count: { select: { registrations: true } },
                createdBy: { select: { firstName: true, lastName: true } }
            }
        })

        if (!event) {
            return NextResponse.json(
                { message: 'Event not found' },
                { status: 404 }
            )
        }

        // Check if event is published
        if (event.status !== 'PUBLISHED') {
            return NextResponse.json(
                { message: 'Event is not open for registration' },
                { status: 400 }
            )
        }

        if (event._count.registrations >= event.capacity) {
            return NextResponse.json(
                { message: 'Event is full' },
                { status: 400 }
            )
        }

        // Check if already registered
        const existingRegistration = await prisma.registration.findUnique({
            where: {
                userId_eventId: {
                    userId: user.id,
                    eventId
                }
            }
        })

        if (existingRegistration) {
            return NextResponse.json(
                { message: 'Already registered for this event' },
                { status: 400 }
            )
        }

        // Create registration
        const registration = await prisma.registration.create({
            data: {
                userId: user.id,
                eventId,
                status: 'REGISTERED',
                registrationNumber: BigInt(registrationNumber),
                fullName,
                semester
            }
        })

        // Convert BigInt to string for JSON serialization
        const serializedRegistration = {
            ...registration,
            registrationNumber: registration.registrationNumber.toString()
        }

        // Send confirmation email
        try {
            await sendEventConfirmationEmail({
                event: {
                    title: event.title,
                    description: event.description,
                    location: event.location,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    price: event.price ?? 0,
                    category: event.category
                },
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            })
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError)
            // Don't fail the registration if email fails
        }

        // Create notification
        await prisma.notification.create({
            data: {
                userId: user.id,
                eventId,
                title: 'Registration Confirmed',
                message: `You have successfully registered for ${event.title}`,
                type: 'REGISTRATION_CONFIRMED'
            }
        })

        return NextResponse.json({
            success: true,
            data: serializedRegistration,
            message: 'Registration successful'
        })
    } catch (error) {
        console.error('Error registering for event:', error)

        // Handle BigInt serialization errors
        if (error instanceof TypeError && error.message.includes('BigInt')) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Registration number format error. Please try again.',
                },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Registration failed',
            },
            { status: 500 }
        )
    }
}

// get all the registered events by user
export async function GET() {
    try {
        const user = await requireAuth()

        const registrations = await prisma.registration.findMany({
            where: {
                userId: user.id
            },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        startDate: true,
                        endDate: true,
                        location: true,
                        status: true
                    }
                }
            },
            orderBy: {
                registeredAt: 'desc'
            }
        })

        // Convert BigInt to string for JSON serialization
        const serializedRegistrations = registrations.map(reg => ({
            ...reg,
            registrationNumber: reg.registrationNumber.toString()
        }))

        return NextResponse.json({
            success: true,
            data: serializedRegistrations
        })
    } catch (error) {
        console.error('Error fetching registered events:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch registered events'
            },
            { status: 500 }
        )
    }
}


// Cancel an event registration by user
export async function DELETE(req: NextRequest) {
    try {
        const user = await requireAuth()

        // Parse and validate request body
        const body = await req.json()
        if (!body.eventId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Event ID is required'
                },
                { status: 400 }
            )
        }

        const { eventId } = body

        // Check if registration exists
        const existingRegistration = await prisma.registration.findUnique({
            where: {
                userId_eventId: {
                    userId: user.id,
                    eventId
                }
            },
            include: {
                event: {
                    select: {
                        title: true,
                        startDate: true,
                        status: true
                    }
                }
            }
        })

        if (!existingRegistration) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Registration not found'
                },
                { status: 404 }
            )
        }

        // Check if event is cancelled
        if (existingRegistration.event.status === 'CANCELLED') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Cannot cancel registration for cancelled events'
                },
                { status: 400 }
            )
        }

        const now = new Date()
        if (existingRegistration.event.startDate <= now) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Cannot cancel registration for events that have already started'
                },
                { status: 400 }
            )
        }

        // Delete the registration
        await prisma.registration.delete({
            where: {
                userId_eventId: {
                    userId: user.id,
                    eventId
                }
            }
        })

        // Create notification
        await prisma.notification.create({
            data: {
                userId: user.id,
                eventId,
                title: 'Registration Cancelled',
                message: `You have cancelled your registration for ${existingRegistration.event.title}`,
                type: 'REGISTRATION_CANCELLED'
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Registration cancelled successfully'
        })
    } catch (error) {
        console.error('Error cancelling registration:', error)
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to cancel registration'
            },
            { status: 500 }
        )
    }
}











