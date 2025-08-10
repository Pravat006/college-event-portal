'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface Event {
    id: string
    title: string
    status: string
    _count: { registrations: number }
    capacity: number
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
    const [registering, setRegistering] = useState(false)
    const router = useRouter()

    const handleRegister = async () => {
        if (!user) {
            router.push('/sign-in')
            return
        }

        setRegistering(true)
        try {
            const response = await fetch('/api/events/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId: event.id })
            })

            if (response.ok) {
                toast.success('Successfully registered! Check your email for confirmation.')
                window.location.reload()
            } else {
                const errJson = await response.json()
                toast.error(errJson.message || 'Registration failed')
            }
        } catch {
            toast.error('Something went wrong')
        } finally {
            setRegistering(false)
        }
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
            <Button onClick={handleRegister} className="w-full">
                Sign In to Register
            </Button>
        )
    }

    // Available for registration
    return (
        <Button
            onClick={handleRegister}
            disabled={registering}
            className="w-full"
        >
            {registering ? 'Registering...' : 'Register Now'}
        </Button>
    )
}