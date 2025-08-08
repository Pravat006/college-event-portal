import { NextResponse } from 'next/server'
import { getCurrentUser, requireAdmin } from '@/lib/auth'

export async function GET() {
    try {
        // console.log('Debug: Testing auth functions...')

        // Test getCurrentUser
        const currentUser = await getCurrentUser()
        // console.log('Debug: getCurrentUser result:', currentUser)

        if (!currentUser) {
            return NextResponse.json({
                error: 'No current user found',
                user: null,
                isAdmin: false
            })
        }

        // Test requireAdmin
        let isAdmin = false
        let adminError = null
        try {
            await requireAdmin()
            isAdmin = true
        } catch (error) {
            adminError = error instanceof Error ? error.message : 'Unknown error'
            // console.log('Debug: requireAdmin failed:', adminError)
        }

        return NextResponse.json({
            user: {
                id: currentUser.id,
                role: currentUser.role,
                email: currentUser.email,
                firstName: currentUser.firstName
            },
            isAdmin,
            adminError
        })
    } catch (error) {
        console.error('Debug endpoint error:', error)
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error',
            user: null,
            isAdmin: false
        })
    }
}
