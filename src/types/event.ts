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
