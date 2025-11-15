'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Star } from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
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

    const handleRegistrationSuccess = () => {
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
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
                const eventCard = (
                    <Card
                        className="flex flex-col overflow-hidden rounded-xl pt-0 border bg-card shadow transition hover:shadow-xl h-full"
                    >
                        {event.imageUrl && (
                            <div className="aspect-video w-full bg-gray-100">
                                <Image
                                    src={event.imageUrl}
                                    alt={event.title}
                                    width={400}
                                    height={200}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                        )}

                        <CardHeader className="pb-2 pt-4 px-4">
                            <div className="flex items-start justify-between gap-2">
                                <CardTitle className="line-clamp-2 text-lg font-semibold">{event.title}</CardTitle>
                                <Badge className={getCategoryColor(event.category)}>
                                    {event.category}
                                </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                {event.description}
                            </p>
                        </CardHeader>

                        <CardContent className="flex-1 flex flex-col justify-between px-4 pb-4 space-y-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    {format(new Date(event.startDate), 'MMM dd, yyyy • HH:mm')}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {event.location}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    {event._count.registrations} / {event.capacity} registered
                                </div>
                                {event._count.feedback > 0 && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Star className="h-4 w-4" />
                                        {event._count.feedback} reviews
                                    </div>
                                )}
                            </div>

                            {/* {event.price && event.price > 0 && (
                                <div className="text-lg font-semibold text-green-600">
                                    ₹{event.price}
                                </div>
                            )} */}

                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xs text-muted-foreground">
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
                                        className="rounded-md font-medium"
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
                        {user.role !== 'ADMIN' && (
                            <EventRegistrationForm
                                status={event.status}
                                disable={isUserRegistered(event)}
                                eventId={event.id}
                                onSuccess={handleRegistrationSuccess}
                            />
                        )}
                    </Card>
                );

                if (user.role === 'ADMIN') {
                    return (
                        <Link key={event.id} href={`/admin/events/${event.id}/manage`} className="block">
                            {eventCard}
                        </Link>
                    )
                }

                return <div key={event.id}>{eventCard}</div>
            })}
        </div>
    )
}