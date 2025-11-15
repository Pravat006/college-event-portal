import type * as React from "react"
import EventDetails from "@/components/event/event-details"
import { EventUpdatesDisplay } from "@/components/event/event-updates-display"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
type PageProps = {
    params: Promise<{ id: string }>
}

export default async function EventDetailsPage({ params }: PageProps) {
    const { id } = await params

    return (
        <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl space-y-4 mt-24">

                <Link href="/browse-events" className="inline-block mb-2">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Events
                    </Button>
                </Link>
                <EventDetails id={id} />

                {/* Real-time Event Updates */}
                <EventUpdatesDisplay eventId={id} />
            </div>
        </div>
    )
}
