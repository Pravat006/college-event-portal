import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEventUpdateEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
    try {
        const user = await requireAdmin()
        const data = await req.json()

        const event = await prisma.event.create({
            data: {
                ...data,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                createdById: user.id,
                status: 'PUBLISHED'
            }
        })
        const users = await prisma.user.findMany({
            where: { role: 'USER' }
        })
        if (users.length > 0) {
            await prisma.notification.createMany({
                data: users.map((u: { id: string }) => ({
                    userId: u.id,
                    eventId: event.id,
                    title: 'New Event Available',
                    message: `${event.title} has been created`,
                    type: 'EVENT_CREATED'
                }))
            })
        }
        return NextResponse.json(event)
    } catch {
        return NextResponse.json(
            { message: 'Failed to create event' },
            { status: 500 }
        )
    }
}
export async function PUT(req: NextRequest) {
    try {
        await requireAdmin()
        const { id, ...data } = await req.json()
        const event = await prisma.event.update({
            where: { id },
            data: {
                ...data,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
            },
            include: {
                registrations: {
                    include: {
                        user: { select: { firstName: true, lastName: true, email: true } }
                    }
                }
            }
        })

        const emailPromises = event.registrations.map((registration: { user: { firstName: string; lastName: string; email: string } }) =>
            sendEventUpdateEmail({
                event: {
                    title: event.title,
                    description: event.description,
                    location: event.location,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    price: event.price ?? 0,
                    category: event.category
                },
                user: registration.user,
                updateType: 'updated'
            }).catch(() => null)
        )
        await Promise.all(emailPromises)
        return NextResponse.json(event)
    } catch {
        return NextResponse.json(
            { message: 'Failed to update event' },
            { status: 500 }
        )
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await requireAdmin()
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { message: 'Event ID is required' },
                { status: 400 }
            )
        }

        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                registrations: {
                    include: {
                        user: { select: { firstName: true, lastName: true, email: true } }
                    }
                }
            }
        })

        if (!event) {
            return NextResponse.json(
                { message: 'Event not found' },
                { status: 404 }
            )
        }

        // Send cancellation emails to all registered users
        const emailPromises = event.registrations.map((registration: { user: { firstName: string; lastName: string; email: string } }) =>
            sendEventUpdateEmail({
                event: {
                    title: event.title,
                    description: event.description,
                    location: event.location,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    price: event.price ?? 0,
                    category: event.category
                },
                user: registration.user,
                updateType: 'cancelled'
            }).catch(() => null) // Silently catch errors
        )

        await Promise.all(emailPromises)

        // Update event status to cancelled instead of deleting
        await prisma.event.update({
            where: { id },
            data: { status: 'CANCELLED' }
        })

        return NextResponse.json({ message: 'Event cancelled successfully' })
    } catch {
        return NextResponse.json(
            { message: 'Failed to cancel event' },
            { status: 500 }
        )
    }
}