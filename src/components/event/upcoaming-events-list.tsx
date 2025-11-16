import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type EventWithDetails = Awaited<ReturnType<typeof getEvents>>[number];

async function getEvents(userRole?: string) {
    return await prisma.event.findMany({
        where: userRole === 'ADMIN' ? {} : { status: { in: ['PUBLISHED', 'COMPLETED'] } },
        include: {
            createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
            registrations: { include: { user: { select: { id: true } } } },
            _count: { select: { registrations: true, feedback: true, winners: true, updates: true } }
        },
        orderBy: { startDate: 'desc' }
    });
}

const formatDate = (date: Date) => {
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = String(date.getDate()).padStart(2, '0');
    return { month, day };
};

const formatTime = (startDate: Date, endDate: Date) => {
    const start = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const end = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${start} — ${end}`;
};

const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

function EventCard({ event }: { event: EventWithDetails }) {
    const { month, day } = formatDate(event.startDate);
    const time = formatTime(event.startDate, event.endDate);

    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
            {/* Date Column */}
            <div className="w-full sm:w-20 shrink-0 flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0 sm:text-center">
                <div className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
                    {month}
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-foreground">
                    {day}
                </div>
            </div>

            {/* Image Column */}
            <div className="w-full sm:w-64 md:w-80 shrink-0">
                <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden rounded-lg">
                    <Image
                        src={event.imageUrl || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    {event.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 sm:mb-4">
                    {event.location}
                </p>
                <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
                    {time}
                </p>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                    {truncateDescription(event.description)}
                </p>
                <Link
                    href={`/browse-events/event/${event.id}`}
                    className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors text-sm sm:text-base"
                >
                    View Event Details
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}

export async function UpcomingEventsList() {
    const user = await getCurrentUser();

    // Fetch events for both authenticated and unauthenticated users
    const allEvents = await getEvents(user?.role);

    const upcomingEvents = allEvents.filter(e => e.status === 'PUBLISHED');
    const completedEvents = allEvents.filter(e => e.status === 'COMPLETED');

    return (
        <section className="px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 max-w-7xl mx-auto">
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-8 bg-transparent border-b border-border rounded-none h-auto p-0 gap-6">
                    <TabsTrigger
                        value="all"
                        className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-foreground pb-2 px-1 text-base font-medium"
                    >
                        All Events
                    </TabsTrigger>
                    <TabsTrigger
                        value="upcoming"
                        className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-foreground pb-2 px-1 text-base font-medium"
                    >
                        Upcoming
                    </TabsTrigger>
                    <TabsTrigger
                        value="completed"
                        className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-foreground pb-2 px-1 text-base font-medium"
                    >
                        Completed
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-8 sm:space-y-12 mt-8">
                    {allEvents.map((event, index) => (
                        <div key={event.id}>
                            <EventCard event={event} />
                            {index < allEvents.length - 1 && (
                                <div className="mt-8 sm:mt-12 border-b border-border" />
                            )}
                        </div>
                    ))}
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-8 sm:space-y-12 mt-8">
                    {upcomingEvents.length === 0 ? (
                        <p className="text-center text-muted-foreground py-12">No upcoming events</p>
                    ) : (
                        upcomingEvents.map((event, index) => (
                            <div key={event.id}>
                                <EventCard event={event} />
                                {index < upcomingEvents.length - 1 && (
                                    <div className="mt-8 sm:mt-12 border-b border-border" />
                                )}
                            </div>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-8 sm:space-y-12 mt-8">
                    {completedEvents.length === 0 ? (
                        <p className="text-center text-muted-foreground py-12">No completed events</p>
                    ) : (
                        completedEvents.map((event, index) => (
                            <div key={event.id}>
                                <EventCard event={event} />
                                {index < completedEvents.length - 1 && (
                                    <div className="mt-8 sm:mt-12 border-b border-border" />
                                )}
                            </div>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </section>
    );
}
