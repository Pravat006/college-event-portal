import { requireAdmin } from '@/lib/auth'
import CreateEventForm from '@/components/create-event-form'

export default async function CreateEventPage() {
    await requireAdmin()

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Create Event</h1>
                <p className="text-gray-600 mt-1">Add a new event to the portal</p>
            </div>

            <CreateEventForm />
        </div>
    )
}