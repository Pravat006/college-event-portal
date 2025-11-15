'use client'

import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthRedirectPage() {
    const { userId } = useAuth();
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function handleRedirect() {
            if (!isLoaded) return;

            // If no user is logged in, redirect to sign-in
            if (!userId || !user) {
                router.push('/sign-in');
                return;
            }

            try {
                // Check if user exists in the database and create if needed
                const response = await fetch('/api/auth/check-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        clerkId: userId,
                        email: user.primaryEmailAddress?.emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        imageUrl: user.imageUrl
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to check user');
                }

                const data = await response.json();

                // Redirect based on role
                if (data.role === 'ADMIN') {
                    router.push('/dashboard');
                } else {
                    router.push('/');
                }
            } catch {
                setError('An error occurred during authentication. Redirecting to home page...');

                // Redirect to home page after a short delay
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            }
        }

        handleRedirect();
    }, [userId, user, isLoaded, router]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
                    <h1 className="text-xl font-bold text-red-600 mb-4">Authentication Error</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <div className="animate-pulse rounded-full h-2 w-full bg-gray-200"></div>
                </div>
            </div>
        );
    }

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
