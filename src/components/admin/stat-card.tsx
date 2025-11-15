import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    gradient?: string;
}

export const StatCard = ({ title, value, icon: Icon, trend, gradient }: StatCardProps) => {
    return (
        <Card className="relative overflow-hidden border-border/50 backdrop-blur-sm transition-all hover:shadow-lg hover:scale-[1.02]">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold tracking-tight">{value}</p>
                        {trend && (
                            <p className="text-xs text-muted-foreground">{trend}</p>
                        )}
                    </div>
                    <div
                        className="rounded-lg p-3"
                        style={{
                            background: gradient || "hsl(var(--primary) / 0.1)",
                        }}
                    >
                        <Icon className="h-6 w-6" style={{ color: "hsl(var(--primary))" }} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
