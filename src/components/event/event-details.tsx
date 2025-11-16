import type * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import EventRegistrationForm from "./event-registration-form"

export async function EventDetails({ id }: { id: string }) {
    const user = await getCurrentUser()

    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            createdBy: { select: { firstName: true, lastName: true } },
            registrations: { include: { user: { select: { id: true } } } },
            _count: { select: { registrations: true, feedback: true } },
        },
    })

    if (!event) return null

    const {
        title,
        description,
        imageUrl,
        status,
        category,
        location,
        startDate,
        endDate,
        createdBy,
        _count,
        registrations,
    } = event

    const author = createdBy
        ? `${createdBy.firstName} ${createdBy.lastName}`
        : "Event team"

    const dateObj = new Date(startDate)
    const month = dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
    const day = dateObj.toLocaleDateString("en-US", { day: "2-digit" })
    const timeRange = `${new Date(startDate).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    })} – ${new Date(endDate).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    })}`

    const userRegistration = user ? registrations.find(reg => reg.user.id === user.id) : null
    const userRegistrationStatus = userRegistration?.status // "REGISTERED" | "ATTENDED" | "CANCELLED" | undefined

    // const isUserRegistered = userRegistrationStatus === "REGISTERED"

    return (
        <section className="max-w-6xl mx-auto py-6">
            {/* single thin separator */}
            <div className="border-b border-gray-200 pb-10">
                <div className="flex flex-col gap-6 md:grid md:grid-cols-[90px_minmax(0,260px)_minmax(0,1fr)] md:gap-8">
                    {/* LEFT: date / meta */}
                    <div className="flex md:block items-start md:items-center">
                        <div className="text-xs tracking-[0.2em] text-muted-foreground">
                            {month}
                        </div>
                        <div className="md:mt-2 md:text-4xl text-3xl font-semibold leading-none">
                            {day}
                        </div>
                    </div>

                    {/* MIDDLE: image */}
                    <div className="relative w-full h-56 md:h-64 rounded-md overflow-hidden bg-muted">
                        <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* RIGHT: content */}
                    <div className="flex flex-col justify-between gap-4">
                        {/* badges + title + meta */}
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                                <span className="px-2 py-0.5 rounded-full border border-gray-300">
                                    {status}
                                </span>
                                <span className="px-2 py-0.5 rounded-full border border-gray-300">
                                    {category}
                                </span>
                            </div>

                            <h1 className="text-xl font-semibold leading-snug">
                                {title}
                            </h1>

                            <p className="text-sm text-muted-foreground">
                                {location} • {timeRange}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                Hosted by {author} • {_count.feedback} reviews
                            </p>
                        </div>

                        {/* description */}
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {description}
                        </p>

                        {/* feedback + registration in a subtle row */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="text-xs text-muted-foreground">Feedback</div>
                                <div className="text-sm">
                                    {_count.feedback} review{_count.feedback === 1 ? "" : "s"}
                                </div>
                            </div>

                            {/* Show registration form for all non-admin users (authenticated or not) */}
                            {(!user || user?.role !== "ADMIN") && (
                                <div className="sm:min-w-[220px]">
                                    <EventRegistrationForm
                                        eventId={id}
                                        status={status}
                                        disable={false}
                                        registrationStatus={userRegistrationStatus}
                                    />
                                </div>
                            )}
                        </div>

                        {/* CTA text link */}
                        <div className="pt-2">
                            <Link
                                href="/browse-events"
                                className="text-sm text-primary hover:underline"
                            >
                                View all events →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EventDetails
