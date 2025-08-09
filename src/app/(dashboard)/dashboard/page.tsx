import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DashboardStats from '@/components/dashboard-stats'
import RecentEvents from '@/components/recent-events'
import UpcomingEvents from '@/components/upcoming-events'

export default async function DashboardPage() {
    const user = await getCurrentUser()

    if (!user) {
        return null
    }


    const [totalEvents, totalRegistrations, upcomingEvents, recentEvents] = await Promise.all([
        user.role === 'ADMIN'
            ? prisma.event.count()
            : prisma.registration.count({ where: { userId: user.id } }),
        user.role === 'ADMIN'
            ? prisma.registration.count()
            : prisma.registration.count({ where: { userId: user.id, status: 'REGISTERED' } }),
        prisma.event.findMany({
            where: {
                startDate: { gte: new Date() },
                status: 'PUBLISHED',
                ...(user.role !== 'ADMIN' && {
                    OR: [
                        { registrations: { some: { userId: user.id } } },
                        { registrations: { none: {} } }
                    ]
                })
            },
            include: {
                registrations: true,
                _count: { select: { registrations: true } }
            },
            orderBy: { startDate: 'asc' },
            take: 5
        }),
        prisma.event.findMany({
            where: user.role === 'ADMIN' ? {} : {
                registrations: { some: { userId: user.id } }
            },
            include: {
                registrations: true,
                _count: { select: { registrations: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        })
    ])

    const feedbackCount = user.role === 'ADMIN'
        ? await prisma.feedback.count()
        : await prisma.feedback.count({ where: { userId: user.id } })

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user.firstName}!
                </h1>
                <p className="text-gray-600 mt-2">
                    {user.role === 'ADMIN' ? 'Admin Dashboard' : 'Student Dashboard'}
                </p>
            </div>

            <DashboardStats
                totalEvents={totalEvents}
                totalRegistrations={totalRegistrations}
                feedbackCount={feedbackCount}
                userRole={user.role}
            />

            <div className="grid lg:grid-cols-2 gap-8">
                <UpcomingEvents events={upcomingEvents} userRole={user.role} />
                <RecentEvents events={recentEvents} userRole={user.role} />
            </div>
        </div>
    )
}