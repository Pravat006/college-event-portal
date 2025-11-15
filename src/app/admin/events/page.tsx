import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DeleteEventButton from "@/components/event/delete-event-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus, Calendar, Users } from "lucide-react";
import CreateEventDialog from "@/components/event/create-event-form";

export default async function AdminEventsPage() {
    try {
        await requireAdmin();

        const events = await prisma.event.findMany({
            include: {
                _count: { select: { registrations: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        const getStatusBadge = (status: string) => {
            const variants = {
                PUBLISHED: 'default',
                DRAFT: 'secondary',
                CANCELLED: 'destructive',
                COMPLETED: 'outline'
            } as const;

            return variants[status as keyof typeof variants] || 'default';
        };

        return (
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Event Management</h1>
                        <p className="text-muted-foreground mt-1">Manage and monitor all your events</p>
                    </div>
                    <CreateEventDialog />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Events</CardTitle>
                        <CardDescription>
                            {events.length} {events.length === 1 ? 'event' : 'events'} total
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {events.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-semibold">No events found</h3>
                                <p className="text-muted-foreground mt-2">
                                    Create your first event to get started.
                                </p>
                                <CreateEventDialog />
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Event Name</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Registrations</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {events.map(event => (
                                            <TableRow key={event.id}>
                                                <TableCell className="font-medium">
                                                    {event.title}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(event.startDate).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <span>{event._count.registrations}</span>
                                                        <span className="text-muted-foreground">
                                                            / {event.capacity}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusBadge(event.status)}>
                                                        {event.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button asChild variant="ghost" size="sm">
                                                            <Link href={`/admin/events/${event.id}/manage`}>
                                                                Manage
                                                            </Link>
                                                        </Button>
                                                        <DeleteEventButton
                                                            eventId={event.id}
                                                            eventTitle={event.title}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    } catch {
        redirect("/");
    }
}
