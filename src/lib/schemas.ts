import { z } from 'zod'



export const RoleEnum = z.enum(['USER', 'ADMIN'])
export const CategoryEnum = z.enum(['ACADEMIC', 'CULTURAL', 'SPORTS', 'TECHNICAL', 'SOCIAL', 'WORKSHOP'])
export const EventStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'])
export const RegistrationStatusEnum = z.enum(['REGISTERED', 'ATTENDED', 'CANCELLED'])
export const NotificationTypeEnum = z.enum([
    'EVENT_CREATED',
    'EVENT_UPDATED',
    'EVENT_CANCELLED',
    'REGISTRATION_CONFIRMED',
    'FEEDBACK_REQUEST',
    'REGISTRATION_CANCELLED'
])
export const WinnerPositionEnum = z.enum(['FIRST', 'SECOND', 'THIRD', 'PARTICIPATION'])


export const UserSchema = z.object({
    id: z.string().cuid(),
    clerkId: z.string(),
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    imageUrl: z.string().url().optional().nullable(),
    role: RoleEnum,
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const CreateUserSchema = z.object({
    clerkId: z.string(),
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    imageUrl: z.string().url().optional().nullable(),
    role: RoleEnum.optional().default('USER'),
})

export const UpdateUserSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    imageUrl: z.string().url().optional().nullable(),
    role: RoleEnum.optional(),
})



export const EventSchema = z.object({
    id: z.string().cuid(),
    title: z.string().min(1),
    description: z.string().min(1),
    imageUrl: z.string().url().optional().nullable(),
    location: z.string().min(1),
    startDate: z.date(),
    endDate: z.date(),
    capacity: z.number().int().positive(),
    price: z.number().nonnegative().optional().nullable(),
    category: CategoryEnum,
    status: EventStatusEnum,
    createdById: z.string().cuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const CreateEventSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    imageUrl: z.string().url().optional().nullable(),
    location: z.string().min(1, 'Location is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    capacity: z.number().int().min(1, 'Capacity must be at least 1'),
    price: z.number().nonnegative().optional().default(0),
    category: CategoryEnum,
    status: EventStatusEnum.optional().default('PUBLISHED'),
})

export const UpdateEventSchema = z.object({
    id: z.string().cuid(),
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    imageUrl: z.string().url().optional().nullable(),
    location: z.string().min(1, 'Location is required').optional(),
    startDate: z.string().min(1, 'Start date is required').optional(),
    endDate: z.string().min(1, 'End date is required').optional(),
    capacity: z.number().int().min(1, 'Capacity must be at least 1').optional(),
    price: z.number().nonnegative().optional(),
    category: CategoryEnum.optional(),
    status: EventStatusEnum.optional(),
})

export const DeleteEventSchema = z.object({
    id: z.string().cuid(),
})

export const EventFilterSchema = z.object({
    category: CategoryEnum.optional(),
    status: EventStatusEnum.optional(),
    search: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    createdById: z.string().cuid().optional(),
})


export const RegistrationSchema = z.object({
    id: z.string().cuid(),
    userId: z.string().cuid(),
    eventId: z.string().cuid(),
    status: RegistrationStatusEnum,
    registeredAt: z.date(),
    fullName: z.string().min(1),
    registrationNumber: z.bigint(),
    semester: z.number().int(),
})

export const CreateRegistrationSchema = z.object({
    eventId: z.string().cuid(),
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    registrationNumber: z.string()
        .min(1, 'Registration number is required')
        .regex(/^\d+$/, 'Registration number must contain only digits'),
    semester: z.number().int().min(1, 'Semester must be between 1-8').max(8, 'Semester must be between 1-8'),
})

export const UpdateRegistrationStatusSchema = z.object({
    id: z.string().cuid(),
    status: RegistrationStatusEnum,
})

export const CancelRegistrationSchema = z.object({
    eventId: z.string().cuid(),
})

export const GetUserRegistrationsSchema = z.object({
    userId: z.string().cuid(),
})


export const FeedbackSchema = z.object({
    id: z.string().cuid(),
    userId: z.string().cuid(),
    eventId: z.string().cuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional().nullable(),
    createdAt: z.date(),
})

export const CreateFeedbackSchema = z.object({
    eventId: z.string().cuid(),
    rating: z.number().int().min(1, 'Rating must be between 1-5').max(5, 'Rating must be between 1-5'),
    comment: z.string().optional(),
})

export const UpdateFeedbackSchema = z.object({
    id: z.string().cuid(),
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().optional(),
})

export const GetEventFeedbackSchema = z.object({
    eventId: z.string().cuid(),
})



export const NotificationSchema = z.object({
    id: z.string().cuid(),
    userId: z.string().cuid(),
    eventId: z.string().cuid().optional().nullable(),
    title: z.string().min(1),
    message: z.string().min(1),
    type: NotificationTypeEnum,
    read: z.boolean(),
    createdAt: z.date(),
})

export const CreateNotificationSchema = z.object({
    userId: z.string().cuid(),
    eventId: z.string().cuid().optional().nullable(),
    title: z.string().min(1),
    message: z.string().min(1),
    type: NotificationTypeEnum,
})

export const BulkCreateNotificationSchema = z.object({
    userIds: z.array(z.string().cuid()),
    eventId: z.string().cuid().optional().nullable(),
    title: z.string().min(1),
    message: z.string().min(1),
    type: NotificationTypeEnum,
})

export const MarkNotificationReadSchema = z.object({
    id: z.string().cuid(),
})

export const MarkAllNotificationsReadSchema = z.object({
    userId: z.string().cuid(),
})

export const GetUserNotificationsSchema = z.object({
    userId: z.string().cuid().optional(),
    limit: z.number().int().positive().optional().default(10),
    offset: z.number().int().nonnegative().optional().default(0),
})

// ============================================================================
// EVENT UPDATE SCHEMAS
// ============================================================================

export const EventUpdateSchema = z.object({
    id: z.string().cuid(),
    eventId: z.string().cuid(),
    content: z.string().min(1),
    senderId: z.string().cuid(),
    sentAt: z.date(),
})

export const CreateEventUpdateSchema = z.object({
    eventId: z.string().cuid(),
    content: z.string().min(1, 'Update content is required'),
})

export const GetEventUpdatesSchema = z.object({
    eventId: z.string().cuid(),
    limit: z.number().int().positive().optional().default(50),
})



export const WinnerSchema = z.object({
    id: z.string().cuid(),
    userId: z.string().cuid(),
    eventId: z.string().cuid(),
    position: WinnerPositionEnum,
    declaredAt: z.date(),
    declaredByUserId: z.string().cuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const DeclareWinnerSchema = z.object({
    userId: z.string().cuid(),
    eventId: z.string().cuid(),
    position: WinnerPositionEnum,
})

export const DeclareMultipleWinnersSchema = z.object({
    eventId: z.string().cuid(),
    winners: z.array(z.object({
        userId: z.string().cuid(),
        position: WinnerPositionEnum,
    })).min(1, 'At least one winner is required'),
})

export const GetEventWinnersSchema = z.object({
    eventId: z.string().cuid(),
})

export const GetUserWinsSchema = z.object({
    userId: z.string().cuid().optional(),
})

export const GetEventRegistrationsForWinnersSchema = z.object({
    eventId: z.string().cuid(),
})



export const CertificateSchema = z.object({
    id: z.string().cuid(),
    winnerId: z.string().cuid(),
    certificateUrl: z.string().url().optional().nullable(),
    certificateData: z.record(z.string(), z.any()).optional().nullable(),
    issuedAt: z.date(),
    emailSent: z.boolean(),
    emailSentAt: z.date().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const CertificateDataSchema = z.object({
    userName: z.string().min(1),
    eventTitle: z.string().min(1),
    position: WinnerPositionEnum,
    eventDate: z.string().min(1),
    organizerName: z.string().min(1),
    collegeName: z.string().optional(),
    registrationNumber: z.string().optional(),
    semester: z.number().int().optional(),
})

export const GenerateCertificateSchema = z.object({
    winnerId: z.string().cuid(),
    certificateData: CertificateDataSchema.optional(),
})

export const SendCertificateEmailSchema = z.object({
    certificateId: z.string().cuid(),
})

export const RegenerateCertificateSchema = z.object({
    certificateId: z.string().cuid(),
})

export const UpdateCertificateSchema = z.object({
    id: z.string().cuid(),
    certificateUrl: z.string().url().optional(),
    certificateData: CertificateDataSchema.optional(),
    emailSent: z.boolean().optional(),
})

export const GetEventCertificatesSchema = z.object({
    eventId: z.string().cuid(),
})

export const GetUserCertificatesSchema = z.object({
    userId: z.string().cuid().optional(),
})



export const ClerkWebhookSchema = z.object({
    type: z.string(),
    data: z.object({
        id: z.string(),
        email_addresses: z.array(z.object({
            email_address: z.string().email(),
        })),
        first_name: z.string().nullable(),
        last_name: z.string().nullable(),
        image_url: z.string().url().nullable(),
    }),
})


export const SocketAuthenticateSchema = z.object({
    userId: z.string(),
})

export const SocketJoinEventSchema = z.object({
    eventId: z.string().cuid(),
})

export const SocketLeaveEventSchema = z.object({
    eventId: z.string().cuid(),
})

export const SocketSendEventUpdateSchema = z.object({
    eventId: z.string().cuid(),
    message: z.string().min(1),
    userId: z.string(),
})

export const SocketEventUpdatePayloadSchema = z.object({
    id: z.string().cuid(),
    content: z.string(),
    createdBy: z.string(),
    sentAt: z.date(),
})

export const EventEmailDataSchema = z.object({
    event: z.object({
        title: z.string(),
        description: z.string(),
        location: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        price: z.number(),
        category: z.string(),
    }),
    user: z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
    }),
})

export const EventUpdateEmailSchema = EventEmailDataSchema.extend({
    updateType: z.enum(['created', 'updated', 'cancelled']),
})

export const CertificateEmailDataSchema = z.object({
    event: z.object({
        title: z.string(),
        description: z.string(),
        startDate: z.date(),
    }),
    user: z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
    }),
    certificateHtml: z.string(),
    position: z.string(),
})



export const AnalyticsDateRangeSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
})

export const EventAnalyticsSchema = z.object({
    eventId: z.string().cuid(),
    dateRange: AnalyticsDateRangeSchema.optional(),
})



export const PaginationSchema = z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().max(100).optional().default(10),
})

export const SortSchema = z.object({
    sortBy: z.string().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

export const SearchSchema = z.object({
    search: z.string().optional(),
})


export type Role = z.infer<typeof RoleEnum>
export type Category = z.infer<typeof CategoryEnum>
export type EventStatus = z.infer<typeof EventStatusEnum>
export type RegistrationStatus = z.infer<typeof RegistrationStatusEnum>
export type NotificationType = z.infer<typeof NotificationTypeEnum>
export type WinnerPosition = z.infer<typeof WinnerPositionEnum>

export type User = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>

export type Event = z.infer<typeof EventSchema>
export type CreateEvent = z.infer<typeof CreateEventSchema>
export type UpdateEvent = z.infer<typeof UpdateEventSchema>
export type DeleteEvent = z.infer<typeof DeleteEventSchema>
export type EventFilter = z.infer<typeof EventFilterSchema>

export type Registration = z.infer<typeof RegistrationSchema>
export type CreateRegistration = z.infer<typeof CreateRegistrationSchema>
export type UpdateRegistrationStatus = z.infer<typeof UpdateRegistrationStatusSchema>
export type CancelRegistration = z.infer<typeof CancelRegistrationSchema>
export type GetUserRegistrations = z.infer<typeof GetUserRegistrationsSchema>

export type Feedback = z.infer<typeof FeedbackSchema>
export type CreateFeedback = z.infer<typeof CreateFeedbackSchema>
export type UpdateFeedback = z.infer<typeof UpdateFeedbackSchema>
export type GetEventFeedback = z.infer<typeof GetEventFeedbackSchema>

export type Notification = z.infer<typeof NotificationSchema>
export type CreateNotification = z.infer<typeof CreateNotificationSchema>
export type BulkCreateNotification = z.infer<typeof BulkCreateNotificationSchema>
export type MarkNotificationRead = z.infer<typeof MarkNotificationReadSchema>
export type MarkAllNotificationsRead = z.infer<typeof MarkAllNotificationsReadSchema>
export type GetUserNotifications = z.infer<typeof GetUserNotificationsSchema>

export type EventUpdate = z.infer<typeof EventUpdateSchema>
export type CreateEventUpdate = z.infer<typeof CreateEventUpdateSchema>
export type GetEventUpdates = z.infer<typeof GetEventUpdatesSchema>

export type Winner = z.infer<typeof WinnerSchema>
export type DeclareWinner = z.infer<typeof DeclareWinnerSchema>
export type DeclareMultipleWinners = z.infer<typeof DeclareMultipleWinnersSchema>
export type GetEventWinners = z.infer<typeof GetEventWinnersSchema>
export type GetUserWins = z.infer<typeof GetUserWinsSchema>
export type GetEventRegistrationsForWinners = z.infer<typeof GetEventRegistrationsForWinnersSchema>

export type Certificate = z.infer<typeof CertificateSchema>
export type CertificateData = z.infer<typeof CertificateDataSchema>
export type GenerateCertificate = z.infer<typeof GenerateCertificateSchema>
export type SendCertificateEmail = z.infer<typeof SendCertificateEmailSchema>
export type RegenerateCertificate = z.infer<typeof RegenerateCertificateSchema>
export type UpdateCertificate = z.infer<typeof UpdateCertificateSchema>
export type GetEventCertificates = z.infer<typeof GetEventCertificatesSchema>
export type GetUserCertificates = z.infer<typeof GetUserCertificatesSchema>

export type ClerkWebhook = z.infer<typeof ClerkWebhookSchema>

export type SocketAuthenticate = z.infer<typeof SocketAuthenticateSchema>
export type SocketJoinEvent = z.infer<typeof SocketJoinEventSchema>
export type SocketLeaveEvent = z.infer<typeof SocketLeaveEventSchema>
export type SocketSendEventUpdate = z.infer<typeof SocketSendEventUpdateSchema>
export type SocketEventUpdatePayload = z.infer<typeof SocketEventUpdatePayloadSchema>

export type EventEmailData = z.infer<typeof EventEmailDataSchema>
export type EventUpdateEmail = z.infer<typeof EventUpdateEmailSchema>
export type CertificateEmailData = z.infer<typeof CertificateEmailDataSchema>

export type AnalyticsDateRange = z.infer<typeof AnalyticsDateRangeSchema>
export type EventAnalytics = z.infer<typeof EventAnalyticsSchema>

export type Pagination = z.infer<typeof PaginationSchema>
export type Sort = z.infer<typeof SortSchema>
export type Search = z.infer<typeof SearchSchema>

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export type ApiResponse<T = any> = {
    success: boolean
    data?: T
    message?: string
    errors?: Record<string, string[]>
}

export type PaginatedResponse<T> = {
    success: boolean
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export type ApiError = {
    success: false
    message: string
    errors?: Record<string, string[]>
}

// ============================================================================
// EXTENDED TYPES (with relations)
// ============================================================================

export type UserWithRelations = User & {
    _count?: {
        registrations: number
        feedback: number
        winners: number
        eventsCreated: number
        notifications: number
    }
    registrations?: RegistrationWithRelations[]
    winners?: WinnerWithRelations[]
    eventsCreated?: EventWithRelations[]
    notifications?: Notification[]
}

export type EventWithRelations = Event & {
    createdBy: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>
    _count?: {
        registrations: number
        feedback: number
        winners: number
        updates: number
    }
    registrations?: RegistrationWithRelations[]
    feedback?: Feedback[]
    winners?: WinnerWithRelations[]
    updates?: EventUpdate[]
}

export type RegistrationWithRelations = Registration & {
    user: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'imageUrl'>
    event: Pick<Event, 'id' | 'title' | 'startDate' | 'endDate' | 'location' | 'status' | 'category'>
}

export type WinnerWithRelations = Winner & {
    user: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'imageUrl'>
    event: Pick<Event, 'id' | 'title' | 'category' | 'startDate' | 'endDate'>
    declaredBy: Pick<User, 'id' | 'firstName' | 'lastName'>
    certificate?: Certificate
}

export type CertificateWithRelations = Certificate & {
    winner: WinnerWithRelations
}

export type NotificationWithRelations = Notification & {
    event?: Pick<Event, 'id' | 'title' | 'startDate' | 'status'>
}

export type EventUpdateWithRelations = EventUpdate & {
    sentBy: Pick<User, 'firstName' | 'lastName' | 'imageUrl'>
    event: Pick<Event, 'id' | 'title'>
}

export type FeedbackWithRelations = Feedback & {
    user: Pick<User, 'id' | 'firstName' | 'lastName' | 'imageUrl'>
    event: Pick<Event, 'id' | 'title'>
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export type DashboardStats = {
    totalEvents: number
    upcomingEvents: number
    totalRegistrations: number
    totalUsers: number
    recentEvents: Array<{
        id: string
        title: string
        startDate: Date
        category: Category
        _count: {
            registrations: number
        }
    }>
    topEvents: Array<{
        id: string
        title: string
        startDate: Date
        _count: {
            registrations: number
        }
    }>
}

export type AdminAnalytics = {
    totalUsers: number
    totalEvents: number
    totalRegistrations: number
    totalWinners: number
    totalCertificates: number
    certificatesEmailed: number
    eventsByCategory: Record<Category, number>
    eventsByStatus: Record<EventStatus, number>
    registrationsByStatus: Record<RegistrationStatus, number>
    recentActivity: Array<{
        type: 'event' | 'registration' | 'winner' | 'certificate'
        description: string
        timestamp: Date
    }>
}

// ============================================================================
// FORM DATA TYPES (for client components)
// ============================================================================

export type EventFormData = Omit<CreateEvent, 'status'>
export type RegistrationFormData = Omit<CreateRegistration, 'eventId'>
export type FeedbackFormData = Omit<CreateFeedback, 'eventId'>
export type WinnerFormData = DeclareWinner
export type EventUpdateFormData = CreateEventUpdate

// ============================================================================
// SERIALIZED TYPES (for BigInt handling)
// ============================================================================

export type SerializedRegistration = Omit<Registration, 'registrationNumber'> & {
    registrationNumber: string
}

export type SerializedRegistrationWithRelations = Omit<RegistrationWithRelations, 'registrationNumber'> & {
    registrationNumber: string
}

// ============================================================================
// WINNER DECLARATION TYPES
// ============================================================================

export type RegistrationWithWinner = RegistrationWithRelations & {
    isWinner: boolean
    winnerData?: WinnerWithRelations
    certificateIssued?: boolean
}

export type WinnerSelection = {
    userId: string
    position: WinnerPosition
}

export type WinnerDeclarationProps = {
    eventId: string
    eventTitle: string
}

export type WinnerDeclarationResult = {
    userId: string
    position: WinnerPosition
    status: 'success' | 'error'
    error?: string
    certificateId?: string
    winnerId?: string
}
