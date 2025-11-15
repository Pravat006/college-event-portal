'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Notification {
    id: string
    title: string
    message: string
    read: boolean
    createdAt: Date
}

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/notifications')
            if (response.ok) {
                const data = await response.json()
                setNotifications(data)
                setUnreadCount(data.filter((n: Notification) => !n.read).length)
            }
        } catch {
            // Failed to fetch notifications
        }
    }

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: 'POST' })
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            )
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch {
            // Failed to mark notification as read
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative p-1 sm:p-2">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] bg-white/5 backdrop-blur-lg sm:w-80">{unreadCount > 0 && (
                <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-medium ">
                        {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                    </p>
                </div>
            )}
                {notifications.length === 0 ? (
                    <div className="p-4 text-center ">
                        No notifications
                    </div>
                ) : (
                    notifications.slice(0, 5).map((notification) => (
                        <DropdownMenuItem
                            key={notification.id}
                            className="flex-col items-start p-4 cursor-pointer "
                            onClick={() => markAsRead(notification.id)}
                        >
                            <div className="flex justify-between items-start w-full mb-1">
                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                {!notification.read && (
                                    <div className="h-2 w-2 bg-blue-600 rounded-full" />
                                )}
                            </div>
                            <p className="text-xs ">{notification.message}</p>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}