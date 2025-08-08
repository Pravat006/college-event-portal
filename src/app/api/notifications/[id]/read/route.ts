import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth()
        const { id } = await params

        await prisma.notification.updateMany({
            where: {
                id: id,
                userId: user.id
            },
            data: { read: true }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error marking notification as read:', error)
        return NextResponse.json(
            { message: 'Failed to update notification' },
            { status: 500 }
        )
    }
}