import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Star, Bell, MapPin, Clock, DollarSign } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import EventRegistrationButton from '@/components/event-registration-button'
import Image from 'next/image'

async function getUpcomingEvents() {
  return await prisma.event.findMany({
    where: {
      status: 'PUBLISHED',
      startDate: { gte: new Date() }
    },
    include: {
      createdBy: { select: { firstName: true, lastName: true } },
      registrations: { include: { user: { select: { id: true } } } },
      _count: { select: { registrations: true, feedback: true } }
    },
    orderBy: { startDate: 'asc' },
    take: 6
  })
}

async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  return await prisma.user.findUnique({
    where: { clerkId: userId }
  })
}

export default async function HomePage() {
  const [events, user] = await Promise.all([
    getUpcomingEvents(),
    getCurrentUser()
  ])

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
    <div className="h-dvh bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">College Events</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user.firstName}!
                  </span>
                  <Link href="/dashboard">
                    <Button>Dashboard</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 "
      // style={{
      //   backgroundImage: 'url(https://images.pexels.com/photos/698907/pexels-photo-698907.jpeg)',
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      // }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Discover & Join
            <span className="text-blue-600 block">Amazing College Events</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stay connected with your campus community. Discover exciting events, workshops, and activities happening around you.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Join as Student
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Apply as Admin
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don&apos;t miss out on these exciting events happening on campus. Register now to secure your spot!
            </p>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No upcoming events</h3>
              <p className="text-gray-500">Check back soon for new events!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const isUserRegistered = user ? event.registrations.some(reg => reg.user.id === user.id) : false
                const isFull = event._count.registrations >= event.capacity

                return (
                  <Card key={event.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    {event.imageUrl && (
                      <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                        <Image
                          src={event?.imageUrl}
                          alt={event?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <CardTitle className="line-clamp-2 text-lg">{event.title}</CardTitle>
                        <Badge className={getCategoryColor(event.category)}>
                          {event.category}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-3">
                        {event.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-3 text-blue-600" />
                          <span className="text-sm font-medium">
                            {format(new Date(event.startDate), 'EEEE, MMM dd, yyyy')}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-3 text-green-600" />
                          <span className="text-sm">
                            {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-3 text-red-600" />
                          <span className="text-sm line-clamp-1">{event.location}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2 text-purple-600" />
                            <span className="text-sm">
                              {event._count.registrations} / {event.capacity}
                            </span>
                          </div>

                          {event.price || 0 > 0 && (
                            <div className="flex items-center text-green-600 font-semibold">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span>{event.price}</span>
                            </div>
                          )}
                        </div>

                        {event._count.feedback > 0 && (
                          <div className="flex items-center text-gray-600">
                            <Star className="h-4 w-4 mr-2 text-yellow-600" />
                            <span className="text-sm">{event._count.feedback} reviews</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-gray-500">
                            by {event.createdBy.firstName} {event.createdBy.lastName}
                          </span>
                        </div>

                        <EventRegistrationButton
                          event={event}
                          user={user}
                          isRegistered={isUserRegistered}
                          isFull={isFull}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {events.length > 0 && (
            <div className="text-center mt-12">
              {user ? (
                <Link href="/events">
                  <Button size="lg" variant="outline">
                    View All Events
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-up">
                  <Button size="lg">
                    Sign Up to See More Events
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Join Our Platform?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Easy Discovery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Find events that match your interests with our intuitive browsing and filtering system.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Quick Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Register for events with just one click and get instant confirmation emails.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Star className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Community Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Share your experience and read reviews from other students to make informed choices.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Bell className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Stay Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get real-time notifications about event updates, reminders, and new opportunities.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 px-4 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of students already using our platform to discover amazing events.
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary">
                Create Your Account
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2025 College Event Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}