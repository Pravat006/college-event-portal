'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { UnregisterEventButton } from '@/components/unregister-event-button'
import { EventRegistrationPageItem } from '@/types'

export default function RegistrationsPage() {
    const [registrations, setRegistrations] = useState<EventRegistrationPageItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRegistrations()
    }, [])

    const fetchRegistrations = async () => {
        try {
            const response = await fetch('/api/events/register', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Failed to fetch registrations: ${response.status} ${errorText}`)
            }

            const result = await response.json()

            if (result.data && Array.isArray(result.data)) {
                setRegistrations(result.data)
            } else if (Array.isArray(result)) {
                setRegistrations(result)
            } else {
                toast.error('Unexpected data format received')
                setRegistrations([])
            }
        } catch (error) {
            console.error('Failed to load registrations:', error)
            toast.error(`${error instanceof Error ? error.message : 'Failed to load registrations'}`)
            setRegistrations([])
        } finally {
            setLoading(false)
        }
    }

    const handleCancelRegistration = (eventId: string) => {
        // Remove the registration from the UI immediately
        setRegistrations(prev =>
            prev.filter(reg => reg.event.id !== eventId)
        )
        toast.success('Registration cancelled successfully')
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
        const day = String(date.getDate()).padStart(2, '0')
        return {
            month, day, full: date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })
        }
    }

    const formatTime = (startDate: string, endDate: string) => {
        const start = new Date(startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        const end = new Date(endDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        return `${start} — ${end}`
    }

    if (loading) {
        return (
            <div className="max-w-6xl mt-16 mx-auto py-10 px-4 sm:px-6 md:px-8">
                <h1 className="text-3xl font-medium mb-8">My Registrations</h1>
                <div className="space-y-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse border-b border-gray-200 pb-8">
                            <div className="flex flex-col md:grid md:grid-cols-[90px_minmax(0,260px)_minmax(0,1fr)] gap-6 md:gap-8">
                                <div className="w-20 h-16 bg-gray-200 rounded"></div>
                                <div className="w-full h-64 bg-gray-200 rounded-md"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (registrations.length === 0) {
        return (
            <div className="max-w-6xl mt-16 mx-auto py-10 px-4 sm:px-6 md:px-8">
                <h1 className="text-3xl font-medium mb-8">My Registrations</h1>
                <div className="text-center py-20 border-b border-gray-200">
                    <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-6" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                        No registrations found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                        You haven&apos;t registered for any events yet. Explore our upcoming events and register to participate.
                    </p>
                    <Link href="/browse-events">
                        <Button className="inline-flex items-center gap-2">
                            Browse Events
                            <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const upcomingRegistrations = registrations.filter(r => r.event.status === 'PUBLISHED' && r.status !== 'CANCELLED')
    const pastRegistrations = registrations.filter(r => r.event.status === 'COMPLETED' || r.status === 'CANCELLED')

    return (
        <div className="max-w-6xl mx-auto mt-16 py-10 px-4 sm:px-6 md:px-8">
            <div className="mb-12">
                <h1 className="text-3xl font-medium mb-2">My Registrations</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your event registrations and view past events
                </p>
            </div>

            {/* Upcoming Events Section */}
            {upcomingRegistrations.length > 0 && (
                <section className="mb-16">
                    <h2 className="text-xl font-semibold mb-8 pb-4 border-b border-gray-200">
                        Upcoming Events ({upcomingRegistrations.length})
                    </h2>
                    <div className="space-y-12">
                        {upcomingRegistrations.map((registration, index) => {
                            const { month, day, full } = formatDate(registration.event.startDate)
                            const timeRange = formatTime(registration.event.startDate, registration.event.endDate)

                            return (
                                <div key={registration.id}>
                                    <div className="flex flex-col md:grid md:grid-cols-[90px_minmax(0,260px)_minmax(0,1fr)] gap-6 md:gap-8">
                                        {/* Date Column */}
                                        <div className="flex md:block items-start">
                                            <div className="text-xs tracking-[0.2em] text-muted-foreground">
                                                {month}
                                            </div>
                                            <div className="md:mt-2 md:text-4xl text-3xl font-semibold leading-none">
                                                {day}
                                            </div>
                                        </div>

                                        {/* Image Column */}
                                        <div className="relative w-full h-56 md:h-64 rounded-md overflow-hidden bg-muted">
                                            <Image
                                                src={registration.event.imageUrl || "/placeholder.svg"}
                                                alt={registration.event.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Content Column */}
                                        <div className="flex flex-col justify-between gap-4">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                                                    <span className="px-2 py-0.5 rounded-full border border-green-300 text-green-700 bg-green-50">
                                                        {registration.status}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-full border border-gray-300">
                                                        {registration.event.status}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-semibold leading-snug">
                                                    {registration.event.title}
                                                </h3>

                                                <p className="text-sm text-muted-foreground">
                                                    {registration.event.location} • {timeRange}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    Registration #{registration.registrationNumber} • Registered on {full}
                                                </p>
                                            </div>

                                            {registration.event.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {registration.event.description}
                                                </p>
                                            )}

                                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
                                                <Link
                                                    href={`/browse-events/event/${registration.event.id}`}
                                                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                                                >
                                                    View Event Details
                                                    <ArrowRight size={14} />
                                                </Link>

                                                {registration.status === 'REGISTERED' && (
                                                    <UnregisterEventButton
                                                        eventId={registration.event.id}
                                                        eventTitle={registration.event.title}
                                                        onCancel={handleCancelRegistration}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {index < upcomingRegistrations.length - 1 && (
                                        <div className="mt-12 border-b border-gray-200" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Past Events Section */}
            {pastRegistrations.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-8 pb-4 border-b border-gray-200">
                        Past Events ({pastRegistrations.length})
                    </h2>
                    <div className="space-y-12">
                        {pastRegistrations.map((registration, index) => {
                            const { month, day } = formatDate(registration.event.startDate)
                            const timeRange = formatTime(registration.event.startDate, registration.event.endDate)

                            return (
                                <div key={registration.id}>
                                    <div className="flex flex-col md:grid md:grid-cols-[90px_minmax(0,260px)_minmax(0,1fr)] gap-6 md:gap-8 opacity-75">
                                        {/* Date Column */}
                                        <div className="flex md:block items-start">
                                            <div className="text-xs tracking-[0.2em] text-muted-foreground">
                                                {month}
                                            </div>
                                            <div className="md:mt-2 md:text-4xl text-3xl font-semibold leading-none">
                                                {day}
                                            </div>
                                        </div>

                                        {/* Image Column */}
                                        <div className="relative w-full h-56 md:h-64 rounded-md overflow-hidden bg-muted">
                                            <Image
                                                src={registration.event.imageUrl || "/placeholder.svg"}
                                                alt={registration.event.title}
                                                fill
                                                className="object-cover grayscale"
                                            />
                                        </div>

                                        {/* Content Column */}
                                        <div className="flex flex-col justify-between gap-4">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                                                    <span className={`px-2 py-0.5 rounded-full border ${registration.status === 'ATTENDED'
                                                        ? 'border-blue-300 text-blue-700 bg-blue-50'
                                                        : 'border-red-300 text-red-700 bg-red-50'
                                                        }`}>
                                                        {registration.status}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-full border border-gray-300">
                                                        {registration.event.status}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-semibold leading-snug">
                                                    {registration.event.title}
                                                </h3>

                                                <p className="text-sm text-muted-foreground">
                                                    {registration.event.location} • {timeRange}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    Registration #{registration.registrationNumber}
                                                </p>
                                            </div>

                                            <div className="pt-2">
                                                <Link
                                                    href={`/browse-events/event/${registration.event.id}`}
                                                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                                                >
                                                    View Event Details
                                                    <ArrowRight size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {index < pastRegistrations.length - 1 && (
                                        <div className="mt-12 border-b border-gray-200" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}
        </div>
    )
}