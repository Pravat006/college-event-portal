'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

const eventSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    location: z.string().min(1, 'Location is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    capacity: z.number().min(1, 'Capacity must be at least 1'),
    price: z.number().min(0, 'Price cannot be negative'),
    category: z.enum(['ACADEMIC', 'CULTURAL', 'SPORTS', 'TECHNICAL', 'SOCIAL', 'WORKSHOP']),
    imageUrl: z.string().optional()
})

type EventFormData = z.infer<typeof eventSchema>

export default function CreateEventForm() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<EventFormData>({
        resolver: zodResolver(eventSchema)
    })

    const onSubmit = async (data: EventFormData) => {
        setLoading(true)
        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                toast.success('Event created successfully!')
                router.push('/events')
            } else {
                const error = await response.json()
                toast.error(error.message || 'Failed to create event')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input
                            id="title"
                            {...register('title')}
                            placeholder="Enter event title"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-600">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            placeholder="Describe your event"
                            rows={4}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                {...register('location')}
                                placeholder="Event location"
                            />
                            {errors.location && (
                                <p className="text-sm text-red-600">{errors.location.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select onValueChange={(value) => setValue('category', value as EventFormData['category'])}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACADEMIC">Academic</SelectItem>
                                    <SelectItem value="CULTURAL">Cultural</SelectItem>
                                    <SelectItem value="SPORTS">Sports</SelectItem>
                                    <SelectItem value="TECHNICAL">Technical</SelectItem>
                                    <SelectItem value="SOCIAL">Social</SelectItem>
                                    <SelectItem value="WORKSHOP">Workshop</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <p className="text-sm text-red-600">{errors.category.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date & Time</Label>
                            <Input
                                id="startDate"
                                type="datetime-local"
                                {...register('startDate')}
                            />
                            {errors.startDate && (
                                <p className="text-sm text-red-600">{errors.startDate.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date & Time</Label>
                            <Input
                                id="endDate"
                                type="datetime-local"
                                {...register('endDate')}
                            />
                            {errors.endDate && (
                                <p className="text-sm text-red-600">{errors.endDate.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input
                                id="capacity"
                                type="number"
                                {...register('capacity', { valueAsNumber: true })}
                                placeholder="Maximum attendees"
                            />
                            {errors.capacity && (
                                <p className="text-sm text-red-600">{errors.capacity.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                {...register('price', { valueAsNumber: true })}
                                placeholder="0.00"
                            />
                            {errors.price && (
                                <p className="text-sm text-red-600">{errors.price.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                        <Input
                            id="imageUrl"
                            {...register('imageUrl')}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Event'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}