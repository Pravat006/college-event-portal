import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server as SocketIOServer } from 'socket.io'
import { prisma } from './lib/prisma'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url!, true)
            await handle(req, res, parsedUrl)
        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('internal server error')
        }
    })


    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            methods: ['GET', 'POST']
        },
        transports: ['websocket', 'polling']
    })

    const users = new Map()

    io.on('connection', (socket) => {
        console.log('[Socket.IO] Client connected:', socket.id)

        users.set(socket.id, { eventChannels: new Set() })

        // Authenticate user
        socket.on('authenticate', (userId: string) => {
            const user = users.get(socket.id)
            if (user) {
                user.userId = userId
                console.log('[Socket.IO] User authenticated:', userId)
                socket.emit('authenticated', { success: true })
            }
        })

        // Join event channel
        socket.on('join-event', async (eventId: string) => {
            try {
                const user = users.get(socket.id)
                if (!user) return

                // Verify event exists
                const event = await prisma.event.findUnique({
                    where: { id: eventId },
                    select: { id: true, title: true }
                })

                if (!event) {
                    socket.emit('error', { message: 'Event not found' })
                    return
                }

                // Join room
                socket.join(`event:${eventId}`)
                user.eventChannels.add(eventId)

                console.log(`[Socket.IO] User ${socket.id} joined event: ${eventId}`)

                // Send recent updates
                const recentUpdates = await prisma.eventUpdate.findMany({
                    where: { eventId },
                    take: 10,
                    orderBy: { sentAt: 'desc' },
                    include: {
                        sentBy: {
                            select: { firstName: true, lastName: true }
                        }
                    }
                })

                socket.emit('event-history', recentUpdates.reverse())

                // Notify others
                socket.to(`event:${eventId}`).emit('user-joined', {
                    eventId,
                    timestamp: new Date()
                })
            } catch (error) {
                console.error('[Socket.IO] Error joining event:', error)
                socket.emit('error', { message: 'Failed to join event' })
            }
        })

        // Leave event channel
        socket.on('leave-event', (eventId: string) => {
            const user = users.get(socket.id)
            if (!user) return

            socket.leave(`event:${eventId}`)
            user.eventChannels.delete(eventId)

            console.log(`[Socket.IO] User ${socket.id} left event: ${eventId}`)

            socket.to(`event:${eventId}`).emit('user-left', {
                eventId,
                timestamp: new Date()
            })
        })

        // Send event update
        socket.on('send-event-update', async (data: {
            eventId: string
            message: string
            userId: string
        }) => {
            try {
                const user = users.get(socket.id)
                if (!user || !user.userId) {
                    socket.emit('error', { message: 'Not authenticated' })
                    return
                }

                const event = await prisma.event.findUnique({
                    where: { id: data.eventId },
                    select: { createdById: true }
                })

                if (!event) {
                    socket.emit('error', { message: 'Event not found' })
                    return
                }

                const dbUser = await prisma.user.findUnique({
                    where: { clerkId: data.userId },
                    select: { id: true, role: true }
                })

                if (!dbUser || (dbUser.role !== 'ADMIN' && event.createdById !== dbUser.id)) {
                    socket.emit('error', { message: 'Unauthorized' })
                    return
                }


                const update = await prisma.eventUpdate.create({
                    data: {
                        eventId: data.eventId,
                        content: data.message,
                        senderId: dbUser.id
                    },
                    include: {
                        sentBy: {
                            select: { firstName: true, lastName: true }
                        }
                    }
                })

                const updatePayload = {
                    id: update.id,
                    content: update.content,
                    createdBy: `${update.sentBy.firstName} ${update.sentBy.lastName}`,
                    sentAt: update.sentAt
                }

                io.to(`event:${data.eventId}`).emit('event-update', updatePayload)

                console.log(`[Socket.IO] Update sent for event ${data.eventId}`)
            } catch (error) {
                console.error('[Socket.IO] Error sending update:', error)
                socket.emit('error', { message: 'Failed to send update' })
            }
        })

        // Broadcast update (called from API routes)
        // socket.on('broadcast-update', (data: {
        //     eventId: string
        //     update: {
        //         id: string
        //         content: string
        //         createdBy: string
        //         sentAt: Date
        //     }
        // }) => {
        //     console.log(`[Socket.IO] Broadcasting update for event ${data.eventId}`)
        //     io.to(`event:${data.eventId}`).emit('event-update', data.update)
        // })

        // Disconnect
        socket.on('disconnect', () => {
            const user = users.get(socket.id)
            if (user) {
                user.eventChannels.forEach((eventId: string) => {
                    socket.to(`event:${eventId}`).emit('user-left', {
                        eventId,
                        timestamp: new Date()
                    })
                })
            }

            users.delete(socket.id)
            console.log('[Socket.IO] Client disconnected:', socket.id)
        })
    })

    server.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`)
        console.log(`> Socket.IO server initialized`)
    })
})