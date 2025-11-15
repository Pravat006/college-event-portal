import { Card, CardContent } from "@/components/ui/card"

import Image from "next/image"


interface Event {
    id: string
    title: string
    description: string
    imageUrl: string | null
    location: string
    startDate: Date
    endDate: Date
    capacity: number
    price: number | null
    category: string
    status: string
    createdBy: { firstName: string; lastName: string }
    registrations: Array<{ user: { id: string } }>
    _count: { registrations: number; feedback: number }
}
type Props = {
    event: Event
    className?: string
}

function toDate(value: Date | string): Date {
    return value instanceof Date ? value : new Date(value)
}

function formatDateCompact(start: Date | string, end: Date | string) {
    const s = toDate(start)
    const e = toDate(end)
    const sameDay = s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth() && s.getDate() === e.getDate()

    const monthDayFmt = new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
    })
    const fullFmt = new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    })

    if (sameDay) {

        return fullFmt.format(s)
    }

    const sameYear = s.getFullYear() === e.getFullYear()
    if (sameYear) {

        return `${monthDayFmt.format(s)}–${monthDayFmt.format(e)}, ${s.getFullYear()}`
    }

    return `${fullFmt.format(s)} – ${fullFmt.format(e)}`
}

export default function EventCard({ event }: Props) {
    const imgSrc = event.imageUrl || "/event-cover-image.jpg"
    const dateLabel = formatDateCompact(event.startDate, event.endDate)

    return (

        <Card
            className="pt-0 relative overflow-hidden group hover:shadow-lg transition-shadow duration-300 h-full flex flex-col pb-2"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                <Image
                    src={imgSrc || "/placeholder.svg"}
                    alt={event.title}
                    width={400}
                    height={300}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Floating Action / Tag */}
                <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md text-xs font-medium px-3 py-1 rounded-full shadow-sm text-gray-700">
                    Featured
                </div>
            </div>

            {/* Content Section */}
            <CardContent className="p-4 sm:p-5 sm:py-2">
                <h3 className="text-base sm:text-lg font-semibold font-made-avenue leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {event.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-primary flex items-center gap-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3m-9 8h10m-9 8h8a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                    {dateLabel}
                </p>
            </CardContent>

            {/* Glow Border Effect */}
            <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </Card>


    )
}
