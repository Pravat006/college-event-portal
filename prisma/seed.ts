import { prisma } from "@/lib/prisma"

async function seed() {
    console.log('🌱 Starting feedback seed for event cmhzbjujk000k3tflwtlwouc9...')

    const eventId = 'cmhzbjujk000k3tflwtlwouc9'

    // Get the specific event with its ATTENDED registrations
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
            registrations: {
                where: { status: 'ATTENDED' },
                select: { userId: true }
            }
        }
    })

    if (!event) {
        console.log('❌ Event not found')
        return
    }

    console.log(`📅 Found event: "${event.title}"`)
    console.log(`👥 Found ${event.registrations.length} attended users`)

    if (event.registrations.length === 0) {
        console.log('⚠️  No attended users found for this event')
        return
    }

    await prisma.feedback.deleteMany({
        where: { eventId }
    })

    const feedbackComments = [
        "Excellent event! Very well organized and informative.",
        "Great experience! Learned a lot and enjoyed every moment.",
        "Amazing event! The organizers did a fantastic job.",
        "Very engaging and interactive. Would love to attend more such events.",
        "Good event overall. Could improve on time management.",
        "Loved the energy and the content. Highly recommended!",
        "Well executed event. The speakers were knowledgeable.",
        "Fantastic! The event exceeded my expectations.",
        "Enjoyed the event but the venue could have been better.",
        "Brilliant event! Worth every minute spent.",
        "Very informative and well-structured.",
        "Great initiative! Looking forward to more such events.",
        "The event was good but a bit too long.",
        "Superb organization and excellent content delivery.",
        "Had a wonderful time! The activities were engaging.",
        "Very professional event. Kudos to the team!",
        "Good event, but could use more hands-on activities.",
        "Absolutely loved it! One of the best events I've attended.",
        "Nice event with great networking opportunities.",
        "Well done! The event was both fun and educational."
    ]

    const attendedUserIds = event.registrations.map(reg => reg.userId)

    // 70% of attended users will give feedback
    const feedbackCount = Math.ceil(attendedUserIds.length * 0.7)
    const usersWhoGiveFeedback = attendedUserIds.slice(0, feedbackCount)

    const feedbackData = []

    for (const userId of usersWhoGiveFeedback) {
        const rating = Math.floor(Math.random() * 2) + 4 // Random rating between 4-5
        const comment = feedbackComments[Math.floor(Math.random() * feedbackComments.length)]

        feedbackData.push({
            userId: userId,
            eventId: event.id,
            rating: rating,
            comment: comment,
            createdAt: new Date(event.endDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000) // Within 2 days after event
        })
    }

    await prisma.feedback.createMany({
        data: feedbackData
    })

    console.log(`⭐ Created ${feedbackData.length} feedback entries for event "${event.title}"`)
    console.log('✨ Feedback seed completed successfully!')
}

seed()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })