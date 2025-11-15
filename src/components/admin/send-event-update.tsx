'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Send, Users, AlertCircle } from 'lucide-react'
import { useEventSocket } from '@/hooks/use-socket'
import { useUser } from '@clerk/nextjs'
import toast from 'react-hot-toast'

const updateSchema = z.object({
    content: z.string()
        .min(10, 'Message must be at least 10 characters')
        .max(1000, 'Message must be less than 1000 characters')
})

type UpdateFormData = z.infer<typeof updateSchema>

interface Event {
    id: string
    title: string
    status: string
    _count: { registrations: number }
}

interface SendEventUpdateProps {
    event: Event
}

export function SendEventUpdate({ event }: SendEventUpdateProps) {
    const { user } = useUser()
    const [loading, setLoading] = useState(false)
    const { sendUpdate, isConnected } = useEventSocket(event.id)

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UpdateFormData>({
        resolver: zodResolver(updateSchema)
    })

    const onSubmit = async (data: UpdateFormData) => {
        if (!user?.id) {
            toast.error('You must be logged in')
            return
        }
        setLoading(true)
        try {

            const response = await fetch(`/api/admin/events/${event.id}/updates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: data.content
                })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to send update')
            }

            await response.json()

            sendUpdate(data.content)

            toast.success('Update sent successfully!')
            reset()
        } catch (error) {
            console.error('Error sending update:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to send update')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send Event Update
                </CardTitle>
                <CardDescription>
                    Send real-time updates to all {event._count.registrations} registered participants
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Connection Status */}
                <div className="flex items-center gap-2 text-sm">
                    <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-muted-foreground">
                        {isConnected ? 'Live connection active' : 'Connecting...'}
                    </span>
                </div>

                {/* Event Info */}
                <Card className="bg-muted/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium">{event.title}</h4>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                    <Users className="h-3 w-3" />
                                    <span>{event._count.registrations} participants</span>
                                </div>
                            </div>
                            <Badge variant={event.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                                {event.status}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Message */}
                    <div className="space-y-2">
                        <Label htmlFor="content">Update Message</Label>
                        <Textarea
                            id="content"
                            {...register('content')}
                            placeholder="Enter your update message for all registered participants..."
                            rows={5}
                            className="resize-none"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            {errors.content && (
                                <span className="text-destructive">{errors.content.message}</span>
                            )}
                            <span className="ml-auto">{watch('content')?.length || 0}/1000</span>
                        </div>
                    </div>

                    {/* Preview */}
                    {watch('content') && (
                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="p-4">
                                <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    Preview
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {watch('content')}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    This will be sent to {event._count.registrations} participants
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <Button
                        type="submit"
                        disabled={loading || !isConnected}
                        className="w-full"
                    >
                        <Send className="mr-2 h-4 w-4" />
                        {loading ? 'Sending Update...' : 'Send Update to All Participants'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
