'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Star } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'
import Image from 'next/image'
import EventRegistrationForm from './event-registration-form'

interface Event {
    id: string
    title: string
    description: string
    imageUrl: string | null
    location: string
    startDate: Date
    endDate: Date
    capacity: number
    price: number | null
    category: string
    status: string
    createdBy: { firstName: string; lastName: string }
    registrations: Array<{ user: { id: string } }>
    _count: { registrations: number; feedback: number }
}

interface EventsGridProps {
    events: Event[]
    user: { id: string; role: string }
}

export default function EventsGrid({ events, user }: EventsGridProps) {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

    const handleRegisterClick = (event: Event) => {
        setSelectedEvent(event)
    }

    const handleRegistrationSuccess = () => {
        setSelectedEvent(null)
        window.location.reload()
    }

    const isUserRegistered = (event: Event) => {
        return event.registrations.some(reg => reg.user.id === user.id)
    }

    const getCategoryColor = (category: string) => {
        const colors = {
            'ACADEMIC': 'bg-blue-100 text-blue-800',
            'CULTURAL': 'bg-purple-100 text-purple-800',
            'SPORTS': 'bg-green-100 text-green-800',
            'TECHNICAL': 'bg-orange-100 text-orange-800',
            'SOCIAL': 'bg-pink-100 text-pink-800',
            'WORKSHOP': 'bg-yellow-100 text-yellow-800'
        }
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
                <p className="mt-1 text-sm text-gray-500">
                    {user.role === 'ADMIN' ? 'Create your first event to get started.' : 'No events available at the moment.'}
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow pt-0">
                        {event.imageUrl && (
                            <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                                <Image
                                    src={event.imageUrl}
                                    alt={event.title}
                                    width={400}
                                    height={200}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                        )}

                        <CardHeader>
                            <div className="flex justify-between items-start gap-2">
                                <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                                <Badge className={getCategoryColor(event.category)}>
                                    {event.category}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {event.description}
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {format(new Date(event.startDate), 'MMM dd, yyyy • HH:mm')}
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {event.location}
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Users className="h-4 w-4 mr-2" />
                                    {event._count.registrations} / {event.capacity} registered
                                </div>
                                {event._count.feedback > 0 && (
                                    <div className="flex items-center text-gray-600">
                                        <Star className="h-4 w-4 mr-2" />
                                        {event._count.feedback} reviews
                                    </div>
                                )}
                            </div>

                            {event.price && event.price > 0 && (
                                <div className="text-lg font-semibold text-green-600">
                                    ${event.price}
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    by {event.createdBy.firstName} {event.createdBy.lastName}
                                </span>

                                {user.role !== 'ADMIN' && (
                                    <Button
                                        size="sm"
                                        disabled={
                                            isUserRegistered(event) ||
                                            event._count.registrations >= event.capacity ||
                                            event.status === 'CANCELLED'
                                        }
                                        onClick={() => handleRegisterClick(event)}
                                    >
                                        {event.status === 'CANCELLED'
                                            ? 'Cancelled'
                                            : isUserRegistered(event)
                                                ? 'Registered'
                                                : event._count.registrations >= event.capacity
                                                    ? 'Full'
                                                    : 'Register'
                                        }
                                    </Button>
                                )}
                            </div>

                            {event.status === 'CANCELLED' && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                                    This event has been cancelled
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedEvent && (
                <EventRegistrationForm
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onSuccess={handleRegistrationSuccess}
                />
            )}
        </>
    )
}