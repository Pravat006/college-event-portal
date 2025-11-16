'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, Clock, User } from 'lucide-react'
import { format } from 'date-fns'
import { useEventSocket } from '@/hooks/use-socket'

interface EventUpdate {
    id: string
    content: string
    sentAt: Date
    sentBy: {
        firstName: string
        lastName: string
    }
}

interface SocketEventUpdate {
    id: string
    content: string
    sentAt: Date
    createdBy: string
}

interface EventUpdatesDisplayProps {
    eventId: string
}

export function EventUpdatesDisplay({ eventId }: EventUpdatesDisplayProps) {
    const [updates, setUpdates] = useState<EventUpdate[]>([])
    const [loading, setLoading] = useState(true)
    const { isConnected, socket } = useEventSocket(eventId)


    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const response = await fetch(`/api/events/${eventId}/updates`)
                if (response.ok) {
                    const data = await response.json()
                    setUpdates(data)
                }
            } catch (error) {
                console.error('Failed to fetch updates:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUpdates()
    }, [eventId])

    useEffect(() => {
        if (!socket) return

        const handleNewUpdate = (update: SocketEventUpdate) => {
            const formattedUpdate: EventUpdate = {
                id: update.id,
                content: update.content,
                sentAt: update.sentAt,
                sentBy: {
                    firstName: update.createdBy?.split(' ')[0] || 'Unknown',
                    lastName: update.createdBy?.split(' ')[1] || 'User'
                }
            }

            setUpdates(prev => {
                if (prev.some(u => u.id === formattedUpdate.id)) {
                    return prev
                }
                return [formattedUpdate, ...prev]
            })
        }

        socket.on('event-update', handleNewUpdate)

        return () => {
            socket.off('event-update', handleNewUpdate)
        }
    }, [socket])

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Event Updates
                    </CardTitle>
                    {isConnected && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            Live
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {updates.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No updates yet</p>
                        <p className="text-sm">Check back later for event updates</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {updates.map((update) => (
                            <Card key={update.id} className="border-l-4 border-l-primary">
                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        <p className="text-sm leading-relaxed">{update.content}</p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                <span>
                                                    {update.sentBy.firstName} {update.sentBy.lastName}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>
                                                    {format(new Date(update.sentAt), 'MMM dd, yyyy h:mm a')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
