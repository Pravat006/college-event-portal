import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, Star, Bell, Trophy, Sparkles, TrendingUp } from 'lucide-react'
import Image from 'next/image'

import HeroSection from '@/components/landing/hero-section'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function getUpcomingEvents() {
  return await prisma.event.findMany({
    where: {
      status: 'PUBLISHED',
      startDate: { gte: new Date() }
    },
    include: {
      createdBy: { select: { firstName: true, lastName: true } },
      _count: { select: { registrations: true } }
    },
    orderBy: { startDate: 'asc' },
    take: 3
  })
}

async function getRecentWinners() {
  return await prisma.winner.findMany({
    include: {
      user: { select: { firstName: true, lastName: true } },
      event: { select: { title: true, category: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 6
  })
}

export default async function HomePage() {
  const [user, events, winners] = await Promise.all([
    getCurrentUser(),
    getUpcomingEvents(),
    getRecentWinners()
  ])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      ACADEMIC: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      CULTURAL: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      SPORTS: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      TECHNICAL: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      SOCIAL: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      WORKSHOP: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeroSection />

      {/* About Section - Timeline Animation */}
      <section id="next-section" className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              How It <span className="text-[#87e64b]">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your journey from discovery to celebration in four simple steps
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-linear-to-b from-[#87e64b]/20 via-[#87e64b]/50 to-[#87e64b]/20 hidden md:block" />

            <div className="space-y-16 md:space-y-24">
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-center gap-8 group">
                <div className="md:w-1/2 md:text-right md:pr-12 animate-fade-in-left">
                  <div className="inline-block mb-2 px-4 py-1 rounded-full bg-[#87e64b]/10 text-[#87e64b] text-sm font-semibold">
                    Step 1
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Discover Events</h3>
                  <p className="text-muted-foreground">
                    Browse through a diverse range of cultural, technical, and sports events tailored to your interests.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-[#87e64b]  items-center justify-center text-white font-bold text-xl shadow-lg hidden md:flex group-hover:scale-110 transition-transform">
                  1
                </div>
                <div className="md:w-1/2 md:pl-12 animate-fade-in-right">
                  <div className="bg-linear-to-br from-[#87e64b]/10 to-transparent p-6 rounded-2xl border border-[#87e64b]/20">
                    <Calendar className="w-12 h-12 text-[#87e64b] mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Smart filters help you find exactly what you&apos;re looking for
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row-reverse items-center gap-8 group">
                <div className="md:w-1/2 md:text-left md:pl-12 animate-fade-in-right">
                  <div className="inline-block mb-2 px-4 py-1 rounded-full bg-[#87e64b]/10 text-[#87e64b] text-sm font-semibold">
                    Step 2
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Register Instantly</h3>
                  <p className="text-muted-foreground">
                    Quick and seamless registration process with instant email confirmation.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-[#87e64b]  items-center justify-center text-white font-bold text-xl shadow-lg hidden md:flex group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="md:w-1/2 md:pr-12 animate-fade-in-left">
                  <div className="bg-linear-to-bl from-[#87e64b]/10 to-transparent p-6 rounded-2xl border border-[#87e64b]/20">
                    <Users className="w-12 h-12 text-[#87e64b] mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Secure your spot in seconds with our streamlined process
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-center gap-8 group">
                <div className="md:w-1/2 md:text-right md:pr-12 animate-fade-in-left">
                  <div className="inline-block mb-2 px-4 py-1 rounded-full bg-[#87e64b]/10 text-[#87e64b] text-sm font-semibold">
                    Step 3
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Stay Informed</h3>
                  <p className="text-muted-foreground">
                    Get real-time notifications and updates about your registered events.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-[#87e64b]  items-center justify-center text-white font-bold text-xl shadow-lg hidden md:flex group-hover:scale-110 transition-transform">
                  3
                </div>
                <div className="md:w-1/2 md:pl-12 animate-fade-in-right">
                  <div className="bg-linear-to-br from-[#87e64b]/10 to-transparent p-6 rounded-2xl border border-[#87e64b]/20">
                    <Bell className="w-12 h-12 text-[#87e64b] mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Never miss important updates or schedule changes
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col md:flex-row-reverse items-center gap-8 group">
                <div className="md:w-1/2 md:text-left md:pl-12 animate-fade-in-right">
                  <div className="inline-block mb-2 px-4 py-1 rounded-full bg-[#87e64b]/10 text-[#87e64b] text-sm font-semibold">
                    Step 4
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Celebrate & Share</h3>
                  <p className="text-muted-foreground">
                    Participate, win, and share your experiences with the community.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-[#87e64b] items-center justify-center text-white font-bold text-xl shadow-lg hidden md:flex group-hover:scale-110 transition-transform">
                  4
                </div>
                <div className="md:w-1/2 md:pr-12 animate-fade-in-left">
                  <div className="bg-linear-to-bl from-[#87e64b]/10 to-transparent p-6 rounded-2xl border border-[#87e64b]/20">
                    <Star className="w-12 h-12 text-[#87e64b] mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Leave feedback and help others make informed decisions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#87e64b]/10 text-[#87e64b]">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Happening Soon</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Upcoming <span className="text-[#87e64b]">Events</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Don&apos;t miss out on these exciting opportunities
            </p>
          </div>

          {events.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {events.map((event) => (
                <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 bg-linear-to-br from-[#87e64b]/20 to-[#87e64b]/5">
                    {event.imageUrl && (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(event.startDate)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{event._count.registrations} registered</span>
                      </div>
                    </div>
                    <Link href={`/browse-events/event/${event.id}`}>
                      <Button className="w-full group-hover:bg-[#87e64b] group-hover:text-white transition-colors">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
            </div>
          )}

          <div className="text-center">
            <Link href="/browse-events">
              <Button size="lg" variant="outline" className="group">
                View All Events
                <TrendingUp className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Winners Section */}
      {winners.length > 0 && (
        <section className="py-20 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#87e64b]/10 text-[#87e64b]">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-semibold">Hall of Fame</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Recent <span className="text-[#87e64b]">Winners</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Celebrating excellence and achievement
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {winners.map((winner) => (
                <Card key={winner.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-[#87e64b]/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 flex items-center gap-2">
                          {Number(winner.position) === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
                          {Number(winner.position) === 2 && <Trophy className="w-5 h-5 text-gray-400" />}
                          {Number(winner.position) === 3 && <Trophy className="w-5 h-5 text-amber-600" />}
                          {winner.user.firstName} {winner.user.lastName}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {winner.event.title}
                        </CardDescription>
                      </div>
                      <div className="text-3xl font-bold text-[#87e64b]">
                        #{winner.position}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(winner.event.category)}`}>
                      {winner.event.category}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-[#87e64b]">Us</span>?
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to manage and participate in college events
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-[#87e64b]/50 group">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#87e64b]/10 flex items-center justify-center group-hover:bg-[#87e64b]/20 transition-colors">
                  <Calendar className="h-8 w-8 text-[#87e64b]" />
                </div>
                <CardTitle className="text-lg">Easy Discovery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Find events matching your interests with powerful browsing & filtering.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-[#87e64b]/50 group">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#87e64b]/10 flex items-center justify-center group-hover:bg-[#87e64b]/20 transition-colors">
                  <Users className="h-8 w-8 text-[#87e64b]" />
                </div>
                <CardTitle className="text-lg">Quick Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Register instantly and receive immediate confirmation.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-[#87e64b]/50 group">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#87e64b]/10 flex items-center justify-center group-hover:bg-[#87e64b]/20 transition-colors">
                  <Star className="h-8 w-8 text-[#87e64b]" />
                </div>
                <CardTitle className="text-lg">Community Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Share experiences and read peer reviews to choose wisely.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-[#87e64b]/50 group">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#87e64b]/10 flex items-center justify-center group-hover:bg-[#87e64b]/20 transition-colors">
                  <Bell className="h-8 w-8 text-[#87e64b]" />
                </div>
                <CardTitle className="text-lg">Stay Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get real-time notifications about updates & reminders.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-20 px-4 bg-linear-to-br from-[#87e64b] to-[#6bc93a] text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h3>
            <p className="text-lg sm:text-xl mb-8 text-white/90">
              Join thousands of students already discovering amazing events.
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 hover:scale-105 transition-transform">
                Create Your Account
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm sm:text-base">&copy; 2025 College Event Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}