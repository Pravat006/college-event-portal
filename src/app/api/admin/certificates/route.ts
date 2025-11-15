import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCertificateHTML, getCertificateFileName } from '@/lib/certificate'
import { format } from 'date-fns'
import { requireAdmin } from '@/lib/auth'

// Get certificates for an event
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

        // Verify user has access to this event
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

        const certificates = await prisma.certificate.findMany({
            where: {
                winner: {
                    eventId: eventId
                }
            },
            include: {
                winner: {
                    include: {
                        user: true,
                        event: {
                            include: {
                                createdBy: { select: { firstName: true, lastName: true } }
                            }
                        }
                    }
                }
            },
            orderBy: { issuedAt: 'desc' }
        })

        return NextResponse.json(certificates)

    } catch (error) {
        console.error('Error fetching certificates:', error)
        return NextResponse.json(
            { message: 'Failed to fetch certificates' },
            { status: 500 }
        )
    }
}

// Regenerate and resend certificate
export async function POST(req: NextRequest) {
    try {
        const user = await requireAdmin()
        const { certificateId } = await req.json()

        if (!certificateId) {
            return NextResponse.json(
                { message: 'Certificate ID is required' },
                { status: 400 }
            )
        }

        const certificate = await prisma.certificate.findUnique({
            where: { id: certificateId },
            include: {
                winner: {
                    include: {
                        user: true,
                        event: {
                            include: {
                                createdBy: { select: { firstName: true, lastName: true } }
                            }
                        }
                    }
                }
            }
        })

        if (!certificate) {
            return NextResponse.json(
                { message: 'Certificate not found' },
                { status: 404 }
            )
        }

        // Verify user has access to this event
        const hasAccess = certificate.winner.event.createdById === user.id

        if (!hasAccess) {
            return NextResponse.json(
                { message: 'Access denied' },
                { status: 403 }
            )
        }

        // Use stored certificate data or generate new
        let certificateData = certificate.certificateData as any

        if (!certificateData) {
            // Fallback: generate from winner data
            certificateData = {
                userName: `${certificate.winner.user.firstName} ${certificate.winner.user.lastName}`,
                eventTitle: certificate.winner.event.title,
                position: certificate.winner.position,
                eventDate: format(new Date(certificate.winner.event.startDate), 'MMMM do, yyyy'),
                organizerName: `${certificate.winner.event.createdBy.firstName} ${certificate.winner.event.createdBy.lastName}`,
                collegeName: "KONARK INSTITUTE OF SCIENCE AND TECHNOLOGY"
            }
        }

        const certificateHtml = generateCertificateHTML(certificateData)
        const fileName = getCertificateFileName(
            certificateData.userName,
            certificateData.eventTitle,
            certificateData.position
        )

        return NextResponse.json({
            certificateHtml,
            fileName
        })

    } catch (error) {
        console.error('Error regenerating certificate:', error)
        return NextResponse.json(
            { message: 'Failed to regenerate certificate' },
            { status: 500 }
        )
    }
}