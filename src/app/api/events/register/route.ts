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
