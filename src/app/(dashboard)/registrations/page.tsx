'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { UnregisterEventButton } from '@/components/unregister-event-button'

interface Registration {
    id: string
    status: string
    registeredAt: string
    event: {
        id: string
        title: string
        startDate: string
        endDate: string
        location: string
        status: string
    }
}

export default function RegistrationsPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRegistrations()
    }, [])

    const fetchRegistrations = async () => {
        try {
            const response = await fetch('/api/events/register')
            if (!response.ok) {
                throw new Error('Failed to fetch registrations')
            }
            const data = await response.json()
            setRegistrations(data)
        } catch {
            toast.error('Failed to load registrations')
        } finally {
            setLoading(false)
        }
    }

    // UI state updater (API call handled inside UnregisterEventButton)
    const handleCancelRegistration = (eventId: string) => {
        setRegistrations(prev =>
            prev.map(reg =>
                reg.event.id === eventId
                    ? { ...reg, status: 'CANCELLED' }
                    : reg
            )
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'REGISTERED':
                return 'bg-green-100 text-green-800'
            case 'ATTENDED':
                return 'bg-blue-100 text-blue-800'
            case 'CANCELLED':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getEventStatusColor = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return 'bg-blue-100 text-blue-800'
            case 'DRAFT':
                return 'bg-yellow-100 text-yellow-800'
            case 'CANCELLED':
                return 'bg-red-100 text-red-800'
            case 'COMPLETED':
                return 'bg-purple-100 text-purple-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">My Registrations</h1>
                <div className="grid gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">My Registrations</h1>

            {registrations.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-8 sm:py-12">
                        <Calendar className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                            No registrations found
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            You haven&apos;t registered for any events yet.
                        </p>
                        <Button asChild>
                            <a href="/events">Browse Events</a>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:gap-6">
                    {registrations.map((registration) => (
                        <Card key={registration.id} className="overflow-hidden">
                            <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                    <div>
                                        <CardTitle className="text-base sm:text-xl mb-2">
                                            {registration.event.title}
                                        </CardTitle>
                                        <div className="flex gap-2 flex-wrap">
                                            <Badge className={getStatusColor(registration.status)}>
                                                Registration: {registration.status}
                                            </Badge>
                                            <Badge className={getEventStatusColor(registration.event.status)}>
                                                Event: {registration.event.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="px-4 py-4 sm:px-6 sm:py-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium truncate">
                                                {formatDate(registration.event.startDate)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                        <span className="truncate">{registration.event.location}</span>
                                    </div>
                                    <div className="mt-2 sm:mt-0">
                                        <UnregisterEventButton
                                            eventId={registration.event.id}
                                            eventTitle={registration.event.title}
                                            onCancel={handleCancelRegistration}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}