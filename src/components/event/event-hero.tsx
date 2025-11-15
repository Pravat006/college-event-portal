import Image from "next/image";

export function EventsHero() {
    return (
        <header className="relative h-80 sm:h-96 overflow-hidden rounded-b-2xl">
            {/* Background Image */}
            <Image
                alt="Mountain landscape with sunrise"
                src="/images/csii.jpeg"
                fill
                className="object-cover"
                priority
            />

            <div className="absolute inset-0 bg-black/40" />
            {/* <div className="relative h-full flex flex-col mt-16">
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-6xl font-bold text-white mb-6 tracking-wider">EVENTS</h1>
                    <p className="text-white text-lg max-w-2xl leading-relaxed italic">
                        Risen seeks to actively engage our community with fellowship and love. Below you will find a list of upcoming events that you can attend, volunteer, and share with others.
                    </p>
                    <div className="mt-8 flex gap-2">
                        <span className="w-2 h-2 rounded-full bg-white/60" />
                        <span className="w-2 h-2 rounded-full bg-white" />
                        <span className="w-2 h-2 rounded-full bg-white/60" />
                    </div>
                </div>
            </div> */}
        </header>
    );
}
