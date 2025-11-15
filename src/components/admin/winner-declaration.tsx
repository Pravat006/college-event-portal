'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trophy, Medal, Award, Users, Search, Filter } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import type { Registration, WinnerPosition } from '@/types'
import { RegistrationWithWinner, WinnerDeclarationProps, WinnerSelection } from '@/lib/schemas'

const POSITION_OPTIONS = [
    { value: 'FIRST' as WinnerPosition, label: '🥇 1st Place', icon: Trophy },
    { value: 'SECOND' as WinnerPosition, label: '🥈 2nd Place', icon: Medal },
    { value: 'THIRD' as WinnerPosition, label: '🥉 3rd Place', icon: Award },
    { value: 'PARTICIPATION' as WinnerPosition, label: '🎖️ Participation', icon: Users }
]

export default function WinnerDeclaration({ eventId, eventTitle }: WinnerDeclarationProps) {
    const [registrations, setRegistrations] = useState<RegistrationWithWinner[]>([])
    const [filteredRegistrations, setFilteredRegistrations] = useState<RegistrationWithWinner[]>([])
    const [winners, setWinners] = useState<WinnerSelection[]>([])
    const [loading, setLoading] = useState(true)
    const [declaring, setDeclaring] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [positionFilter, setPositionFilter] = useState('all')
    const [showDialog, setShowDialog] = useState(false)

    useEffect(() => {
        fetchRegistrations()
    }, [eventId])

    useEffect(() => {
        filterRegistrations()
    }, [registrations, searchTerm, positionFilter])

    const fetchRegistrations = async () => {
        try {
            const response = await fetch(`/api/admin/winners?eventId=${eventId}`)
            if (response.ok) {
                const data = await response.json()
                setRegistrations(data)
            } else {
                toast.error('Failed to fetch registrations')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const filterRegistrations = () => {
        let filtered = registrations

        if (searchTerm) {
            filtered = filtered.filter(reg =>
                reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reg.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(reg.registrationNumber).toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (positionFilter !== 'all') {
            if (positionFilter === 'winners') {
                filtered = filtered.filter(reg => reg.isWinner)
            } else if (positionFilter === 'no-winners') {
                filtered = filtered.filter(reg => !reg.isWinner)
            }
        }

        setFilteredRegistrations(filtered)
    }

    const handlePositionChange = (userId: string, position: string) => {
        // Remove "NONE" value to clear selection
        if (position === 'NONE') {
            setWinners(prev => prev.filter(w => w.userId !== userId))
            return
        }

        setWinners(prev => {
            const existing = prev.find(w => w.userId === userId)
            if (existing) {
                return prev.map(w =>
                    w.userId === userId
                        ? { ...w, position: position as WinnerPosition }
                        : w
                )
            } else {
                return [...prev, { userId, position: position as WinnerPosition }]
            }
        })
    }

    const handleDeclareWinners = async () => {
        if (winners.length === 0) {
            toast.error('Please select at least one winner')
            return
        }

        setDeclaring(true)
        try {
            const response = await fetch('/api/admin/winners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId,
                    winners
                })
            })

            if (response.ok) {
                const result = await response.json()
                toast.success(`Winners declared! Certificates sent to ${(result.results as { status: string }[]).filter((r: { status: string }) => r.status === 'success').length} participants`)
                setShowDialog(false)
                setWinners([])
                fetchRegistrations()
            } else {
                const error = await response.json()
                toast.error(error.message || 'Failed to declare winners')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setDeclaring(false)
        }
    }

    const getPositionBadge = (registration: RegistrationWithWinner) => {
        if (!registration.isWinner) return null

        const position = registration.winnerData?.position
        if (!position) return null

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

    const getSelectedPosition = (userId: string) => {
        const position = winners.find(w => w.userId === userId)?.position
        return position || 'NONE'
    }

    if (loading) {
        return <div className="flex justify-center py-8">Loading registrations...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Winner Declaration</h2>
                    <p className="text-gray-600 mt-1">Declare winners and issue certificates for {eventTitle}</p>
                </div>

                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogTrigger asChild>
                        <Button disabled={winners.length === 0}>
                            <Trophy className="h-4 w-4 mr-2" />
                            Declare Winners ({winners.length})
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Winner Declaration</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <p>You are about to declare {winners.length} winner(s) and issue certificates:</p>

                            <div className="space-y-2">
                                {winners.map(winner => {
                                    const registration = registrations.find(r => r.userId === winner.userId)
                                    const positionLabel = POSITION_OPTIONS.find(p => p.value === winner.position)?.label || winner.position
                                    return (
                                        <div key={winner.userId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <span className="font-medium">{registration?.fullName}</span>
                                            <Badge>{positionLabel}</Badge>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-900 mb-2">What will happen:</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Certificates will be automatically generated</li>
                                    <li>• Winners will receive certificates via email</li>
                                    <li>• Notifications will be sent to all winners</li>
                                    <li>• This action cannot be undone</li>
                                </ul>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <Button variant="outline" onClick={() => setShowDialog(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleDeclareWinners} disabled={declaring}>
                                    {declaring ? 'Processing...' : 'Confirm & Send Certificates'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Event Participants ({filteredRegistrations.length})</CardTitle>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by name, email, or registration number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={positionFilter} onValueChange={setPositionFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Participants</SelectItem>
                                <SelectItem value="winners">Winners Only</SelectItem>
                                <SelectItem value="no-winners">Not Winners</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Participant</TableHead>
                                    <TableHead>Registration Info</TableHead>
                                    <TableHead>Current Status</TableHead>
                                    <TableHead>Declare Winner</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRegistrations.map((registration) => (
                                    <TableRow key={registration.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{registration.fullName}</div>
                                                <div className="text-sm text-gray-500">{registration.user.email}</div>
                                                <div className="text-xs text-gray-400">
                                                    Semester {registration.semester}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="text-sm">
                                                <div>Reg: {registration.registrationNumber}</div>
                                                <div className="text-gray-500">
                                                    "KONARK INSTITUTE OF SCIENCE AND TECHNOLOGY"
                                                </div>
                                                <div className="text-gray-500">
                                                    Registered: {format(new Date(registration.registeredAt), 'MMM dd')}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="space-y-1">
                                                <Badge variant={registration.status === 'ATTENDED' ? 'default' : 'secondary'}>
                                                    {registration.status}
                                                </Badge>
                                                {getPositionBadge(registration)}
                                                {registration.certificateIssued && (
                                                    <div className="text-xs text-green-600">
                                                        Certificate issued {registration.winnerData && format(new Date(registration.winnerData.declaredAt), 'MMM dd')}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            {registration.status === 'ATTENDED' && !registration.isWinner && (
                                                <Select
                                                    value={getSelectedPosition(registration.userId)}
                                                    onValueChange={(value) => handlePositionChange(registration.userId, value)}
                                                >
                                                    <SelectTrigger className="w-40">
                                                        <SelectValue placeholder="Select position" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="NONE">No Award</SelectItem>
                                                        {POSITION_OPTIONS.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                            {registration.isWinner && (
                                                <span className="text-sm text-green-600 font-medium">
                                                    Already declared winner
                                                </span>
                                            )}
                                            {registration.status !== 'ATTENDED' && (
                                                <span className="text-sm text-gray-500">
                                                    Must attend to be eligible
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredRegistrations.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No participants found matching your criteria
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}