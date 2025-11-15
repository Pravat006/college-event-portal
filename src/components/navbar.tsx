"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Calendar, Menu, X, LayoutDashboard, Users, Star, Settings, BarChart3 } from "lucide-react";
import NotificationDropdown from "@/components/notification-dropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggleButton } from "./theme-toggle-btn";

interface NavbarProps {
    user?: {
        firstName: string;
        lastName: string;
        role: string;
        imageUrl?: string | null;
    } | null;
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['USER', 'ADMIN'] },
    { name: 'Events', href: '/events', icon: Calendar, roles: ['USER', 'ADMIN'] },
    { name: 'My Registrations', href: '/registrations', icon: Users, roles: ['USER'] },
    { name: 'User Management', href: '/admin/users', icon: Users, roles: ['ADMIN'] },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['ADMIN'] },
    { name: 'Feedback', href: '/feedback', icon: Star, roles: ['USER', 'ADMIN'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['USER', 'ADMIN'] },
];

export default function Navbar({ user }: NavbarProps) {
    const isAuthenticated = !!user && !!user.firstName;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();


    const filteredNavigation = isAuthenticated
        ? navigation.filter(item => item.roles.includes(user!.role as 'USER' | 'ADMIN'))
        : [];

    return (
        <nav className="fixed border-border top-0 w-full bg-background  border  z-50">
            <div className="px-3 sm:px-4 md:px-6">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <Link href={"/"}>
                            <h1 className="text-lg sm:text-4xl font-bold font-mono ">KIST</h1>
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggleButton />
                        {isAuthenticated && <NotificationDropdown />}

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium ">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {user.role.toLowerCase()}
                                    </p>
                                </div>
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

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <ThemeToggleButton />
                        {isAuthenticated && <NotificationDropdown />}

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="ml-2 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200">
                        {isAuthenticated && (
                            <div className="py-3 px-2 flex items-center justify-between border-b border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {user.role.toLowerCase()}
                                    </p>
                                </div>
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        )}

                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {/* Navigation links for mobile */}
                            {isAuthenticated && filteredNavigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center px-3 py-2 rounded-md text-sm font-medium',
                                            isActive
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        )}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}

                            {!isAuthenticated && (
                                <>
                                    <Link
                                        href="/sign-in"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/sign-up"
                                        className="block px-3 py-2 rounded-md text-base font-medium bg-black text-white hover:bg-gray-800"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}