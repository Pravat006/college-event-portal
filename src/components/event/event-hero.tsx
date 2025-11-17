import Image from "next/image";

export function EventsHero() {
    return (
        <header className="relative h-80 sm:h-96 overflow-hidden rounded-b-2xl">
            {/* Background Image */}
            <Image
                alt="Mountain landscape with sunrise"
                src="https://res.cloudinary.com/dlrmkxmh7/image/upload/v1763154512/csii_njfoic.jpg"
                fill
                className="object-cover"
                priority
            />

            <div className="absolute inset-0 bg-black/40" />
        </header>
    );
}
