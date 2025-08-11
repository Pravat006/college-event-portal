import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()

    // For admin routes, do additional checks
    if (isAdminRoute(req)) {
        if (!userId) {
            return NextResponse.redirect(new URL('/sign-in', req.url))
        }

        // Let the admin layout handle the role checking
    }

    // For non-public routes, require authentication
    if (!isPublicRoute(req) && !userId) {
        return NextResponse.redirect(new URL('/sign-in', req.url))
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
