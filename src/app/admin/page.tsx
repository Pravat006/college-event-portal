import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Link from "next/link";

export default async function AdminPage() {
    try {

        const user = await requireAdmin();

        const [totalEvents, totalRegistrations, feedbackCount] = await Promise.all([
            prisma.event.count(),
            prisma.registration.count(),
            prisma.feedback.count()
        ]);

        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar user={user} />
                <div className="flex">
                    <Sidebar user={user} />
                    <main className="flex-1 ml-64 pt-16">
                        <div className="p-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

                            <div className="mb-8">
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h2 className="text-lg font-semibold mb-4">Admin Actions</h2>
                                    <div className="space-y-3">
                                        <Link href="/admin/events" className="block text-blue-600 hover:underline">
                                            Manage Events
                                        </Link>
                                        <Link href="/admin/users" className="block text-blue-600 hover:underline">
                                            Manage Users
                                        </Link>
                                        <Link href="/admin/registrations" className="block text-blue-600 hover:underline">
                                            Manage Registrations
                                        </Link>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
                                    <div className="space-y-3">
                                        <p>Total events: <span className="font-medium">{totalEvents}</span></p>
                                        <p>Total registrations: <span className="font-medium">{totalRegistrations}</span></p>
                                        <p>Total feedback submissions: <span className="font-medium">{feedbackCount}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    } catch {
        redirect("/");
    }
}
