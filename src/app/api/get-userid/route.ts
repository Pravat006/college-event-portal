// A simple script to log the current Clerk user ID
import { auth } from '@clerk/nextjs/server'

export async function GET() {
    const { userId } = await auth()
    return new Response(JSON.stringify({ userId }), {
        headers: { 'Content-Type': 'application/json' },
    })
}
