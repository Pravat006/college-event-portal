'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface UnregisterEventButtonProps {
    eventId: string
    eventTitle: string
    onCancel: (eventId: string) => void
    disabled?: boolean
}

export function UnregisterEventButton({
    eventId,
    eventTitle,
    onCancel,
    disabled = false
}: UnregisterEventButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleCancel = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/events/register', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ eventId }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Failed to cancel registration')
            }

            onCancel(eventId)
            toast.success(result.message || 'Registration cancelled successfully')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to cancel registration')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={disabled || isLoading}
                >
                    <X className="h-4 w-4 mr-1" />
                    {isLoading ? 'Cancelling...' : 'Cancel'}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Registration</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to cancel your registration for{' '}
                        <strong>{eventTitle}</strong>? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Keep Registration</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleCancel}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isLoading}
                    >
                        Cancel Registration
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}