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
            console.log('🗑️ Attempting to cancel event:', eventId);

            const response = await fetch(`/api/events?id=${eventId}`, {  // Changed URL
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            console.log('🗑️ Cancel response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('🗑️ Cancel success:', result);
                alert('Event cancelled successfully! All registered users have been notified.');
                router.refresh()
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                console.error('🗑️ Cancel failed:', errorData);
                alert(`Failed to cancel event: ${errorData.message}`);
            }
        } catch (error) {
            console.error('🗑️ Cancel error:', error);
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