import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Get all users in the database
        const users = await prisma.user.findMany({
            select: {
                id: true,
                clerkId: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true
            }
        })

        return NextResponse.json({ users })
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        )
    }
}
