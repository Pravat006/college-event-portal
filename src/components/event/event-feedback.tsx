import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

type FeedbackItem = {
    id: string
    comment: string
    rating: number
    createdAt?: Date
    user: {
        id: string
        firstName: string
        lastName: string
        imageUrl?: string | null
    }
}

type EventFeedbackProps = {
    feedbacks: FeedbackItem[]
}

export function EventFeedbacks({ feedbacks }: EventFeedbackProps) {
    return (
        <div className="space-y-5 py-3">
            <h2 className="text-2xl sm:text-4xl font-semibold text-custom-green">Feedbacks</h2>

            {feedbacks.map((item) => {
                const date = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : "—"
                const initials = `${item.user.firstName?.[0] ?? ""}${item.user.lastName?.[0] ?? ""}` || "NA"

                return (
                    <div key={item.id} className="space-y-3 border-b border-foreground/10 pb-5 last:border-none">
                        <div className="flex items-center justify-between gap-4">
                            <Avatar className="h-14 w-14 rounded-xl sm:h-16 sm:w-16 md:h-20 md:w-20">
                                <AvatarImage
                                    src={item.user?.imageUrl || "https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                                    alt={item.user.firstName}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-[10px] tracking-[0.4em] uppercase">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                <p>{date}</p>
                                <div className="mt-1 flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <Star
                                            key={idx}
                                            className={`h-4 w-4 ${idx < item.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1 md:space-y-2">
                            <h3 className="text-base font-semibold leading-tight sm:text-lg">
                                {item.user.firstName} {item.user.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">{item.comment}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}