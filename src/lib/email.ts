import eventEmailHTML from "@/components/emails/send-event-confirmation"
import generateEventUpdateHTML from "@/components/emails/send-event-update"
import { EventEmail } from "@/types/event"
import { Resend } from "resend"


const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEventConfirmationEmail({ event, user }: EventEmail) {
    // Generate email HTML content
    const htmlContent = eventEmailHTML({ event, user })

    // For debugging
    // console.log('Sending confirmation email to:', user.email)

    try {
        const { data, error } = await resend.emails.send({
            from: "College Events <events@resend.dev>",
            to: user.email,
            subject: `Event Registration: ${event.title}`,
            html: htmlContent
        })
        if (error) {
            console.error('Resend API error:', error)
            return { success: false, error }
        }
        // console.log("email data: ", data)
        return { success: true, data }
    } catch (error) {
        console.error('Error sending confirmation email:', error)
        return { success: false, error }
    }
}

export async function sendEventUpdateEmail({ event, user, updateType }: EventEmail & { updateType: 'updated' | 'cancelled' }) {
    // Generate the HTML content
    const htmlContent = generateEventUpdateHTML({ event, user, updateType })

    // For debugging
    console.log(`Sending ${updateType} email notification to:`, user.email)

    try {
        const subject = updateType === 'cancelled'
            ? `Event Cancelled: ${event.title}`
            : `Event Updated: ${event.title}`

        const { data, error } = await resend.emails.send({
            from: 'College Events <events@resend.dev>', // Change this to your verified domain
            to: user.email,
            subject,
            html: htmlContent,
        })

        if (error) {
            console.error('Resend API error:', error)
            return { success: false, error }
        }

        console.log('Email sent successfully:', data?.id)
        return { success: true, data }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error }
    }

}