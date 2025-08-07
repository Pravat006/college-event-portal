'use client'

import { UserButton } from '@clerk/nextjs'
import { Bell, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NotificationDropdown from '@/components/notification-dropdown'

interface NavbarProps {
    user: {
        firstName: string
        lastName: string
        role: string
    }
}

export default function Navbar({ user }: NavbarProps) {
    return (
        <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
            <div className="px-6">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <h1 className="text-xl font-bold text-gray-900">College Events</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <NotificationDropdown />
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {user.role.toLowerCase()}
                                </p>
                            </div>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}