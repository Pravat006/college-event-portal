import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEventConfirmationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
    try {
        const user = await requireAuth()
        const { eventId } = await req.json()

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
                status: 'REGISTERED'
            }
        })

        // Send confirmation email
        try {
            await sendEventConfirmationEmail({
                event: {
                    title: event.title,
                    description: event.description,
                    location: event.location,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    price: event.price ?? 0, // Provide default value of 0 if price is null
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

        return NextResponse.json(registration)
    } catch (error) {
        console.error('Error registering for event:', error)
        return NextResponse.json(
            { message: 'Registration failed' },
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
            }
        })

        return NextResponse.json(registrations)
    } catch (error) {
        console.error('Error fetching registered events:', error)
        return NextResponse.json(
            { message: 'Failed to fetch registered events' },
            { status: 500 }
        )
    }
}


// cancel a event registartion by user
export async function DELETE(req: NextRequest) {
    try {
        const user = await requireAuth()
        const { eventId } = await req.json()

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
                        startDate: true
                    }
                }
            }
        })

        if (!existingRegistration) {
            return NextResponse.json(
                { message: 'Registration not found' },
                { status: 404 }
            )
        }

        const now = new Date()
        if (existingRegistration.event.startDate <= now) {
            return NextResponse.json(
                { message: 'Cannot cancel registration for events that have already started' },
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
            message: 'Registration cancelled successfully'
        })
    } catch (error) {
        console.error('Error cancelling registration:', error)
        return NextResponse.json(
            { message: 'Failed to cancel registration' },
            { status: 500 }
        )
    }
}











