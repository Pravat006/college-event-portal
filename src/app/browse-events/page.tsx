import { EventsHero } from "@/components/event/event-hero"
import { UpcomingEventsList } from "@/components/event/upcoaming-events-list"
export default async function EventsGridPage() {

    return (
        <main className="mx-auto max-w-7xl  pt-0 my-auto  h-dvh">
            <EventsHero />
            <UpcomingEventsList />
            <div className="pointer-events-none fixed top-0 left-[58%] -translate-x-1/2 z-0 flex items-start justify-center mt-[-130px]">
                <div className="relative flex items-center justify-center">
                    <div
                        className="w-[520px] h-[260px] rounded-b-full opacity-100"
                        style={{
                            background:
                                "radial-gradient(60% 100% at 50% 70%, rgba(135,230,75,0.6), rgba(135,230,75,0.35) 45%, rgba(135,230,75,0.15) 70%)",
                            boxShadow:
                                "0 40px 120px rgba(135,230,75,0.25), 0 10px 40px rgba(135,230,75,0.15)",
                            filter: "blur(18px) saturate(120%)",
                        }}
                    />
                </div>
            </div>
        </main>
    )
}
