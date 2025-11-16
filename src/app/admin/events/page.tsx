import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import EventsGrid from '@/components/events-grid'
import CreateEventDialog from '@/components/event/create-event-form'
import { EventWithRelations } from '@/lib/schemas'

export default async function EventsPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        return null
    }

    const events = await prisma.event.findMany({
        where: user.role === 'ADMIN' ? {} : { status: 'PUBLISHED' },
        include: {
            createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
            registrations: { include: { user: { select: { id: true } } } },
            _count: { select: { registrations: true, feedback: true, winners: true, updates: true } }
        },
        orderBy: { startDate: 'asc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold ">Events</h1>
                    <p className="text-gray-300 mt-1">
                        {user.role === 'ADMIN' ? 'Manage all events' : 'Discover and register for events'}
                    </p>
                </div>
                {user.role === 'ADMIN' && (
                    <CreateEventDialog />
                )}
            </div>

            <EventsGrid events={events as EventWithRelations[]} user={user} />
        </div>
    )
}