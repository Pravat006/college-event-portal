import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCertificateHTML, getCertificateFileName, getPositionDisplay } from '@/lib/certificate'
import { sendCertificateEmail } from '@/lib/email'
import { format } from 'date-fns'
import { requireAdmin } from '@/lib/auth'
import { WinnerPosition } from '@/generated/prisma'

export async function POST(req: NextRequest) {
    try {
        const user = await requireAdmin()
        const { eventId, winners }: { eventId: string, winners: { userId: string, position: WinnerPosition }[] } = await req.json()

        if (!eventId || !winners || !Array.isArray(winners)) {
            return NextResponse.json({ message: 'Event ID and winners array are required' }, { status: 400 })
        }

        // Verify user has access to this event (must be the creator)
        const event = await prisma.event.findFirst({
            where: {
                id: eventId,
                createdById: user.id
            },
            include: {
                createdBy: { select: { firstName: true, lastName: true } }
            }
        })

        if (!event) {
            return NextResponse.json(
                { message: 'Event not found or access denied' },
                { status: 404 }
            )
        }

        const results = []

        // Process each winner
        for (const winner of winners) {
            const { userId, position } = winner

            if (!userId || !position) {
                continue
            }

            try {
                // Check if user is registered for this event
                const registration = await prisma.registration.findUnique({
                    where: {
                        userId_eventId: {
                            userId,
                            eventId
                        }
                    },
                    include: {
                        user: true
                    }
                })

                if (!registration) {
                    results.push({
                        userId,
                        position,
                        status: 'error',
                        error: 'User not registered for this event'
                    })
                    continue
                }

                // Create winner record
                const winnerRecord = await prisma.winner.create({
                    data: {
                        userId,
                        eventId,
                        position,
                        declaredByUserId: user.id
                    },
                    include: {
                        user: true
                    }
                })

                // Create certificate record
                const certificate = await prisma.certificate.create({
                    data: {
                        winnerId: winnerRecord.id,
                        certificateData: {
                            userName: `${registration.user.firstName} ${registration.user.lastName}`,
                            eventTitle: event.title,
                            position: position,
                            eventDate: format(new Date(event.startDate), 'MMMM do, yyyy'),
                            organizerName: `${event.createdBy.firstName} ${event.createdBy.lastName}`,
                            collegeName: "KONARK INSTITUTE OF SCIENCE AND TECHNOLOGY",
                            registrationNumber: registration.registrationNumber.toString(),
                            semester: registration.semester
                        }
                    }
                })

                // Generate certificate HTML
                const certificateData = {
                    userName: `${registration.user.firstName} ${registration.user.lastName}`,
                    eventTitle: event.title,
                    position: position,
                    eventDate: format(new Date(event.startDate), 'MMMM do, yyyy'),
                    organizerName: `${event.createdBy.firstName} ${event.createdBy.lastName}`,
                    collegeName: "KONARK INSTITUTE OF SCIENCE AND TECHNOLOGY",
                    registrationNumber: registration.registrationNumber.toString(),
                    semester: registration.semester
                }

                const certificateHtml = generateCertificateHTML(certificateData)

                // Send certificate email
                await sendCertificateEmail({
                    event: {
                        title: event.title,
                        description: event.description,
                        startDate: event.startDate
                    },
                    user: {
                        firstName: registration.user.firstName,
                        lastName: registration.user.lastName,
                        email: registration.user.email
                    },
                    certificateHtml,
                    position: getPositionDisplay(position)
                })

                // Update certificate as sent
                await prisma.certificate.update({
                    where: { id: certificate.id },
                    data: {
                        emailSent: true,
                        emailSentAt: new Date()
                    }
                })

                // Create notification
                await prisma.notification.create({
                    data: {
                        userId: registration.userId,
                        eventId: eventId,
                        title: 'Certificate Issued',
                        message: `Congratulations! You have been awarded ${getPositionDisplay(position)} for ${event.title}`,
                        type: 'EVENT_UPDATED'
                    }
                })

                results.push({
                    userId,
                    position,
                    certificateId: certificate.id,
                    winnerId: winnerRecord.id,
                    status: 'success'
                })

            } catch (error) {
                console.error(`Error processing winner ${userId}:`, error)
                results.push({
                    userId,
                    position,
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Unknown error'
                })
            }
        }

        return NextResponse.json({
            message: 'Winners processed successfully',
            results
        })

    } catch (error) {
        console.error('Error declaring winners:', error)
        return NextResponse.json(
            { message: 'Failed to declare winners' },
            { status: 500 }
        )
    }
}

// Get event registrations for winner selection
export async function GET(req: NextRequest) {
    try {
        const user = await requireAdmin()
        const { searchParams } = new URL(req.url)
        const eventId = searchParams.get('eventId')

        if (!eventId) {
            return NextResponse.json(
                { message: 'Event ID is required' },
                { status: 400 }
            )
        }

        const event = await prisma.event.findFirst({
            where: {
                id: eventId,
                createdById: user.id
            }
        })

        if (!event) {
            return NextResponse.json(
                { message: 'Event not found or access denied' },
                { status: 404 }
            )
        }

        const registrations = await prisma.registration.findMany({
            where: {
                eventId: eventId,
                status: 'ATTENDED' // Only attended participants can be winners
            },
            include: {
                user: true
            },
            orderBy: { registeredAt: 'asc' }
        })

        // Get existing winners for this event
        const existingWinners = await prisma.winner.findMany({
            where: { eventId },
            include: {
                user: true,
                certificate: true
            }
        })

        // Convert BigInt to string for JSON serialization
        const registrationsWithWinnerStatus = registrations.map(reg => ({
            ...reg,
            registrationNumber: reg.registrationNumber.toString(), // Convert BigInt to string
            isWinner: existingWinners.some(winner => winner.userId === reg.userId),
            winnerData: existingWinners.find(winner => winner.userId === reg.userId)
        }))

        return NextResponse.json(registrationsWithWinnerStatus)

    } catch (error) {
        console.error('Error fetching event registrations:', error)
        return NextResponse.json(
            { message: 'Failed to fetch registrations' },
            { status: 500 }
        )
    }
}