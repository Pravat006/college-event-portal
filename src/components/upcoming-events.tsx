import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users } from 'lucide-react'
import { format } from 'date-fns'
import { UpcomingEventsProps } from '@/types'




export default function UpcomingEvents({ events }: UpcomingEventsProps) {
    const getCategoryColor = (category: string) => {
        const colors = {
            'ACADEMIC': 'bg-blue-100 text-blue-800',
            'CULTURAL': 'bg-purple-100 text-purple-800',
            'SPORTS': 'bg-green-100 text-green-800',
            'TECHNICAL': 'bg-orange-100 text-orange-800',
            'SOCIAL': 'bg-pink-100 text-pink-800',
            'WORKSHOP': 'bg-yellow-100 text-yellow-800'
        }
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {events.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No upcoming events</p>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">{event.title}</h4>
                                <Badge className={getCategoryColor(event.category)}>
                                    {event.category}
                                </Badge>
                            </div>

                            <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {format(new Date(event.startDate), 'MMM dd, yyyy • HH:mm')}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {event.location}
                                </div>
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    {event._count?.registrations ?? 0} registered
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}