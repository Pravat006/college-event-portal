import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import EventsGrid from '@/components/events-grid'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function EventsPage() {
    const user = await getCurrentUser()

    if (!user) {
        return null
    }

    const events = await prisma.event.findMany({
        where: user.role === 'ADMIN' ? {} : { status: 'PUBLISHED' },
        include: {
            createdBy: { select: { firstName: true, lastName: true } },
            registrations: { include: { user: { select: { id: true } } } },
            _count: { select: { registrations: true, feedback: true } }
        },
        orderBy: { startDate: 'asc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Events</h1>
                    <p className="text-gray-600 mt-1">
                        {user.role === 'ADMIN' ? 'Manage all events' : 'Discover and register for events'}
                    </p>
                </div>
                {user.role === 'ADMIN' && (
                    <Link href="/events/create">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Event
                        </Button>
                    </Link>
                )}
            </div>

            <EventsGrid events={events} user={user} />
        </div>
    )
}