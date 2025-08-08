
import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getCurrentUser() {
    const { userId } = await auth();
    if (!userId) return null;

    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    return user;
}
export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
}

export async function requireAdmin() {
    // console.log('requireAdmin: Starting admin check...')
    const user = await requireAuth();
    // console.log('requireAdmin: User found:', { id: user.id, role: user.role, email: user.email })

    if (user.role !== 'ADMIN') {
        // console.log('requireAdmin: ACCESS DENIED - User role is not ADMIN:', user.role)
        throw new Error("Forbidden: Admin access required");
    }

    // console.log('requireAdmin: ACCESS GRANTED - User is admin')
    return user;
}