export interface EventEmail {
    event: {
        title: string
        description: string
        location: string
        startDate: Date
        endDate: Date
        price: number
        category: string
    }
    user: {
        firstName: string
        lastName: string
        email: string
    }
}
export type TopEvent = {
    id: string;
    title: string;
    startDate: Date;
    _count: {
        registrations: number;
    };
};
export type WinnerPosition = 'FIRST' | 'SECOND' | 'THIRD' | 'PARTICIPATION'

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