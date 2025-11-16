import Image from "next/image"

type Winner = {
    position: string
    user: {
        id: string
        firstName: string
        lastName: string
        imageUrl?: string | null
    }
}

export function Winners({ winners }: { winners: Winner[] }) {
    const priority = ["FIRST", "SECOND", "THIRD"]

    const sortedWinners = [...winners].sort((a, b) => {
        const aIndex = priority.indexOf(a.position.toUpperCase())
        const bIndex = priority.indexOf(b.position.toUpperCase())
        return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex)
    })

    return (
        <div className="space-y-5 py-3">
            <h2 className="text-2xl sm:text-4xl font-semibold text-custom-green">Winners</h2>
            <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                {sortedWinners.map((winner) => (
                    <div
                        key={winner.user.id}
                        className="flex flex-col gap-6 border border-foreground/10 rounded-2xl p-6 hover:border-foreground/20 transition"
                    >
                        {/* Image */}
                        <div className="relative h-56 w-full overflow-hidden rounded-xl">
                            {winner.user.imageUrl ? (
                                <Image
                                    src={winner.user.imageUrl}
                                    alt={`${winner.user.firstName} ${winner.user.lastName}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-muted flex flex-col items-center justify-center text-muted-foreground text-xs uppercase tracking-[0.3em]">
                                    <span>Profile</span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                {winner.position}
                            </div>
                            <h3 className="text-xl font-semibold">
                                {winner.user.firstName} {winner.user.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Celebrated for outstanding performance in this event.
                            </p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    )
}