import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SendEventUpdate } from '@/components/admin/send-event-update'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'

export default async function AdminEventDetailsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const user = await requireAdmin()
    if (!user) {
        redirect('/sign-in')
    }

    const { id } = await params


    // Get event details
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            createdBy: {
                select: { firstName: true, lastName: true }
            },
            _count: {
                select: {
                    registrations: true,
                    feedback: true,
                    updates: true
                }
            }
        }
    })

    if (!event) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p>Event not found</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/events">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">{event.title}</h1>
                    <p className="text-muted-foreground">Manage event and send updates</p>
                </div>
            </div>

            {/* Event Details Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                    <CardDescription>Overview of event information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Start:</span>
                                <span>{format(new Date(event.startDate), 'PPP p')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Location:</span>
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Registrations:</span>
                                <span>{event._count.registrations} / {event.capacity}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Status:</span>
                                <Badge>{event.status}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Category:</span>
                                <Badge variant="outline">{event.category}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Updates Sent:</span>
                                <Badge variant="secondary">{event._count.updates}</Badge>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Description:</p>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Send Update Component */}
            <SendEventUpdate event={event} />
        </div>
    )
}
