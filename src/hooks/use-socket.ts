'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import io from 'socket.io-client'

interface EventUpdate {
    id: string
    message: string
    createdBy: string
    timestamp: Date
}

export function useEventSocket(eventId: string) {
    const { user } = useUser()

    const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null)
    const [updates, setUpdates] = useState<EventUpdate[]>([])
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
            transports: ['websocket', 'polling']
        })

        socketInstance.on('connect', () => {
            setIsConnected(true)
            console.log('Socket connected:', socketInstance.id)

            // Authenticate if user exists
            if (user) {
                socketInstance.emit('authenticate', user.id)
            }

            // Join event channel
            socketInstance.emit('join-event', eventId)
        })

        socketInstance.on('authenticated', () => {
            console.log('User authenticated')
        })



        socketInstance.on('event-update', (update: EventUpdate) => {
            setUpdates(prev => [...prev, update])
            toast.success(`New update: ${update.message}`)
        })




        socketInstance.on('error', ({ message }: { message: string }) => {
            toast.error(message)
        })

        socketInstance.on('disconnect', () => {
            setIsConnected(false)
            console.log('Socket disconnected')
        })

        setSocket(socketInstance)

        return () => {
            socketInstance.emit('leave-event', eventId)
            socketInstance.disconnect()
        }
    }, [eventId, user?.id])

    const sendUpdate = useCallback((message: string) => {
        if (socket && user?.id) {
            socket.emit('send-event-update', {
                eventId,
                message,
                userId: user.id
            })
        }
    }, [socket, eventId, user?.id])

    return { socket, updates, sendUpdate, isConnected }
}