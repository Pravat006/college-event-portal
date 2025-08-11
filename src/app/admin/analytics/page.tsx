import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export default async function AdminAnalyticsPage() {
    try {
        // This ensures only admins can access this page
        const user = await requireAdmin();

        // Get analytics data
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
            <div className="min-h-screen bg-gray-50">
                <Navbar user={user} />
                <div className="flex">
                    <Sidebar user={user} />
                    <main className="flex-1 lg:ml-64 pt-16">
                        <div className="p-4 sm:p-6 md:p-8">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Analytics Dashboard</h1>

                            {/* Stats Overview */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                                <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm">
                                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{totalEvents}</div>
                                    <div className="text-sm sm:text-base text-gray-600">Total Events</div>
                                </div>
                                <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm">
                                    <div className="text-xl sm:text-2xl font-bold text-green-600">{totalUsers}</div>
                                    <div className="text-sm sm:text-base text-gray-600">Total Users</div>
                                </div>
                                <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm">
                                    <div className="text-xl sm:text-2xl font-bold text-purple-600">{totalRegistrations}</div>
                                    <div className="text-sm sm:text-base text-gray-600">Total Registrations</div>
                                </div>
                                <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm">
                                    <div className="text-xl sm:text-2xl font-bold text-orange-600">{totalFeedback}</div>
                                    <div className="text-sm sm:text-base text-gray-600">Total Feedback</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                {/* Recent Events */}
                                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                                    <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Events</h2>
                                    <div className="space-y-2 sm:space-y-3">
                                        {recentEvents.map((event, index) => (
                                            <div key={index} className="flex justify-between items-center py-1 sm:py-2 border-b border-gray-100 last:border-b-0">
                                                <div className="font-medium text-sm sm:text-base">{event.title}</div>
                                                <div className="text-xs sm:text-sm text-gray-500">
                                                    {new Date(event.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                        {recentEvents.length === 0 && (
                                            <p className="text-gray-500 text-center py-4">No events found</p>
                                        )}
                                    </div>
                                </div>

                                {/* Top Events by Registration */}
                                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                                    <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Most Popular Events</h2>
                                    <div className="space-y-2 sm:space-y-3">
                                        {topEvents.map((event) => (
                                            <div key={event.id} className="flex justify-between items-center py-1 sm:py-2 border-b border-gray-100 last:border-b-0">
                                                <div>
                                                    <div className="font-medium text-sm sm:text-base">{event.title}</div>
                                                    <div className="text-xs sm:text-sm text-gray-500">
                                                        {new Date(event.startDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="text-base sm:text-lg font-semibold text-blue-600">
                                                    {event._count.registrations}
                                                </div>
                                            </div>
                                        ))}
                                        {topEvents.length === 0 && (
                                            <p className="text-gray-500 text-center py-4">No events found</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional metrics could go here */}
                            <div className="mt-6 sm:mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                    <a href="/admin/events" className="block p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div className="font-medium text-sm sm:text-base">Manage Events</div>
                                        <div className="text-xs sm:text-sm text-gray-500">Create, edit, and manage events</div>
                                    </a>
                                    <a href="/admin/users" className="block p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div className="font-medium text-sm sm:text-base">Manage Users</div>
                                        <div className="text-xs sm:text-sm text-gray-500">View and manage user accounts</div>
                                    </a>
                                    <a href="/admin/registrations" className="block p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div className="font-medium text-sm sm:text-base">View Registrations</div>
                                        <div className="text-xs sm:text-sm text-gray-500">Monitor event registrations</div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    } catch {
        // If user is not an admin, redirect to home
        redirect("/");
    }
}
