import { requireAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let user;
    try {
        // This ensures only admins can access any admin page
        user = await requireAdmin();
    } catch {
        // For extra security, return 404 instead of redirect to hide admin routes
        notFound();
    }

    // Double check the role as extra security
    if (user.role !== 'ADMIN') {
        notFound();
    }

    return (
        <ClerkProvider>
            {children}
        </ClerkProvider>
    );
}
