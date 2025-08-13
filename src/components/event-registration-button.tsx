'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import EventRegistrationForm from '@/components/event-registration-form'
import toast from 'react-hot-toast'

interface Event {
    id: string
    title: string
    description: string
    imageUrl?: string
    location: string
    startDate: Date
    endDate: Date
    capacity: number
    price: number
    category: string
    status: string
    _count: { registrations: number }
}

interface User {
    id: string
    role: string
}

interface EventRegistrationButtonProps {
    event: Event
    user: User | null
    isRegistered?: boolean
    isFull: boolean
}

export default function EventRegistrationButton({
    event,
    user,
    isRegistered = false,
    isFull
}: EventRegistrationButtonProps) {
    const [showForm, setShowForm] = useState(false)
    const router = useRouter()

    const handleRegisterClick = () => {
        if (!user) {
            router.push('/sign-in')
            return
        }
        setShowForm(true)
    }

    const handleRegistrationSuccess = () => {
        window.location.reload()
    }

    // Don't show button for admins
    if (user?.role === 'ADMIN') {
        return (
            <div className="text-center py-2">
                <span className="text-sm text-gray-500">Admin View</span>
            </div>
        )
    }

    // Event is cancelled
    if (event.status === 'CANCELLED') {
        return (
            <Button disabled className="w-full" variant="destructive">
                Event Cancelled
            </Button>
        )
    }

    // Event is not published
    if (event.status !== 'PUBLISHED') {
        return (
            <Button disabled className="w-full" variant="outline">
                Not Open for Registration
            </Button>
        )
    }

    // User is already registered
    if (isRegistered) {
        return (
            <Button disabled className="w-full" variant="secondary">
                ✓ Registered
            </Button>
        )
    }

    // Event is full
    if (isFull) {
        return (
            <Button disabled className="w-full" variant="outline">
                Event Full
            </Button>
        )
    }

    // User not logged in
    if (!user) {
        return (
            <Button onClick={handleRegisterClick} className="w-full">
                Sign In to Register
            </Button>
        )
    }

    // Available for registration
    return (
        <>
            <Button
                onClick={handleRegisterClick}
                className="w-full"
            >
                Register Now
            </Button>

            {showForm && (
                <EventRegistrationForm
                    event={event}
                    onClose={() => setShowForm(false)}
                    onSuccess={handleRegistrationSuccess}
                />
            )}
        </>
    )
}