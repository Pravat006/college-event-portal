import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function AdminUsersPage() {
    try {
        const users = await prisma.user.findMany({
            where: {
                registrations: {
                    some: {},
                },
            },
            include: {
                _count: {
                    select: {
                        registrations: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return (
            <div >
                <div className=" flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold ">
                        User Management
                    </h1>
                    <div className="text-sm text-gray-500">
                        Total Users: {users.length}
                    </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Registrations</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((userData) => (
                                <TableRow key={userData.id}>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <div className="shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                                                {userData.imageUrl ? (
                                                    <Image
                                                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                                                        src={userData.imageUrl}
                                                        alt="image"
                                                        width={40}
                                                        height={40}
                                                    />
                                                ) : (
                                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                                                            {userData.firstName?.charAt(0) ||
                                                                userData.email?.charAt(0) ||
                                                                "?"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-3 sm:ml-4">
                                                <div className="text-xs sm:text-sm font-medium text-gray-900">
                                                    {userData.firstName} {userData.lastName}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm text-gray-500">
                                        {userData.email}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${userData.role === "ADMIN"
                                                ? "bg-purple-100 text-purple-800"
                                                : "bg-green-100 text-green-800"
                                                }`}
                                        >
                                            {userData.role}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm text-gray-500">
                                        {userData._count.registrations}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm text-gray-500">
                                        {new Date(userData.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm font-medium">
                                        <select
                                            defaultValue={userData.role}
                                            className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm"
                                        >
                                            <option value="USER">User</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {users.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No users found.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch {
        redirect("/");
    }
}
