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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}