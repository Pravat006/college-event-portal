'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Users, Clock, DollarSign, X } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const registrationSchema = z.object({
    registrationNumber: z.string()
        .min(1, 'Registration number is required')
        .regex(/^\d+$/, 'Registration number must contain only digits'),
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    semester: z.number().min(1, 'Semester must be between 1-8').max(8, 'Semester must be between 1-8')
})

type RegistrationFormData = z.infer<typeof registrationSchema>

interface Event {
    id: string
    title: string
    description: string
    imageUrl?: string | null
    location: string
    startDate: Date
    endDate: Date
    capacity: number
    price: number | null
    category: string
    _count: { registrations: number }
}

interface EventRegistrationFormProps {
    event: Event
    onClose: () => void
    onSuccess: () => void
}

export default function EventRegistrationForm({ event, onClose, onSuccess }: EventRegistrationFormProps) {
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema)
    })

    const onSubmit = async (data: RegistrationFormData) => {
        setLoading(true)
        try {
            // Get the base URL for API calls
            const baseUrl = typeof window !== 'undefined' && window.location.origin
                ? window.location.origin
                : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

            const response = await fetch(`${baseUrl}/api/events/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: event.id,
                    ...data
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Registration API error:', errorText)
                let errorMessage = 'Registration failed'

                try {
                    const errorData = JSON.parse(errorText)
                    errorMessage = errorData.message || errorMessage

                    // Display field errors if available
                    if (errorData.errors) {
                        Object.entries(errorData.errors).forEach(([field, errors]) => {
                            if (Array.isArray(errors) && errors.length > 0) {
                                toast.error(`${field}: ${errors[0]}`)
                            }
                        })
                    }
                } catch (e) {
                    // If JSON parsing fails, use the raw error text
                    errorMessage = errorText || errorMessage
                }

                toast.error(errorMessage)
                setLoading(false)
                return
            }

            const result = await response.json()
            toast.success('Successfully registered! Check your email for confirmation.')
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Registration error:', error)
            toast.error('Something went wrong with the registration process')
        } finally {
            setLoading(false)
        }
    }

    const getCategoryColor = (category: string) => {
        const colors = {
            'ACADEMIC': 'bg-blue-100 text-blue-800',
            'CULTURAL': 'bg-purple-100 text-purple-800',
            'SPORTS': 'bg-green-100 text-green-800',
            'TECHNICAL': 'bg-orange-100 text-orange-800',
            'SOCIAL': 'bg-pink-100 text-pink-800',
            'WORKSHOP': 'bg-yellow-100 text-yellow-800'
        }
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <Card className="border-0 shadow-none">
                    <CardHeader className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-4 top-4"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <CardTitle className="text-2xl">Register for Event</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Event Details */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                                    {event.category}
                                </span>
                            </div>

                            <p className="text-gray-600 mb-4 text-sm">{event.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                                    <span>{format(new Date(event.startDate), 'EEEE, MMM dd, yyyy')}</span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                                    <span>
                                        {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                                    </span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <MapPin className="h-4 w-4 mr-2 text-red-600" />
                                    <span>{event.location}</span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <Users className="h-4 w-4 mr-2 text-purple-600" />
                                    <span>{event._count.registrations} / {event.capacity} registered</span>
                                </div>

                                {event.price && event.price > 0 && (
                                    <div className="flex items-center text-green-600 font-semibold">
                                        <DollarSign className="h-4 w-4 mr-1" />
                                        <span>${event.price}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="registrationNumber">College Registration Number *</Label>
                                <Input
                                    id="registrationNumber"
                                    {...register('registrationNumber')}
                                    placeholder="Enter your college registration number"
                                    className="w-full"
                                    maxLength={20} // Prevent extremely long inputs
                                />
                                {errors.registrationNumber && (
                                    <p className="text-sm text-red-600">{errors.registrationNumber.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input
                                    id="fullName"
                                    {...register('fullName')}
                                    placeholder="Enter your full name"
                                    className="w-full"
                                />
                                {errors.fullName && (
                                    <p className="text-sm text-red-600">{errors.fullName.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="semester">Current Semester *</Label>
                                <Select onValueChange={(value) => setValue('semester', parseInt(value))}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select your current semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1st Semester</SelectItem>
                                        <SelectItem value="2">2nd Semester</SelectItem>
                                        <SelectItem value="3">3rd Semester</SelectItem>
                                        <SelectItem value="4">4th Semester</SelectItem>
                                        <SelectItem value="5">5th Semester</SelectItem>
                                        <SelectItem value="6">6th Semester</SelectItem>
                                        <SelectItem value="7">7th Semester</SelectItem>
                                        <SelectItem value="8">8th Semester</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.semester && (
                                    <p className="text-sm text-red-600">{errors.semester.message}</p>
                                )}
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-900 mb-2">Registration Information</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• You will receive a confirmation email after registration</li>
                                    <li>• Please arrive 15 minutes early for check-in</li>
                                    <li>• Bring a valid student ID for verification</li>
                                    {event.price && event.price > 0 && <li>• Payment will be collected at the event</li>}
                                </ul>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading} className={loading ? "opacity-70" : ""}>
                                    {loading ? 'Registering...' : 'Complete Registration'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}










































