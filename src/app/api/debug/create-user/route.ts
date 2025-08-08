import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const clerkId = searchParams.get('clerkId')
    const email = searchParams.get('email')

    if (!clerkId || !email) {
        return NextResponse.json(
            { error: 'Missing required parameters: clerkId and email' },
            { status: 400 }
        )
    }

    try {
        // Create a new user
        const user = await prisma.user.create({
            data: {
                clerkId,
                email,
                firstName: searchParams.get('firstName') || 'Test',
                lastName: searchParams.get('lastName') || 'User',
                role: (searchParams.get('role') as "USER" | "ADMIN"),
            }
        })

        return NextResponse.json({
            message: 'User created successfully',
            user
        })
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
            { error: 'Failed to create user', details: (error as Error).message },
            { status: 500 }
        )
    }
}
