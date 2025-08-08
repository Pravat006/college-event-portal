import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export default async function AdminRegistrationsPage() {
    try {
        // This ensures only admins can access this page
        const user = await requireAdmin();

        // Get all registrations with user and event details
        const registrations = await prisma.registration.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                event: {
                    select: {
                        title: true,
                        startDate: true
                    }
                }
            },
            orderBy: {
                registeredAt: 'desc'
            }
        });

        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar user={user} />
                <div className="flex">
                    <Sidebar user={user} />
                    <main className="flex-1 ml-64 pt-16">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Registration Management</h1>
                                <div className="text-sm text-gray-500">
                                    Total Registrations: {registrations.length}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Event
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Event Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Registered On
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {registrations.map((registration) => (
                                            <tr key={registration.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {registration.user.firstName} {registration.user.lastName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {registration.user.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {registration.event.title}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(registration.event.startDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(registration.registeredAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Confirmed
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                        View Details
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900">
                                                        Cancel
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {registrations.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">No registrations found.</p>
                                    </div>
                                )}
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
