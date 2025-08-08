import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { clerkId, email, firstName, lastName, imageUrl } = await req.json()

        // Verify the clerkId matches the authenticated user
        if (userId !== clerkId) {
            return NextResponse.json(
                { message: 'Unauthorized: User ID mismatch' },
                { status: 403 }
            )
        }

        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { clerkId },
            select: { id: true, role: true }
        })

        // Create user if it doesn't exist
        if (!user) {
            console.log('Creating new user with Clerk ID:', clerkId)

            user = await prisma.user.create({
                data: {
                    clerkId,
                    email,
                    firstName: firstName || '',
                    lastName: lastName || '',
                    imageUrl,
                    role: 'USER', // Default role
                },
                select: { id: true, role: true }
            })

            console.log('Created new user with ID:', user.id)
        }

        return NextResponse.json({
            userId: user.id,
            role: user.role
        })
    } catch (error) {
        console.error('Error checking/creating user:', error)
        return NextResponse.json(
            { message: 'Error checking/creating user' },
            { status: 500 }
        )
    }
}
