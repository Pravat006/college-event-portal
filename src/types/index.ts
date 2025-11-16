import { User, EventWithRelations } from "@/lib/schemas";

export interface EventRegistrationFormProps {
    eventId: string;
    onSuccess?: () => void;
    status: string;
    disable: boolean;
    registrationStatus?: string;
}

export interface HeaderProps {
    user?: {
        firstName: string;
        role: string;
    } | null;
}

export interface NavbarProps {
    user?: {
        firstName: string;
        lastName: string;
        role: string;
        imageUrl?: string | null;
    } | null;
}

export interface EventsGridProps {
    events: EventWithRelations[];
    user: { id: string; role: string };
}

export interface UpcomingEventsProps {
    events: EventWithRelations[];
}

export interface RecentEventsProps {
    events: EventWithRelations[];
}

export interface EventRegistrationButtonProps {
    event: EventWithRelations;
    user: User | null;
    isRegistered?: boolean;
    isFull: boolean;
}

export interface DashboardStatsProps {
    totalEvents: number;
    totalRegistrations: number;
    feedbackCount: number;
    userRole: string;
}

export interface DeleteEventButtonProps {
    eventId: string;
    eventTitle: string;
}

export interface UnregisterEventButtonProps {
    eventId: string;
    eventTitle: string;
    onCancel: (eventId: string) => void;
    disabled?: boolean;
}

export interface SendEventUpdateProps {
    event: {
        id: string;
        title: string;
        status: string;
        _count: { registrations: number };
    };
}

export type TopEvent = {
    id: string;
    title: string;
    startDate: Date;
    _count: {
        registrations: number;
    };
};

export interface EventChartProps {
    events: TopEvent[];
}

export interface CertificateManagementProps {
    eventId: string;
    eventTitle: string;
}

export interface PageProps {
    params: Promise<{ id: string }>;
}

export interface EventRegistrationPageItem {
    id: string;
    status: string;
    registeredAt: string;
    registrationNumber: string;
    fullName: string;
    semester: number;
    event: {
        id: string;
        title: string;
        description?: string;
        imageUrl?: string;
        startDate: string;
        endDate: string;
        location: string;
        status: string;
    };
}