import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        const user = await requireAdmin();

        return (
            <div className="min-h-screen bg-background">
                <Navbar user={user} />
                <div className="flex">
                    <Sidebar user={user} />
                    <main className="flex-1 lg:ml-64 pt-16">
                        <div className="p-4 sm:p-6 md:p-8">{children}</div>
                    </main>
                </div>
            </div>
        );
    } catch {
        redirect("/");
    }
}
