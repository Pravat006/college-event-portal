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

    const hideHeaderRoutes = [
        '/dashboard',
        '/admin',
        '/events',
        '/registrations',
        '/sign-in',
        '/sign-up',
    ]

    const shouldHideHeader = hideHeaderRoutes.some(route => pathname.startsWith(route))

    if (shouldHideHeader) {
        return null
    }

    const headerUser = user && user.firstName ? { firstName: user.firstName, role: user.role } : null

    return <Header user={headerUser} />
}
