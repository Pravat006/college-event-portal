import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import { getCurrentUser } from '@/lib/auth'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = await auth()

    if (!userId) {
        redirect('/sign-in')
    }

    const user = await getCurrentUser()

    if (!user) {
        redirect('/sign-in')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />
            <div className="flex">
                <Sidebar user={user} />
                <main className="flex-1 lg:ml-64 pt-16 w-full">
                    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}