import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { EventChart } from "@/components/admin/event-chart";
import { StatCard } from "@/components/admin/stat-card";
import { Calendar, Star, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default async function AdminAnalyticsPage() {
    try {
        const user = await requireAdmin();
        const [
            totalEvents,
            totalUsers,
            totalRegistrations,
            totalFeedback,
            recentEvents,
            topEvents
        ] = await Promise.all([
            prisma.event.count(),
            prisma.user.count(),
            prisma.registration.count(),
            prisma.feedback.count(),
            prisma.event.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { title: true, createdAt: true }
            }),
            prisma.event.findMany({
                take: 5,
                include: {
                    _count: {
                        select: { registrations: true }
                    }
                },
                orderBy: {
                    registrations: {
                        _count: 'desc'
                    }
                }
            })
        ]);

        return (
            <div className="p-4 space-y-8 sm:p-6 md:p-8">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Analytics Dashboard</h1>

                {/* Stats Overview */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Events"
                        value={totalEvents}
                        icon={Calendar}
                        trend="5 upcoming events"
                        gradient="linear-gradient(135deg, hsl(262 83% 58% / 0.2), hsl(262 83% 58% / 0.05))"
                    />
                    <StatCard
                        title="Total Users"
                        value={totalUsers.toLocaleString()}
                        icon={Users}
                        trend="+12% from last month"
                        gradient="linear-gradient(135deg, hsl(200 98% 48% / 0.2), hsl(200 98% 48% / 0.05))"
                    />
                    <StatCard
                        title="Total Registrations"
                        value={totalRegistrations.toLocaleString()}
                        icon={TrendingUp}
                        trend="+8% this week"
                        gradient="linear-gradient(135deg, hsl(142 76% 36% / 0.2), hsl(142 76% 36% / 0.05))"
                    />
                    <StatCard
                        title="Total Feedback"
                        value={totalFeedback.toLocaleString()}
                        icon={Star}
                        trend="94% positive"
                        gradient="linear-gradient(135deg, hsl(43 96% 56% / 0.2), hsl(43 96% 56% / 0.05))"
                    />
                </div>

                <EventChart events={topEvents} />

                <Card className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg shadow-sm">
                    <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        <Link href="/admin/events" className="block p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="font-medium text-sm sm:text-base">Manage Events</div>
                            <div className="text-xs sm:text-sm text-gray-500">Create, edit, and manage events</div>
                        </Link>
                        <Link href="/admin/users" className="block p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="font-medium text-sm sm:text-base">Manage Users</div>
                            <div className="text-xs sm:text-sm text-gray-500">View and manage user accounts</div>
                        </Link>
                        <Link href="/admin/registrations" className="block p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="font-medium text-sm sm:text-base">View Registrations</div>
                            <div className="text-xs sm:text-sm text-gray-500">Monitor event registrations</div>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    } catch {
        redirect("/");
    }
}
