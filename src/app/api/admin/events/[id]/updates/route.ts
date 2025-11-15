import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { emitEventUpdate } from '@/lib/socket-emit'

// POST - Admin sends event update
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAdmin()
        const { id: eventId } = await params
        const { content } = await req.json()

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true, createdById: true }
        })

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        if (user.role !== 'ADMIN' && event.createdById !== user.id) {
            return NextResponse.json(
                { error: 'Only admins or event creators can send updates' },
                { status: 403 }
            )
        }


        const update = await prisma.eventUpdate.create({
            data: {
                eventId,
                content,
                senderId: user.id
            },
            include: {
                sentBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        })

        await emitEventUpdate(eventId, {
            id: update.id,
            content: update.content,
            createdBy: `${update.sentBy.firstName} ${update.sentBy.lastName}`,
            sentAt: update.sentAt
        })

        return NextResponse.json(update, { status: 201 })
    } catch (error) {
        console.error('Error creating event update:', error)
        return NextResponse.json(
            { error: 'Failed to create update' },
            { status: 500 }
        )
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params

        const updates = await prisma.eventUpdate.findMany({
            where: { eventId },
            include: {
                sentBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { sentAt: 'desc' },
            take: 50 // Limit to last 50 updates
        })

        return NextResponse.json(updates)
    } catch (error) {
        console.error('Error fetching event updates:', error)
        return NextResponse.json(
            { error: 'Failed to fetch updates' },
            { status: 500 }
        )
    }
}
