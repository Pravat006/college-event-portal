'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Award, Download, Eye, Loader2, X } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { Certificate, WinnerPosition } from '@/types'

interface CertificateManagementProps {
    eventId: string
    eventTitle: string
}

export default function CertificateManagement({ eventId, eventTitle }: CertificateManagementProps) {
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [loading, setLoading] = useState(true)
    const [previewCertificate, setPreviewCertificate] = useState<string | null>(null)
    const [previewLoading, setPreviewLoading] = useState(false)
    const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect(() => {
        fetchCertificates()
    }, [eventId])

    const fetchCertificates = async () => {
        try {
            const response = await fetch(`/api/admin/certificates?eventId=${eventId}`)
            if (response.ok) {
                const data = await response.json()
                setCertificates(data)
            } else {
                toast.error('Failed to fetch certificates')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const handleOpenPreview = async (certificateId: string) => {
        setSelectedCertificateId(certificateId)
        setDialogOpen(true)
        setPreviewLoading(true)
        setPreviewCertificate(null)

        try {
            const response = await fetch('/api/admin/certificates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ certificateId })
            })

            if (response.ok) {
                const data = await response.json()
                setPreviewCertificate(data.certificateHtml)
            } else {
                toast.error('Failed to generate certificate preview')
                setDialogOpen(false)
            }
        } catch (error) {
            toast.error('Something went wrong')
            setDialogOpen(false)
        } finally {
            setPreviewLoading(false)
        }
    }

    const handleDownloadCertificate = async (certificateId: string, userName: string) => {
        try {
            const response = await fetch('/api/admin/certificates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ certificateId })
            })

            if (response.ok) {
                const data = await response.json()

                // Create and download the certificate file
                const blob = new Blob([data.certificateHtml], { type: 'text/html' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = data.fileName || `Certificate_${userName}.html`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)

                toast.success('Certificate downloaded successfully')
            } else {
                toast.error('Failed to download certificate')
            }
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    const getPositionBadge = (position: WinnerPosition) => {
        const colors = {
            'FIRST': 'bg-yellow-100 text-yellow-800',
            'SECOND': 'bg-gray-100 text-gray-800',
            'THIRD': 'bg-orange-100 text-orange-800',
            'PARTICIPATION': 'bg-blue-100 text-blue-800'
        }

        const labels = {
            'FIRST': '🥇 1st Place',
            'SECOND': '🥈 2nd Place',
            'THIRD': '🥉 3rd Place',
            'PARTICIPATION': '🎖️ Participation'
        }

        return (
            <Badge className={colors[position as keyof typeof colors] || 'bg-green-100 text-green-800'}>
                {labels[position as keyof typeof labels] || position}
            </Badge>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading certificates...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Certificate Management</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage issued certificates for {eventTitle}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Issued Certificates ({certificates.length})
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {certificates.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No certificates issued</h3>
                            <p>Certificates will appear here after declaring winners</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Recipient</TableHead>
                                        <TableHead>Position</TableHead>
                                        <TableHead>Issued Date</TableHead>
                                        <TableHead>Email Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {certificates.map((certificate) => (
                                        <TableRow key={certificate.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {certificate.winner?.user?.firstName} {certificate.winner?.user?.lastName}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">{certificate.winner?.user?.email}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        KONARK INSTITUTE OF SCIENCE AND TECHNOLOGY
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                {certificate.winner && getPositionBadge(certificate.winner.position)}
                                            </TableCell>

                                            <TableCell>
                                                <div className="text-sm">
                                                    {format(new Date(certificate.issuedAt), 'MMM dd, yyyy')}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {format(new Date(certificate.issuedAt), 'h:mm a')}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant={certificate.emailSent ? 'default' : 'secondary'}>
                                                    {certificate.emailSent ? '✓ Sent' : 'Pending'}
                                                </Badge>
                                                {certificate.emailSentAt && (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {format(new Date(certificate.emailSentAt), 'MMM dd, h:mm a')}
                                                    </div>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleOpenPreview(certificate.id)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Preview
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDownloadCertificate(
                                                            certificate.id,
                                                            `${certificate.winner?.user?.firstName}_${certificate.winner?.user?.lastName}`
                                                        )}
                                                    >
                                                        <Download className="h-4 w-4 mr-1" />
                                                        Download
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Certificate Preview Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-none w-screen h-screen p-0 flex items-center justify-center bg-black/80 border-0">
                    {previewLoading ? (
                        <div className="flex flex-col justify-center items-center h-full">
                            <Loader2 className="h-12 w-12 animate-spin text-white" />
                            <span className="text-white/80 mt-4">Generating certificate preview...</span>
                        </div>
                    ) : previewCertificate ? (
                        <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex gap-3 z-20">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        if (selectedCertificateId) {
                                            const certificate = certificates.find(c => c.id === selectedCertificateId)
                                            if (certificate) {
                                                handleDownloadCertificate(
                                                    certificate.id,
                                                    `${certificate.winner?.user?.firstName}_${certificate.winner?.user?.lastName}`
                                                )
                                            }
                                        }
                                    }}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Certificate Iframe */}
                            <div
                                className="relative w-full h-full max-w-[1280px] max-h-[905px] bg-white shadow-2xl rounded-lg overflow-hidden"
                                style={{
                                    aspectRatio: '1.414 / 1', // A4 ratio
                                }}
                            >
                                <iframe
                                    srcDoc={previewCertificate}
                                    className="w-full h-full border-0"
                                    title="Certificate Preview"
                                    sandbox="allow-same-origin"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center h-full text-destructive">
                            <Award className="h-16 w-16 mb-4" />
                            <p className="text-lg">Failed to load certificate preview</p>
                            <Button
                                variant="secondary"
                                className="mt-4"
                                onClick={() => setDialogOpen(false)}
                            >
                                Close
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}