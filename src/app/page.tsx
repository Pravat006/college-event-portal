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
  if (!userId) return null
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
    const colors: Record<string, string> = {
      ACADEMIC: 'bg-blue-100 text-blue-800',
      CULTURAL: 'bg-purple-100 text-purple-800',
      SPORTS: 'bg-green-100 text-green-800',
      TECHNICAL: 'bg-orange-100 text-orange-800',
      SOCIAL: 'bg-pink-100 text-pink-800',
      WORKSHOP: 'bg-yellow-100 text-yellow-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-40">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-7 w-7 text-blue-600 sm:h-8 sm:w-8" />
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                College Events
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="hidden sm:inline text-sm text-gray-600 truncate max-w-[140px]">
                    Welcome, {user.firstName}!
                  </span>
                  <Link href="/dashboard">
                    <Button size="sm" className="sm:size-default">Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm" className="sm:size-default">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="sm" className="sm:size-default">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-14 sm:py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
            Discover & Join
            <span className="text-blue-600 block mt-1">Amazing College Events</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stay connected with your campus community. Discover exciting events, workshops, and activities happening around you.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
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

      {/* Upcoming Events */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="mx-auto w-full max-w-7xl">
          <div className="text-center mb-10 sm:mb-12 px-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Upcoming Events
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Don&apos;t miss out on these exciting events happening on campus. Register now to secure your spot!
            </p>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-14 sm:py-20">
              <Calendar className="mx-auto h-14 w-14 sm:h-16 sm:w-16 text-gray-300 mb-4" />
              <h4 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No upcoming events</h4>
              <p className="text-gray-500 text-sm sm:text-base">Check back soon for new events.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-8 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
              {events.map(event => {
                const isUserRegistered = user
                  ? event.registrations.some(reg => reg.user.id === user.id)
                  : false
                const isFull = event._count.registrations >= event.capacity

                return (
                  <Card
                    key={event.id}
                    className="flex flex-col hover:shadow-lg hover:shadow-blue-100 transition-all duration-300"
                  >
                    {event.imageUrl && (
                      <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          width={640}
                          height={360}
                          className="h-full w-full object-cover"
                          sizes="(max-width: 640px) 100vw, 33vw"
                          priority={false}
                        />
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <CardTitle className="line-clamp-2 text-base sm:text-lg">
                          {event.title}
                        </CardTitle>
                        <Badge className={`shrink-0 ${getCategoryColor(event.category)}`}>
                          {event.category}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                        {event.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-1 flex flex-col">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="font-medium truncate">
                            {format(new Date(event.startDate), 'EEE, MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-green-600" />
                          <span className="truncate">
                            {format(new Date(event.startDate), 'h:mm a')} – {format(new Date(event.endDate), 'h:mm a')}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-red-600" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2 text-purple-600" />
                            <span>
                              {event._count.registrations} / {event.capacity}
                            </span>
                          </div>
                          {event.price || 0 > 0 && (
                            <div className="flex items-center text-green-600 font-semibold">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span className="text-sm">{event.price}</span>
                            </div>
                          )}
                        </div>
                        {event._count.feedback > 0 && (
                          <div className="flex items-center text-gray-600">
                            <Star className="h-4 w-4 mr-2 text-yellow-600" />
                            <span>{event._count.feedback} reviews</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 mt-auto border-t">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-gray-500 truncate">
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
            <div className="text-center mt-10 sm:mt-14">
              {user ? (
                <Link href="/events">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View All Events
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-up">
                  <Button size="lg" className="w-full sm:w-auto">
                    Sign Up to See More Events
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-14 sm:py-20 px-4 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10 sm:mb-12">
            Why Join Our Platform?
          </h3>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-base sm:text-lg">Easy Discovery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Find events matching your interests with powerful browsing & filtering.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-base sm:text-lg">Quick Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Register instantly and receive immediate confirmation.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <Star className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-base sm:text-lg">Community Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Share experiences and read peer reviews to choose wisely.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <Bell className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-base sm:text-lg">Stay Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Get real-time notifications about updates & reminders.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-16 sm:py-20 px-4 bg-blue-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-5">
              Ready to Get Started?
            </h3>
            <p className="text-base sm:text-lg mb-8 text-blue-100">
              Join thousands of students already discovering amazing events.
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Create Your Account
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto text-center text-sm sm:text-base">
          <p>&copy; 2025 College Event Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}