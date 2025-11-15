import io from 'socket.io-client'

let socket: ReturnType<typeof io> | null = null

export function getSocketClient() {
    if (!socket) {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'
        socket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            autoConnect: false
        })
    }
    return socket
}

export async function emitEventUpdate(eventId: string, update: {
    id: string
    content: string
    createdBy: string
    sentAt: Date
}) {
    try {
        const client = getSocketClient()

        if (!client.connected) {
            client.connect()
            await new Promise<void>((resolve) => {
                client.once('connect', resolve)
            })
        }

        client.emit('broadcast-update', {
            eventId,
            update
        })

        console.log(`[Socket.IO Client] Broadcasted update for event ${eventId}`)
    } catch (error) {
        console.error('[Socket.IO Client] Failed to emit update:', error)
    }
}
