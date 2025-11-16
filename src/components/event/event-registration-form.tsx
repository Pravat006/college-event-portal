'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import toast from 'react-hot-toast'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog"
import { EventRegistrationFormProps } from '@/types'

const registrationSchema = z.object({
    registrationNumber: z.string()
        .min(1, 'Registration number is required')
        .regex(/^\d+$/, 'Registration number must contain only digits'),
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    semester: z.number().min(1, 'Semester must be between 1-8').max(8, 'Semester must be between 1-8')
})

type RegistrationFormData = z.infer<typeof registrationSchema>

export default function EventRegistrationForm({
    eventId,
    onSuccess,
    disable,
    status,
    registrationStatus,
}: EventRegistrationFormProps) {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { isSignedIn } = useUser()

    // Redirect to sign-in if user tries to open dialog while unauthenticated
    useEffect(() => {
        if (open && !isSignedIn) {
            setOpen(false)
            router.push('/sign-in')
        }
    }, [open, isSignedIn, router])

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema)
    })

    const onSubmit = async (data: RegistrationFormData) => {
        setLoading(true)
        try {
            const response = await fetch('/api/events/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: eventId,
                    ...data
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                let errorMessage = 'Registration failed'

                try {
                    const errorData = JSON.parse(errorText)
                    errorMessage = errorData.message || errorMessage

                    if (errorData.errors) {
                        Object.entries(errorData.errors).forEach(([field, errors]) => {
                            if (Array.isArray(errors) && errors.length > 0) {
                                toast.error(`${field}: ${errors[0]}`)
                            }
                        })
                    }
                } catch {
                    errorMessage = errorText || errorMessage
                }

                toast.error(errorMessage)
                setLoading(false)
                return
            }

            toast.success('Successfully registered! Check your email for confirmation.')
            setOpen(false)
            router.refresh()
            onSuccess?.()
        } catch (error) {
            console.error('Registration error:', error)
            toast.error('Something went wrong with the registration process')
        } finally {
            setLoading(false)
        }
    }

    // derive label & disabled state
    const hasEnded = status === 'COMPLETED' || status === 'CANCELLED' // adjust to your EventStatus enum
    let buttonLabel = 'Register'
    let isDisabled = disable || loading

    if (registrationStatus === 'REGISTERED') {
        buttonLabel = 'Registered'
        isDisabled = true
    } else if (registrationStatus === 'ATTENDED') {
        buttonLabel = 'Attended'
        isDisabled = true
    } else if (registrationStatus === 'CANCELLED') {
        buttonLabel = 'Registration Cancelled'
        isDisabled = true
    } else if (hasEnded) {
        buttonLabel = 'Ended'
        isDisabled = true
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild disabled={isDisabled}>
                <Button className="mx-2 rounded-sm">
                    {buttonLabel}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0">
                <DialogHeader className="relative border-b p-4">
                    <DialogTitle className="text-xl pr-8">Register for Event</DialogTitle>
                    <DialogDescription className="text-sm">
                        Complete the form below to register
                    </DialogDescription>
                </DialogHeader>
                <CardContent className="space-y-4 p-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="registrationNumber" className="text-sm">
                                Registration Number <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="registrationNumber"
                                {...register('registrationNumber')}
                                placeholder="Enter registration number"
                                className="h-9"
                                maxLength={20}
                            />
                            {errors.registrationNumber && (
                                <p className="text-xs text-destructive">{errors.registrationNumber.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="fullName" className="text-sm">
                                Full Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="fullName"
                                {...register('fullName')}
                                placeholder="Enter your full name"
                                className="h-9"
                            />
                            {errors.fullName && (
                                <p className="text-xs text-destructive">{errors.fullName.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="semester" className="text-sm">
                                Current Semester <span className="text-destructive">*</span>
                            </Label>
                            <Select onValueChange={(value) => setValue('semester', parseInt(value))}>
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Select semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                        <SelectItem key={sem} value={sem.toString()}>
                                            {sem}{sem === 1 ? 'st' : sem === 2 ? 'nd' : sem === 3 ? 'rd' : 'th'} Semester
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.semester && (
                                <p className="text-xs text-destructive">{errors.semester.message}</p>
                            )}
                        </div>

                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="p-3">
                                <h4 className="font-medium mb-1.5 text-xs">Important Information</h4>
                                <ul className="text-xs text-muted-foreground space-y-0.5">
                                    <li className="flex items-start gap-1.5">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>Confirmation email will be sent</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>Arrive 15 minutes early</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>Bring valid student ID</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <DialogFooter className="flex justify-end gap-2 pt-1">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={loading} className="h-9">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading} className="h-9">
                                {loading ? 'Registering...' : 'Register'}
                            </Button>
                        </DialogFooter>
                    </form>
                </CardContent>
            </DialogContent>
        </Dialog>
    )
}










































