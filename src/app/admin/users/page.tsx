import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Image from "next/image";

export default async function AdminUsersPage() {
    try {
        // This ensures only admins can access this page
        const user = await requireAdmin();

        // Get all users with registration count
        const users = await prisma.user.findMany({
            where: {
                registrations: {
                    some: {}
                }
            },
            include: {
                _count: {
                    select: {
                        registrations: true

                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        console.log('AdminUsersPage: Fetched users:', users);

        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar user={user} />
                <div className="flex">
                    <Sidebar user={user} />
                    <main className="flex-1 ml-64 pt-16">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                                <div className="text-sm text-gray-500">
                                    Total Users: {users.length}
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
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Registrations
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Joined
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((userData) => (
                                            <tr key={userData.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {userData.imageUrl ? (
                                                                <Image
                                                                    className="h-10 w-10 rounded-full"
                                                                    src={userData.imageUrl}
                                                                    alt="image"
                                                                    width={40}
                                                                    height={40}
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {userData.firstName?.charAt(0) || userData.email?.charAt(0) || '?'}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {userData.firstName} {userData.lastName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {userData.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${userData.role === 'ADMIN'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {userData.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {userData._count.registrations}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(userData.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <select
                                                        defaultValue={userData.role}
                                                        className="border border-gray-300 rounded px-2 py-1 text-sm">
                                                        <option value="USER">User</option>
                                                        <option value="ADMIN">Admin</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {users.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">No users found.</p>
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
