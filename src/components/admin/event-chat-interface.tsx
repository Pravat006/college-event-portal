'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, Send, Users, Calendar, MapPin, Loader2, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { useUser } from '@clerk/nextjs'
import { useEventSocket } from '@/hooks/use-socket'
import toast from 'react-hot-toast'

const messageSchema = z.object({
    content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long')
})

type MessageFormData = z.infer<typeof messageSchema>

interface Event {
    id: string
    title: string
    description: string
    location: string
    startDate: Date
    status: string
    category: string
    _count: {
        registrations: number
        updates: number
    }
    createdBy: {
        firstName: string
        lastName: string
    }
}

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

interface EventChatInterfaceProps {
    event: Event
    onBack: () => void
}

export function EventChatInterface({ event, onBack }: EventChatInterfaceProps) {
    const { user } = useUser()
    const [updates, setUpdates] = useState<EventUpdate[]>([])
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const { isConnected, socket } = useEventSocket(event.id)

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<MessageFormData>({
        resolver: zodResolver(messageSchema)
    })

    // Fetch existing updates
    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const response = await fetch(`/api/admin/events/${event.id}/updates`)
                if (response.ok) {
                    const data = await response.json()
                    setUpdates(data)
                }
            } catch (error) {
                console.error('Failed to fetch updates:', error)
                toast.error('Failed to load updates')
            } finally {
                setLoading(false)
            }
        }

        fetchUpdates()
    }, [event.id])

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
                return [...prev, formattedUpdate]
            })
        }

        socket.on('event-update', handleNewUpdate)

        return () => {
            socket.off('event-update', handleNewUpdate)
        }
    }, [socket])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [updates])

    const onSubmit = async (data: MessageFormData) => {
        if (!user?.id) {
            toast.error('You must be logged in')
            return
        }

        setSending(true)
        try {
            const response = await fetch(`/api/admin/events/${event.id}/updates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: data.content })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to send update')
            }

            const newUpdate = await response.json()
            setUpdates(prev => [...prev, newUpdate])

            toast.success('Update sent successfully!')
            reset()
        } catch (error) {
            console.error('Error sending update:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to send update')
        } finally {
            setSending(false)
        }
    }

    const getCategoryColor = (category: string) => {
        const colors = {
            'ACADEMIC': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
            'CULTURAL': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
            'SPORTS': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
            'TECHNICAL': 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
            'SOCIAL': 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300',
            'WORKSHOP': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        }
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Event Info */}
            <Card className="lg:col-span-1">
                <CardHeader>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="w-fit mb-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Events
                    </Button>
                    <CardTitle className="text-lg">Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-xl mb-2">{event.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={getCategoryColor(event.category)}>
                                {event.category}
                            </Badge>
                            <Badge variant="outline">{event.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(event.startDate), 'PPP')}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{event.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{event._count.registrations} registered participants</span>
                        </div>
                    </div>

                    <div className="pt-3 border-t">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm text-muted-foreground">
                                {isConnected ? 'Live connection active' : 'Offline'}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {event._count.updates} updates sent so far
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Right: Chat Interface */}
            <Card className="lg:col-span-2 flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
                <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Send Updates to Participants
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Messages will be sent to all {event._count.registrations} registered participants
                    </p>
                </CardHeader>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : updates.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <Send className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                            <p className="text-muted-foreground">No updates sent yet</p>
                            <p className="text-sm text-muted-foreground">
                                Send your first update to all participants
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {updates.map((update) => (
                                <div key={update.id} className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-semibold text-primary">
                                            {update.sentBy.firstName[0]}{update.sentBy.lastName[0]}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-muted rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-semibold">
                                                    {update.sentBy.firstName} {update.sentBy.lastName}
                                                </span>
                                                <CheckCircle className="h-3 w-3 text-green-600" />
                                            </div>
                                            <p className="text-sm whitespace-pre-wrap">{update.content}</p>
                                            <span className="text-xs text-muted-foreground mt-2 block">
                                                {format(new Date(update.sentAt), 'MMM dd, yyyy h:mm a')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t p-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <div>
                            <Textarea
                                {...register('content')}
                                placeholder="Type your update message here..."
                                rows={3}
                                className="resize-none"
                                disabled={sending}
                            />
                            <div className="flex justify-between items-center mt-2">
                                {errors.content && (
                                    <span className="text-sm text-destructive">
                                        {errors.content.message}
                                    </span>
                                )}
                                <span className="text-xs text-muted-foreground ml-auto">
                                    {watch('content')?.length || 0}/1000
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type="submit" disabled={sending} className="flex-1">
                                {sending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send to {event._count.registrations} Participants
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    )
}
