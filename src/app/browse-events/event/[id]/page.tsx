import type * as React from "react"
import EventDetails from "@/components/event/event-details"
import { EventUpdatesDisplay } from "@/components/event/event-updates-display"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from '@/lib/prisma'
import { Winners } from "@/components/event/event-winners"
import { EventFeedbacks } from "@/components/event/event-feedback"

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function EventDetailsPage({ params }: PageProps) {
    const { id } = await params
    // const user = await getCurrentUser()

    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
            registrations: { include: { user: { select: { id: true } } } },
            winners: {
                select: {
                    position: true,
                    user: { select: { id: true, firstName: true, lastName: true, imageUrl: true } }
                }
            },
            feedback: {
                select: {
                    id: true,
                    rating: true,
                    createdAt: true,
                    comment: true,
                    user: { select: { id: true, firstName: true, lastName: true, imageUrl: true } }
                },
                take: 10
            },
            _count: { select: { registrations: true, feedback: true, winners: true, updates: true } }
        }
    })

    if (!event) return null
    console.log("Event Details:", event)

    return (
        <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl space-y-4 mt-20">

                <Link href="/browse-events" className="inline-block mb-2 px-0">
                    <Button variant="link" className="text-custom-green px-0">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Events
                    </Button>
                </Link>
                <EventDetails id={id} />


                {
                    event.status !== "COMPLETED" && event.status === "DRAFT" && (
                        <EventUpdatesDisplay eventId={id} />
                    )
                }
                {/* show event winners if they decalred by addmin  and also if the event has been status to COMPLETED */}
                {
                    event.status === "COMPLETED" && event.winners.length > 0 &&
                    <Winners
                        winners={event.winners}

                    />
                }
                {
                    event.status === "COMPLETED" && event._count.feedback > 0 &&
                    <EventFeedbacks
                        feedbacks={event.feedback.map(fb => ({
                            ...fb,
                            comment: fb.comment ?? ""
                        }))}

                    />
                }

            </div>
        </div>
    )
}
