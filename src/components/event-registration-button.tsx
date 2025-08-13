'use client'

import { useState, memo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import EventRegistrationForm from '@/components/event-registration-form'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

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

function EventRegistrationButton({
    event,
    user,
    isRegistered = false,
    isFull
}: EventRegistrationButtonProps) {
    const [showForm, setShowForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleRegisterClick = () => {
        if (!user) {
            setIsLoading(true)
            try {
                router.push('/sign-in')
            } catch (error) {
                console.error('Navigation error:', error)
                toast.error('Unable to navigate to sign-in page')
                setIsLoading(false)
            }
            return
        }
        setShowForm(true)
    }

    const handleRegistrationSuccess = () => {
        toast.success('Event registration successful!')
        // Use router.refresh() instead of full page reload for better UX
        router.refresh()
        // Fallback to window.location.reload() if router.refresh() doesn't update the UI
        setTimeout(() => {
            window.location.reload()
        }, 1000)
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
            <Button
                onClick={handleRegisterClick}
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirecting...
                    </>
                ) : (
                    'Sign In to Register'
                )}
            </Button>
        )
    }

    // Available for registration
    return (
        <>
            <Button
                onClick={handleRegisterClick}
                className="w-full"
                disabled={isLoading}
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

// Create a memoized version of the component to prevent unnecessary re-renders
const MemoizedEventRegistrationButton = memo(EventRegistrationButton);

// Export the memoized version as default
export default MemoizedEventRegistrationButton;