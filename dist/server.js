"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var url_1 = require("url");
var next_1 = require("next");
var socket_io_1 = require("socket.io");
var prisma_1 = require("./lib/prisma");
var dev = process.env.NODE_ENV !== 'production';
var hostname = 'localhost';
var port = parseInt(process.env.PORT || '3000', 10);
var app = (0, next_1.default)({ dev: dev, hostname: hostname, port: port });
var handle = app.getRequestHandler();
app.prepare().then(function () {
    var server = (0, http_1.createServer)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var parsedUrl, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parsedUrl = (0, url_1.parse)(req.url, true);
                    return [4 /*yield*/, handle(req, res, parsedUrl)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error('Error occurred handling', req.url, err_1);
                    res.statusCode = 500;
                    res.end('internal server error');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    var io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            methods: ['GET', 'POST']
        },
        transports: ['websocket', 'polling']
    });
    var users = new Map();
    io.on('connection', function (socket) {
        console.log('[Socket.IO] Client connected:', socket.id);
        users.set(socket.id, { eventChannels: new Set() });
        // Authenticate user
        socket.on('authenticate', function (userId) {
            var user = users.get(socket.id);
            if (user) {
                user.userId = userId;
                console.log('[Socket.IO] User authenticated:', userId);
                socket.emit('authenticated', { success: true });
            }
        });
        // Join event channel
        socket.on('join-event', function (eventId) { return __awaiter(void 0, void 0, void 0, function () {
            var user, event_1, recentUpdates, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        user = users.get(socket.id);
                        if (!user)
                            return [2 /*return*/];
                        return [4 /*yield*/, prisma_1.prisma.event.findUnique({
                                where: { id: eventId },
                                select: { id: true, title: true }
                            })];
                    case 1:
                        event_1 = _a.sent();
                        if (!event_1) {
                            socket.emit('error', { message: 'Event not found' });
                            return [2 /*return*/];
                        }
                        // Join room
                        socket.join("event:".concat(eventId));
                        user.eventChannels.add(eventId);
                        console.log("[Socket.IO] User ".concat(socket.id, " joined event: ").concat(eventId));
                        return [4 /*yield*/, prisma_1.prisma.eventUpdate.findMany({
                                where: { eventId: eventId },
                                take: 10,
                                orderBy: { sentAt: 'desc' },
                                include: {
                                    sentBy: {
                                        select: { firstName: true, lastName: true }
                                    }
                                }
                            })];
                    case 2:
                        recentUpdates = _a.sent();
                        socket.emit('event-history', recentUpdates.reverse());
                        // Notify others
                        socket.to("event:".concat(eventId)).emit('user-joined', {
                            eventId: eventId,
                            timestamp: new Date()
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('[Socket.IO] Error joining event:', error_1);
                        socket.emit('error', { message: 'Failed to join event' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Leave event channel
        socket.on('leave-event', function (eventId) {
            var user = users.get(socket.id);
            if (!user)
                return;
            socket.leave("event:".concat(eventId));
            user.eventChannels.delete(eventId);
            console.log("[Socket.IO] User ".concat(socket.id, " left event: ").concat(eventId));
            socket.to("event:".concat(eventId)).emit('user-left', {
                eventId: eventId,
                timestamp: new Date()
            });
        });
        // Send event update
        socket.on('send-event-update', function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var user, event_2, dbUser, update, updatePayload, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        user = users.get(socket.id);
                        if (!user || !user.userId) {
                            socket.emit('error', { message: 'Not authenticated' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, prisma_1.prisma.event.findUnique({
                                where: { id: data.eventId },
                                select: { createdById: true }
                            })];
                    case 1:
                        event_2 = _a.sent();
                        if (!event_2) {
                            socket.emit('error', { message: 'Event not found' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                                where: { clerkId: data.userId },
                                select: { id: true, role: true }
                            })];
                    case 2:
                        dbUser = _a.sent();
                        if (!dbUser || (dbUser.role !== 'ADMIN' && event_2.createdById !== dbUser.id)) {
                            socket.emit('error', { message: 'Unauthorized' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, prisma_1.prisma.eventUpdate.create({
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
                            })];
                    case 3:
                        update = _a.sent();
                        updatePayload = {
                            id: update.id,
                            content: update.content,
                            createdBy: "".concat(update.sentBy.firstName, " ").concat(update.sentBy.lastName),
                            sentAt: update.sentAt
                        };
                        io.to("event:".concat(data.eventId)).emit('event-update', updatePayload);
                        console.log("[Socket.IO] Update sent for event ".concat(data.eventId));
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.error('[Socket.IO] Error sending update:', error_2);
                        socket.emit('error', { message: 'Failed to send update' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
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
        socket.on('disconnect', function () {
            var user = users.get(socket.id);
            if (user) {
                user.eventChannels.forEach(function (eventId) {
                    socket.to("event:".concat(eventId)).emit('user-left', {
                        eventId: eventId,
                        timestamp: new Date()
                    });
                });
            }
            users.delete(socket.id);
            console.log('[Socket.IO] Client disconnected:', socket.id);
        });
    });
    server.listen(port, function () {
        console.log("> Ready on http://".concat(hostname, ":").concat(port));
        console.log("> Socket.IO server initialized");
    });
});
