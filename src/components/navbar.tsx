"use client";

import { UserButton } from "@clerk/nextjs";
import { Calendar } from "lucide-react";
import NotificationDropdown from "@/components/notification-dropdown";
import Link from "next/link";

interface NavbarProps {
    user?: {
        firstName: string;
        lastName: string;
        role: string;
        imageUrl?: string | null;
    } | null;
}

export default function Navbar({ user }: NavbarProps) {
    const isAuthenticated = !!user && !!user.firstName;

    return (
        <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
            <div className="px-6">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <h1 className="text-xl font-bold text-gray-900">College Events</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated && <NotificationDropdown />}

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {user.role.toLowerCase()}
                                    </p>
                                </div>
                                {/* Show Clerk profile image if available */}
                                {/* {user.imageUrl && (
                                    <img
                                        src={user.imageUrl}
                                        alt="Profile"
                                        className="h-8 w-8 rounded-full border"
                                    />
                                )} */}
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/sign-in"
                                    className="text-sm font-medium text-gray-900 hover:text-gray-700"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="px-4 py-2 bg-black text-white rounded font-semibold hover:bg-gray-800 transition-colors"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}