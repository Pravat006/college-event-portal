import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, Star, TrendingUp } from 'lucide-react'

interface DashboardStatsProps {
    totalEvents: number
    totalRegistrations: number
    feedbackCount: number
    userRole: string
}

export default function DashboardStats({
    totalEvents,
    totalRegistrations,
    feedbackCount,
    userRole
}: DashboardStatsProps) {
    const stats = [
        {
            title: userRole === 'ADMIN' ? 'Total Events' : 'Registered Events',
            value: totalEvents,
            icon: Calendar,
            color: 'text-blue-600'
        },
        {
            title: userRole === 'ADMIN' ? 'Total Registrations' : 'Active Registrations',
            value: totalRegistrations,
            icon: Users,
            color: 'text-green-600'
        },
        {
            title: userRole === 'ADMIN' ? 'Total Feedback' : 'My Feedback',
            value: feedbackCount,
            icon: Star,
            color: 'text-yellow-600'
        },
        {
            title: 'Growth',
            value: '+12%',
            icon: TrendingUp,
            color: 'text-purple-600'
        }
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 py-3 sm:px-4 sm:py-4">
                        <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                    </CardHeader>
                    <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                        <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}