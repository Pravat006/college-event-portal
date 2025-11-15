import { SocketServer } from './socket-server'

export class EventManager {
    private socketServer: SocketServer

    constructor(socketServer: SocketServer) {
        this.socketServer = socketServer
    }

    public async notifyEventUpdate(eventId: string, message: string, userId: string): Promise<void> {
        const io = this.socketServer.getIO()
        io.to(`event:${eventId}`).emit('event-update', {
            message,
            userId,
            timestamp: new Date()
        })
    }



    public getEventStats(eventId: string) {
        return {
            connectedUsers: this.socketServer.getEventRoomSize(eventId),
            eventId
        }
    }
}