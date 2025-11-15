import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import { prisma } from '@/lib/prisma'

interface EventUpdateData {
    eventId: string
    message: string
    userId: string
}

interface User {
    socketId: string
    userId?: string
    eventChannels: Set<string>
}

export class SocketServer {
    private io: SocketIOServer
    private users: Map<string, User> = new Map()

    constructor(server: HTTPServer) {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                methods: ['GET', 'POST']
            },
            transports: ['websocket', 'polling']
        })

        this.initialize()
    }

    private initialize(): void {
        this.io.on('connection', (socket: Socket) => {
            console.log(`[SocketServer] Client connected: ${socket.id}`)
            this.handleConnection(socket)
        })
    }

    private handleConnection(socket: Socket): void {
        // Register user
        this.users.set(socket.id, {
            socketId: socket.id,
            eventChannels: new Set()
        })

        // Set up event handlers
        socket.on('authenticate', (userId: string) => this.handleAuthenticate(socket, userId))
        socket.on('join-event', (eventId: string) => this.handleJoinEvent(socket, eventId))
        socket.on('leave-event', (eventId: string) => this.handleLeaveEvent(socket, eventId))
        socket.on('send-event-update', (data: EventUpdateData) => this.handleSendUpdate(socket, data))
        socket.on('disconnect', () => this.handleDisconnect(socket))
    }

    private handleAuthenticate(socket: Socket, userId: string): void {
        const user = this.users.get(socket.id)
        if (user) {
            user.userId = userId
            console.log(`[SocketServer] User authenticated: ${userId}`)
            socket.emit('authenticated', { success: true })
        }
    }

    private async handleJoinEvent(socket: Socket, eventId: string): Promise<void> {
        try {
            const user = this.users.get(socket.id)
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

            console.log(`[SocketServer] User ${socket.id} joined event: ${eventId}`)

            // Send recent updates
            const recentUpdates = await this.getRecentUpdates(eventId)
            socket.emit('event-history', recentUpdates)

            // Notify others
            socket.to(`event:${eventId}`).emit('user-joined', {
                eventId,
                timestamp: new Date()
            })
        } catch (error) {
            console.error('[SocketServer] Error joining event:', error)
            socket.emit('error', { message: 'Failed to join event' })
        }
    }

    private handleLeaveEvent(socket: Socket, eventId: string): void {
        const user = this.users.get(socket.id)
        if (!user) return

        socket.leave(`event:${eventId}`)
        user.eventChannels.delete(eventId)

        console.log(`[SocketServer] User ${socket.id} left event: ${eventId}`)

        socket.to(`event:${eventId}`).emit('user-left', {
            eventId,
            timestamp: new Date()
        })
    }

    private async handleSendUpdate(socket: Socket, data: EventUpdateData): Promise<void> {
        try {
            const user = this.users.get(socket.id)
            if (!user || !user.userId) {
                socket.emit('error', { message: 'Not authenticated' })
                return
            }

            const event = await prisma.event.findUnique({
                where: { id: data.eventId },
                select: { createdById: true, title: true }
            })

            if (!event) {
                socket.emit('error', { message: 'Event not found' })
                return
            }

            if (event.createdById !== data.userId) {
                socket.emit('error', { message: 'Unauthorized' })
                return
            }

            const update = await prisma.eventUpdate.create({
                data: {
                    eventId: data.eventId,
                    content: data.message,
                    senderId: data.userId
                },
                include: {
                    sentBy: {
                        select: { firstName: true, lastName: true }
                    }
                }
            })

            const updatePayload = {
                id: update.id,
                message: update.content,
                createdBy: `${update.sentBy.firstName} ${update.sentBy.lastName}`,
                timestamp: update.sentAt
            }

            this.io.to(`event:${data.eventId}`).emit('event-update', updatePayload)

            console.log(`[SocketServer] Update sent for event ${data.eventId}`)
        } catch (error) {
            console.error('[SocketServer] Error sending update:', error)
            socket.emit('error', { message: 'Failed to send update' })
        }
    }

    private handleDisconnect(socket: Socket): void {
        const user = this.users.get(socket.id)
        if (user) {
            user.eventChannels.forEach(eventId => {
                socket.to(`event:${eventId}`).emit('user-left', {
                    eventId,
                    timestamp: new Date()
                })
            })
        }

        this.users.delete(socket.id)
        console.log(`[SocketServer] Client disconnected: ${socket.id}`)
    }

    private async getRecentUpdates(eventId: string, limit: number = 10) {
        return prisma.eventUpdate.findMany({
            where: { eventId },
            take: limit,
            orderBy: { sentAt: 'desc' },
            include: {
                sentBy: {
                    select: { firstName: true, lastName: true }
                }
            }
        })
    }

    public getIO(): SocketIOServer {
        return this.io
    }

    public getConnectedUsers(): number {
        return this.users.size
    }

    public getEventRoomSize(eventId: string): number {
        const room = this.io.sockets.adapter.rooms.get(`event:${eventId}`)
        return room ? room.size : 0
    }
}