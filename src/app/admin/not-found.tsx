import Link from "next/link";

export default function AdminNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Forbidden</h2>
                <p className="text-gray-600 mb-6">
                    You do not have permission to access the admin panel.
                    Only users with administrator privileges can access this area.
                </p>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                        If you believe this is an error, please contact your system administrator.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
