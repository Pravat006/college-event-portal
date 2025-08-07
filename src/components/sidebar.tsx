'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Calendar,
    Users,
    Star,
    Settings,
    BarChart3
} from 'lucide-react'

interface SidebarProps {
    user: {
        role: string
    }
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['USER', 'ADMIN'] },
    { name: 'Events', href: '/events', icon: Calendar, roles: ['USER', 'ADMIN'] },
    { name: 'My Registrations', href: '/registrations', icon: Users, roles: ['USER'] },
    { name: 'User Management', href: '/admin/users', icon: Users, roles: ['ADMIN'] },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['ADMIN'] },
    { name: 'Feedback', href: '/feedback', icon: Star, roles: ['USER', 'ADMIN'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['USER', 'ADMIN'] },
]

export default function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname()

    const filteredNavigation = navigation.filter(item =>
        item.roles.includes(user.role as 'USER' | 'ADMIN')
    )

    return (
        <div className="fixed left-0 top-16 w-64 h-full bg-white border-r border-gray-200 overflow-y-auto">
            <nav className="p-4 space-y-2">
                {filteredNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <item.icon className="h-5 w-5 mr-3" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}