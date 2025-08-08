import { requireAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    console.log('AdminLayout: Starting admin layout check...')

    let user;
    try {
        // This ensures only admins can access any admin page
        user = await requireAdmin();
        console.log('AdminLayout: Admin access granted for user:', user.email)
    } catch (error) {
        console.log('AdminLayout: Admin access denied, throwing 404:', error)
        // For extra security, return 404 instead of redirect to hide admin routes
        notFound();
    }

    // Double check the role as extra security
    if (user.role !== 'ADMIN') {
        console.log('AdminLayout: Double-check failed - role is not ADMIN:', user.role)
        notFound();
    }

    console.log('AdminLayout: All checks passed, rendering admin content')
    return <>{children}</>;
}
