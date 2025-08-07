import eventEmailHTML from "@/components/emails/send-event-confirmation"
import generateEventUpdateHTML from "@/components/emails/send-event-update"
import { EventEmail } from "@/types/event"
import { Resend } from "resend"


const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEventConfirmationEmail({ event, user }: EventEmail) {
    try {
        const { data, error } = await resend.emails.send({
            from: "Event Notifications <no-reply@event-portal.com>",
            to: [user.email],
            subject: `New Event: ${event.title}`,
            html: eventEmailHTML({ event, user })
        })
        if (error) {
            console.error("Error sending email:", error)
            return { success: false, error }
        }
        return { success: true, data }
    } catch (error) {
        console.error("Error sending email:", error)
        return { success: false, error }
    }
}

export async function sendEventUpdateEmail({ event, user, updateType }: EventEmail & { updateType: 'updated' | 'cancelled' }) {
    try {
        const subject = updateType === 'cancelled'
            ? `Event Cancelled: ${event.title}`
            : `Event Updated: ${event.title}`

        const { data, error } = await resend.emails.send({
            from: 'College Events <events@yourdomain.com>',
            to: [user.email],
            subject,
            html: generateEventUpdateHTML({ event, user, updateType }),
        })

        if (error) {
            console.error('Error sending update email:', error)
            return { success: false, error }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Error sending update email:', error)
        return { success: false, error }
    }

}