import { prisma } from "@/lib/prisma"

interface Event {
    title: string;
    description: string;
    imageUrl: string;
    location: string;
    startDate: Date;
    endDate: Date;
    capacity: number;
    price: number;
    category: 'ACADEMIC' | 'CULTURAL' | 'SPORTS' | 'TECHNICAL' | 'SOCIAL' | 'WORKSHOP';
    status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
    createdById: string;
}

async function seed() {
    console.log('🌱 Starting feedback seed...')

    // Only delete existing feedback to recreate it
    await prisma.feedback.deleteMany();

    console.log('🗑️  Cleared existing feedback data')

    // Fetch existing users and events from database
    const existingUsers = await prisma.user.findMany({
        where: { role: 'USER' },
        select: { id: true, firstName: true, lastName: true }
    });

    const existingEvents = await prisma.event.findMany({
        where: { status: 'COMPLETED' },
        include: {
            registrations: {
                where: { status: 'ATTENDED' },
                select: { userId: true }
            }
        }
    });

    if (existingUsers.length === 0) {
        console.log('⚠️  No users found in database. Please seed users first.')
        return
    }

    if (existingEvents.length === 0) {
        console.log('⚠️  No completed events found in database. Please seed events first.')
        return
    }

    console.log(`👥 Found ${existingUsers.length} users`)
    console.log(`📅 Found ${existingEvents.length} completed events`)

    // Create 20 Indian users
    const allUserData = [
        { firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh.kumar@college.edu', clerkId: 'clerk_rajesh_001', regNo: '2021001' },
        { firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@college.edu', clerkId: 'clerk_priya_002', regNo: '2021002' },
        { firstName: 'Amit', lastName: 'Patel', email: 'amit.patel@college.edu', clerkId: 'clerk_amit_003', regNo: '2021003' },
        { firstName: 'Sneha', lastName: 'Reddy', email: 'sneha.reddy@college.edu', clerkId: 'clerk_sneha_004', regNo: '2021004' },
        { firstName: 'Vikram', lastName: 'Singh', email: 'vikram.singh@college.edu', clerkId: 'clerk_vikram_005', regNo: '2021005' },
        { firstName: 'Ananya', lastName: 'Iyer', email: 'ananya.iyer@college.edu', clerkId: 'clerk_ananya_006', regNo: '2021006' },
        { firstName: 'Rohan', lastName: 'Verma', email: 'rohan.verma@college.edu', clerkId: 'clerk_rohan_007', regNo: '2021007' },
        { firstName: 'Kavya', lastName: 'Nair', email: 'kavya.nair@college.edu', clerkId: 'clerk_kavya_008', regNo: '2021008' },
        { firstName: 'Aditya', lastName: 'Gupta', email: 'aditya.gupta@college.edu', clerkId: 'clerk_aditya_009', regNo: '2021009' },
        { firstName: 'Ishita', lastName: 'Joshi', email: 'ishita.joshi@college.edu', clerkId: 'clerk_ishita_010', regNo: '2021010' },
        { firstName: 'Arjun', lastName: 'Menon', email: 'arjun.menon@college.edu', clerkId: 'clerk_arjun_011', regNo: '2021011' },
        { firstName: 'Neha', lastName: 'Chopra', email: 'neha.chopra@college.edu', clerkId: 'clerk_neha_012', regNo: '2021012' },
        { firstName: 'Karan', lastName: 'Mehta', email: 'karan.mehta@college.edu', clerkId: 'clerk_karan_013', regNo: '2021013' },
        { firstName: 'Riya', lastName: 'Desai', email: 'riya.desai@college.edu', clerkId: 'clerk_riya_014', regNo: '2021014' },
        { firstName: 'Siddharth', lastName: 'Rao', email: 'siddharth.rao@college.edu', clerkId: 'clerk_siddharth_015', regNo: '2021015' },
        { firstName: 'Pooja', lastName: 'Bhat', email: 'pooja.bhat@college.edu', clerkId: 'clerk_pooja_016', regNo: '2021016' },
        { firstName: 'Nikhil', lastName: 'Shetty', email: 'nikhil.shetty@college.edu', clerkId: 'clerk_nikhil_017', regNo: '2021017' },
        { firstName: 'Diya', lastName: 'Agarwal', email: 'diya.agarwal@college.edu', clerkId: 'clerk_diya_018', regNo: '2021018' },
        { firstName: 'Varun', lastName: 'Pillai', email: 'varun.pillai@college.edu', clerkId: 'clerk_varun_019', regNo: '2021019' },
        { firstName: 'Meera', lastName: 'Kulkarni', email: 'meera.kulkarni@college.edu', clerkId: 'clerk_meera_020', regNo: '2021020' },
    ];

    const createdUsers = [];
    for (const userData of allUserData) {
        const user = await prisma.user.create({
            data: {
                clerkId: userData.clerkId,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: 'USER'
            }
        });
        createdUsers.push({ ...user, regNo: userData.regNo });
    }

    console.log('👥 Created 20 users')

    // Use existing admin user ID
    const createdById = "cmhw7qn120029ysed3bz8hsve";

    const events: Event[] = [
        // 7 COMPLETED EVENTS
        {
            title: 'TechQuest',
            description: 'Tech quest by department of computer science, to check the technical quiz ability. It is affiliated by Computer Society of India in KIST college.',
            imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
            location: 'Computer Science Department',
            startDate: new Date('2025-11-14T10:00:00.000Z'),
            endDate: new Date('2025-11-14T15:00:00.000Z'),
            capacity: 150,
            price: 0,
            category: 'TECHNICAL',
            status: 'COMPLETED',
            createdById,
        },
        {
            title: 'Robotics Workshop',
            description: 'Hands-on workshop on robotics and automation, open to all engineering majors.',
            imageUrl: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg',
            location: 'Lab Block 2',
            startDate: new Date('2025-11-10T10:00:00.000Z'),
            endDate: new Date('2025-11-10T17:00:00.000Z'),
            capacity: 60,
            price: 100,
            category: 'WORKSHOP',
            status: 'COMPLETED',
            createdById,
        },
        {
            title: 'Cultural Fest 2025',
            description: 'Annual cultural festival with music, dance, drama, and art competitions.',
            imageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
            location: 'Open Grounds',
            startDate: new Date('2025-11-05T16:00:00.000Z'),
            endDate: new Date('2025-11-05T22:00:00.000Z'),
            capacity: 500,
            price: 50,
            category: 'CULTURAL',
            status: 'COMPLETED',
            createdById,
        },
        {
            title: 'Sports Meet',
            description: 'Inter-departmental sports competitions including cricket, football, and athletics.',
            imageUrl: 'https://images.pexels.com/photos/46798/pexels-photo-46798.jpeg',
            location: 'Sports Complex',
            startDate: new Date('2025-11-01T08:00:00.000Z'),
            endDate: new Date('2025-11-01T18:00:00.000Z'),
            capacity: 300,
            price: 0,
            category: 'SPORTS',
            status: 'COMPLETED',
            createdById,
        },
        {
            title: 'Paper Presentation',
            description: 'Showcase your research and technical papers. Open for all engineering streams.',
            imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
            location: 'Seminar Hall',
            startDate: new Date('2025-10-28T09:30:00.000Z'),
            endDate: new Date('2025-10-28T13:30:00.000Z'),
            capacity: 80,
            price: 0,
            category: 'ACADEMIC',
            status: 'COMPLETED',
            createdById,
        },
        {
            title: 'Mini Project Expo',
            description: 'Display your semester mini projects. Open for all engineering branches.',
            imageUrl: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg',
            location: 'Project Lab',
            startDate: new Date('2025-10-25T10:00:00.000Z'),
            endDate: new Date('2025-10-25T16:00:00.000Z'),
            capacity: 120,
            price: 0,
            category: 'TECHNICAL',
            status: 'COMPLETED',
            createdById,
        },
        {
            title: 'Social Awareness Drive',
            description: 'Engineering students organize a campus-wide cleanliness and awareness campaign.',
            imageUrl: 'https://images.pexels.com/photos/461064/pexels-photo-461064.jpeg',
            location: 'Campus Entrance',
            startDate: new Date('2025-10-20T09:00:00.000Z'),
            endDate: new Date('2025-10-20T13:00:00.000Z'),
            capacity: 100,
            price: 0,
            category: 'SOCIAL',
            status: 'COMPLETED',
            createdById,
        },
        // 3 UPCOMING EVENTS IN DECEMBER
        {
            title: 'Hackathon 2025',
            description: 'A 24-hour coding marathon for all branches. Build innovative solutions to real-world problems.',
            imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
            location: 'Main Auditorium',
            startDate: new Date('2025-12-15T09:00:00.000Z'),
            endDate: new Date('2025-12-15T17:00:00.000Z'),
            capacity: 200,
            price: 0,
            category: 'TECHNICAL',
            status: 'PUBLISHED',
            createdById,
        },
        {
            title: 'Dance Night',
            description: 'Enjoy a night of dance performances and competitions.',
            imageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
            location: 'Open Grounds',
            startDate: new Date('2025-12-20T18:00:00.000Z'),
            endDate: new Date('2025-12-20T22:00:00.000Z'),
            capacity: 400,
            price: 30,
            category: 'CULTURAL',
            status: 'PUBLISHED',
            createdById,
        },
        {
            title: 'Guest Lecture Series',
            description: 'Industry experts from Indian companies share insights on engineering trends.',
            imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
            location: 'Conference Room',
            startDate: new Date('2025-12-22T14:00:00.000Z'),
            endDate: new Date('2025-12-22T17:00:00.000Z'),
            capacity: 80,
            price: 0,
            category: 'ACADEMIC',
            status: 'PUBLISHED',
            createdById,
        },
    ];

    const createdEvents = await prisma.event.createManyAndReturn({
        data: events
    });

    console.log('📅 Created 10 events (7 completed, 3 upcoming)')

    // Track registered userId+eventId combinations to avoid duplicates
    const registeredCombinations = new Set<string>();
    const registrations = [];
    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

    // All 7 completed events - All 20 users register with ATTENDED status
    const completedEvents = createdEvents.slice(0, 7);

    for (const event of completedEvents) {
        for (const user of createdUsers) {
            const key = `${user.id}-${event.id}`;
            registeredCombinations.add(key);

            registrations.push({
                userId: user.id,
                eventId: event.id,
                fullName: `${user.firstName} ${user.lastName}`,
                registrationNumber: BigInt(user.regNo),
                semester: semesters[Math.floor(Math.random() * semesters.length)],
                status: 'ATTENDED' as const,
                registeredAt: new Date(event.startDate.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days before event
            });
        }
        console.log(`✅ Created 20 ATTENDED registrations for completed event "${event.title}"`)
    }

    // Upcoming events - First 10 users register with REGISTERED status
    const upcomingEvents = createdEvents.slice(7);
    const mainUsers = createdUsers.slice(0, 10);

    for (const event of upcomingEvents) {
        for (const user of mainUsers) {
            const key = `${user.id}-${event.id}`;
            registeredCombinations.add(key);

            registrations.push({
                userId: user.id,
                eventId: event.id,
                fullName: `${user.firstName} ${user.lastName}`,
                registrationNumber: BigInt(user.regNo),
                semester: semesters[Math.floor(Math.random() * semesters.length)],
                status: 'REGISTERED' as const,
                registeredAt: new Date()
            });
        }
        console.log(`📝 Created 10 REGISTERED registrations for upcoming event "${event.title}"`)
    }

    await prisma.registration.createMany({
        data: registrations
    });

    console.log(`📝 Created ${registrations.length} total registrations`)

    console.log(`👥 Found ${existingUsers.length} users`)
    console.log(`📅 Found ${existingEvents.length} completed events`)

    // Create feedback for completed events from attended users
    const feedbackData = [];
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
    ];

    for (const event of existingEvents) {
        const attendedUserIds = event.registrations.map(reg => reg.userId);

        // 70% of attended users will give feedback
        const feedbackCount = Math.ceil(attendedUserIds.length * 0.7);
        const usersWhoGiveFeedback = attendedUserIds.slice(0, feedbackCount);

        for (const userId of usersWhoGiveFeedback) {
            const rating = Math.floor(Math.random() * 2) + 4; // Random rating between 4-5
            const comment = feedbackComments[Math.floor(Math.random() * feedbackComments.length)];

            feedbackData.push({
                userId: userId,
                eventId: event.id,
                rating: rating,
                comment: comment,
                createdAt: new Date(event.endDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000) // Within 2 days after event
            });
        }
        console.log(`⭐ Created ${usersWhoGiveFeedback.length} feedback entries for completed event "${event.title}"`)
    }

    await prisma.feedback.createMany({
        data: feedbackData
    });

    console.log(`⭐ Created ${feedbackData.length} total feedback entries`)
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