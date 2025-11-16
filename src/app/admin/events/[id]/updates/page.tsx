import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Users, Trophy, Award } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WinnerDeclaration from "@/components/admin/winner-declaration";
import CertificateManagement from "@/components/certificate/certificate-management";

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EventManagementPage({ params }: PageProps) {
    try {
        await requireAdmin();
        const { id } = await params;

        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        registrations: true,
                        winners: true
                    }
                }
            }
        });

        if (!event) {
            redirect("/admin/events");
        }

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
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/events">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Event Management</h1>
                        <p className="text-muted-foreground mt-1">Manage winners and certificates</p>
                    </div>
                </div>

                {/* Event Overview Card */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1">
                                <CardTitle className="text-2xl">{event.title}</CardTitle>
                                <CardDescription className="mt-2 line-clamp-2">
                                    {event.description}
                                </CardDescription>
                            </div>
                            <Badge variant={getStatusBadge(event.status)} className="text-sm">
                                {event.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Date</p>
                                    <p className="font-medium">
                                        {new Date(event.startDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Location</p>
                                    <p className="font-medium truncate">{event.location}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Registrations</p>
                                    <p className="font-medium">
                                        {event._count.registrations} / {event.capacity}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                <Trophy className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Winners</p>
                                    <p className="font-medium">{event._count.winners}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs for Winner Declaration and Certificate Management */}
                <Tabs defaultValue="winners" className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="winners" className="flex items-center gap-2">
                            <Trophy className="h-4 w-4" />
                            Winner Declaration
                        </TabsTrigger>
                        <TabsTrigger value="certificates" className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Certificates
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="winners" className="space-y-4">
                        <WinnerDeclaration eventId={event.id} eventTitle={event.title} />
                    </TabsContent>

                    <TabsContent value="certificates" className="space-y-4">
                        <CertificateManagement eventId={event.id} eventTitle={event.title} />
                    </TabsContent>
                </Tabs>
            </div>
        );
    } catch {
        redirect("/admin/events");
    }
}
