import { getCurrentUser, requireAdmin } from "@/lib/auth";

export default async function ForceAdminTestPage() {
    console.log('ForceAdminTestPage: Starting force admin test...')

    const currentUser = await getCurrentUser();
    console.log('ForceAdminTestPage: Current user:', currentUser)

    if (!currentUser) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-red-600">❌ No User Found</h1>
                <p>You must be signed in to access this page.</p>
            </div>
        );
    }

    let adminCheckResult = null;
    let adminError = null;

    try {
        console.log('ForceAdminTestPage: Calling requireAdmin()...')
        const adminUser = await requireAdmin();
        adminCheckResult = adminUser;
        console.log('ForceAdminTestPage: requireAdmin() success:', adminUser)
    } catch (error) {
        adminError = error instanceof Error ? error.message : 'Unknown error';
        console.log('ForceAdminTestPage: requireAdmin() failed:', adminError)
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">🔍 Force Admin Test</h1>

            <div className="mb-6 p-4 bg-gray-100 rounded">
                <h2 className="font-bold mb-2">Current User:</h2>
                <p><strong>ID:</strong> {currentUser.id}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Role:</strong> <span className={currentUser.role === 'ADMIN' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{currentUser.role}</span></p>
            </div>

            <div className="mb-6 p-4 border rounded">
                <h2 className="font-bold mb-2">requireAdmin() Test Result:</h2>
                {adminCheckResult ? (
                    <div className="text-green-600">
                        <p>✅ <strong>SUCCESS:</strong> Admin access granted</p>
                        <p>This user CAN access admin pages</p>
                    </div>
                ) : (
                    <div className="text-red-600">
                        <p>❌ <strong>FAILED:</strong> {adminError}</p>
                        <p>This user CANNOT access admin pages</p>
                    </div>
                )}
            </div>

            {currentUser.role !== 'ADMIN' && (
                <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
                    <h3 className="font-bold text-yellow-800">⚠️ Expected Result:</h3>
                    <p className="text-yellow-700">Since your role is &quot;{currentUser.role}&quot;, you should NOT be able to access /admin routes. If you can access them, there&apos;s a protection bug.</p>
                </div>
            )}

            {currentUser.role === 'ADMIN' && (
                <div className="p-4 bg-green-100 border border-green-400 rounded">
                    <h3 className="font-bold text-green-800">✅ Expected Result:</h3>
                    <p className="text-green-700">Since your role is &quot;ADMIN&quot;, you SHOULD be able to access /admin routes.</p>
                </div>
            )}
        </div>
    );
}
