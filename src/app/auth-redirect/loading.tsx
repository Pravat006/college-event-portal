export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Redirecting...</h1>
                <p className="text-gray-600">
                    Please wait while we redirect you to the appropriate page.
                </p>
            </div>
        </div>
    );
}
