'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home page after a short delay
        const timer = setTimeout(() => {
            router.push('/');
        }, 3000);

        return () => clearTimeout(timer);
    }, [error, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Authentication Error</h2>
                <p className="text-gray-600 mb-6">
                    We encountered an issue during sign-in. Redirecting you to the home page...
                </p>
                <button
                    onClick={reset}
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
