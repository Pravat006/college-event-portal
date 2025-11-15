import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EventUpdatesList } from '@/components/admin/event-updates-list'
import { requireAdmin } from '@/lib/auth'

export default async function AdminSendUpdatesPage() {
    const user = await requireAdmin()


    if (!user || user.role !== 'ADMIN') {
        redirect('/dashboard')
    }

    const events = await prisma.event.findMany({
        include: {
            _count: {
                select: {
                    registrations: true,
                    updates: true
                }
            },
            createdBy: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        },
        orderBy: {
            startDate: 'desc'
        }
    })

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Send Event Updates</h1>
                <p className="text-muted-foreground">
                    Select an event to send real-time updates to all registered participants
                </p>
            </div>

            <EventUpdatesList events={events} />
        </div>
    )
}
