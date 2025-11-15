"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggleButton } from "@/components/theme-toggle-btn";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import NotificationDropdown from "../notification-dropdown";

type HeaderProps = {
    user?: {
        firstName: string;
        role: string
    } | null;
};
const Header: React.FC<HeaderProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const isAuthenticated = !!user && !!user.firstName;
    const pathname = usePathname();


    const links = [
        { name: "Events", href: "/browse-events" },
        { name: "Your Registrations", href: "/event-registrations" },
        // { name: "Updates", href: "/event-updates" },
    ];
    console.log({ user })
    return (
        <header className="fixed top-2 left-1/2 z-50 w-[90%] max-w-5xl -translate-x-1/2 rounded-4xl  dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md shadow-lg flex items-center justify-between px-4 py-3 transition-all duration-300">
            <div className="text-2xl font-xtradex font-bold flex items-center gap-2">
                <Image src={"https://ik.imagekit.io/yzxrxw4ib5/kist.jpeg?updatedAt=1753858736541"} alt="KIST College Logo" className=" object-contain rounded-full border border-indigo-200 dark:border-white/10 " width={40} height={40} />
                <div className="text-2xl">
                    <span className="text-[#87e64b]">KIST-</span>
                    <span>FEST</span>
                </div>
            </div>



            <div className="hidden md:flex gap-6 text-sm">
                <Link

                    href="/"
                    className={`transition font-semibold ${pathname === "Home"
                        ? "text-[#87e64b]"
                        : " hover:text-[#87e64b]"
                        }`}
                >
                    Home
                </Link>
                {
                    user?.role === "USER" &&
                    links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`transition font-semibold ${pathname === link.href
                                ? "text-[#87e64b]"
                                : " hover:text-[#87e64b]"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
                {
                    isAuthenticated &&
                    <NotificationDropdown />

                }
                <ThemeToggleButton />

                {user ? (
                    <>
                        <UserButton />
                        {/* <Link href="/dashboard">
                            <Button size="sm" className="sm:size-default ">Dashboard</Button>
                        </Link> */}
                    </>
                ) : (
                    <>
                        <Link href="/sign-in">
                            <Button variant="ghost" size="sm" className="sm:size-default">Sign In</Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button size="sm" className="sm:size-default">Get Started</Button>
                        </Link>
                    </>
                )}

            </div>
            {/* Mobile Menu Button */}

            <div className="md:hidden flex items-center gap-2">
                {
                    isAuthenticated &&
                    <NotificationDropdown />

                }
                <ThemeToggleButton />
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden transition-colors"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>


            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="absolute top-full right-4 mt-3 w-56 rounded-xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-black/80 backdrop-blur-2xl shadow-2xl p-4 flex flex-col gap-3 animate-fade-in">
                    {user ? (
                        <>
                            <div className="flex items-center justify-center gap-2 text-sm pb-2 border-b border-white/20 dark:border-white/10">
                                <span>👋</span>
                                <span className="font-semibold">Hi, {user.firstName}!</span>
                            </div>

                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className={`px-3 py-2 rounded-lg transition font-semibold text-sm ${pathname === "/"
                                    ? "bg-[#87e64b]/10 text-[#87e64b]"
                                    : "hover:bg-white/10"
                                    }`}
                            >
                                Home
                            </Link>

                            {user?.role === "USER" && links.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`px-3 py-2 rounded-lg transition font-semibold text-sm ${pathname === link.href
                                        ? "bg-[#87e64b]/10 text-[#87e64b]"
                                        : "hover:bg-white/10"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="pt-2 border-t border-white/20 dark:border-white/10">
                                <UserButton />
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                                <Button variant="ghost" size="sm" className="w-full">Sign In</Button>
                            </Link>
                            <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                                <Button size="sm" className="w-full">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;