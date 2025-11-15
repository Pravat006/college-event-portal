'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/landing/header'

interface ConditionalHeaderProps {
    user: {
        id: string
        firstName: string | null
        lastName: string | null
        email: string
        role: string
    } | null
}

export function ConditionalHeader({ user }: ConditionalHeaderProps) {
    const pathname = usePathname()

    // Don't show header on these routes
    const hideHeaderRoutes = [
        '/dashboard',
        '/admin',
        '/events',
        '/registrations',
        '/sign-in',
        '/sign-up',
    ]

    // Check if current path starts with any of the routes where header should be hidden
    const shouldHideHeader = hideHeaderRoutes.some(route => pathname.startsWith(route))

    if (shouldHideHeader) {
        return null
    }

    // Transform user data to match Header's expected props
    const headerUser = user && user.firstName ? { firstName: user.firstName, role: user.role } : null

    return <Header user={headerUser} />
}
