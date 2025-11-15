import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
            take: 50
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
