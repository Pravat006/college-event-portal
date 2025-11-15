export interface User {
    id: string
    clerkId: string
    email: string
    firstName: string
    lastName: string
    imageUrl?: string
    role: 'USER' | 'ADMIN'
    createdAt: Date
    updatedAt: Date
    notifications?: Notification[]
    winners?: Winner[]
    eventsCreated?: Event[]
    declaredWinners?: Winner[]
    _count?: {
        registrations: number
        feedback: number
        winners: number
        eventsCreated: number
    }
}


export interface Winner {
    id: string
    userId: string
    eventId: string
    position: WinnerPosition
    declaredAt: Date
    declaredByUserId: string
    createdAt: Date
    updatedAt: Date
    user?: User
    event?: Event
    declaredBy?: User
    certificate?: Certificate
}

export interface Certificate {
    id: string
    winnerId: string
    certificateUrl?: string
    certificateData?: any // JSON data for dynamic certificates
    issuedAt: Date
    emailSent: boolean
    emailSentAt?: Date
    createdAt: Date
    updatedAt: Date
    winner?: Winner
}
// Enum Types
export type Role = 'USER' | 'ADMIN'

export type WinnerPosition =
    | 'FIRST'
    | 'SECOND'
    | 'THIRD'
    | 'PARTICIPATION'

export type EventCategory =
    | 'ACADEMIC'
    | 'CULTURAL'
    | 'SPORTS'
    | 'TECHNICAL'
    | 'SOCIAL'
    | 'WORKSHOP'

export type EventStatus =
    | 'DRAFT'
    | 'PUBLISHED'
    | 'CANCELLED'
    | 'COMPLETED'

export type RegistrationStatus =
    | 'REGISTERED'
    | 'ATTENDED'
    | 'CANCELLED'

export type NotificationType =
    | 'EVENT_CREATED'
    | 'EVENT_UPDATED'
    | 'EVENT_CANCELLED'
    | 'REGISTRATION_CONFIRMED'
    | 'FEEDBACK_REQUEST'

// Form Types
export interface EventFormData {
    title: string
    description: string
    location: string
    startDate: string
    endDate: string
    capacity: number
    price: number
    category: EventCategory
    imageUrl?: string
}

export interface WinnerFormData {
    userId: string
    eventId: string
    position: WinnerPosition
}

export interface CertificateData {
    userName: string
    eventTitle: string
    position: WinnerPosition
    eventDate: string
    organizerName: string
    collegeName?: string
    registrationNumber?: string
    semester?: number
}

export interface Registration {
    id: string
    userId: string
    eventId: string
    status: RegistrationStatus
    registeredAt: Date
    registrationNumber: string
    fullName: string
    semester: number
    createdAt: Date
    user?: User
    event?: Event
}