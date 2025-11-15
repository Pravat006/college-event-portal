import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";





export async function GET() {

    try {
        await requireAdmin();

        const registrations = await prisma.registration.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                event: {
                    select: {
                        title: true,
                        startDate: true,
                        category: true
                    }
                }
            },
            orderBy: {
                registeredAt: 'desc'
            }
        })

        return NextResponse.json({
            data: registrations,
            success: true
        })
    } catch (error) {
        console.error("Error fetching registrations:", error);
        return NextResponse.json(
            { message: 'Failed to fetch registrations', error: (error as Error).message },
            { status: 500 }
        )

    }
}














