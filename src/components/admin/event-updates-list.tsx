'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Calendar, MapPin, Users, MessageSquare, Search, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { EventChatInterface } from './event-chat-interface'

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

interface EventUpdatesListProps {
    events: Event[]
}

export function EventUpdatesList({ events }: EventUpdatesListProps) {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
            case 'DRAFT':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
            case 'COMPLETED':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
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

    if (selectedEvent) {
        return (
            <EventChatInterface
                event={selectedEvent}
                onBack={() => setSelectedEvent(null)}
            />
        )
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search events by title, category, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{events.length}</p>
                                <p className="text-sm text-muted-foreground">Total Events</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {events.reduce((sum, e) => sum + e._count.registrations, 0)}
                                </p>
                                <p className="text-sm text-muted-foreground">Total Participants</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {events.reduce((sum, e) => sum + e._count.updates, 0)}
                                </p>
                                <p className="text-sm text-muted-foreground">Updates Sent</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Events List */}
            <div className="space-y-3">
                <h2 className="text-xl font-semibold">Select an Event</h2>

                {filteredEvents.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground">No events found</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-3">
                        {filteredEvents.map((event) => (
                            <Card
                                key={event.id}
                                className="hover:shadow-md transition-all cursor-pointer group"
                                onClick={() => setSelectedEvent(event)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                        {event.description}
                                                    </p>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge className={getStatusColor(event.status)}>
                                                    {event.status}
                                                </Badge>
                                                <Badge className={getCategoryColor(event.category)} variant="outline">
                                                    {event.category}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Calendar className="h-4 w-4 shrink-0" />
                                                    <span className="truncate">
                                                        {format(new Date(event.startDate), 'MMM dd, yyyy')}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="h-4 w-4 shrink-0" />
                                                    <span className="truncate">{event.location}</span>
                                                </div>

                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Users className="h-4 w-4 shrink-0" />
                                                    <span>{event._count.registrations} registered</span>
                                                </div>

                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MessageSquare className="h-4 w-4 shrink-0" />
                                                    <span>{event._count.updates} updates sent</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
