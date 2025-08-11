'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteEventButtonProps {
    eventId: string
    eventTitle: string
}

export default function DeleteEventButton({ eventId, eventTitle }: DeleteEventButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to cancel "${eventTitle}"? This will notify all registered users.`)) {
            return
        }

        setIsDeleting(true)
        try {
            const response = await fetch(`/api/events?id=${eventId}`, {  // Changed URL
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                await response.json();
                alert('Event cancelled successfully! All registered users have been notified.');
                router.refresh()
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                alert(`Failed to cancel event: ${errorData.message}`);
            }
        } catch {
            alert('An error occurred while cancelling the event.');
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-3 py-1 rounded text-sm transition-colors ${isDeleting
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-orange-100 text-orange-600 hover:bg-orange-200 hover:text-orange-700'
                }`}
        >
            {isDeleting ? 'Cancelling...' : 'Cancel Event'}
        </button>
    )
}