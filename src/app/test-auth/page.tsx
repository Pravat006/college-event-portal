import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function TestAuthPage() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Auth Test - No User</h1>
                <p>No user found. You are not signed in.</p>
                <Link href="/sign-in" className="text-blue-600 underline">Sign In</Link>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Auth Test - User Found</h1>
            <div className="bg-gray-100 p-4 rounded">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Role:</strong> <span className={user.role === 'ADMIN' ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>{user.role}</span></p>
                <p><strong>Clerk ID:</strong> {user.clerkId}</p>
            </div>

            <div className="mt-6 space-x-4">
                <Link href="/admin" className="bg-red-600 text-white px-4 py-2 rounded">Try Admin Access</Link>
                <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded">Try Dashboard</Link>
                <Link href="/" className="bg-gray-600 text-white px-4 py-2 rounded">Home</Link>
            </div>

            <div className="mt-6">
                <h2 className="text-lg font-bold mb-2">Expected Behavior:</h2>
                <ul className="list-disc pl-6">
                    <li>If Role = USER: Should NOT be able to access /admin</li>
                    <li>If Role = ADMIN: Should be able to access /admin</li>
                    <li>Both roles should be able to access /dashboard</li>
                </ul>
            </div>
        </div>
    );
}
