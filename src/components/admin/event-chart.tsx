"use client"
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend,
    ComposedChart,
    Line,
} from "recharts";
import { format } from "date-fns";
import { EventChartProps } from "@/types";

const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

type ChartDataItem = {
    name: string;
    registrations: number;
    date: string;
    trend: number;
};

type TooltipPayload = {
    payload: ChartDataItem;
    value: number;
};

type CustomTooltipProps = {
    active?: boolean;
    payload?: TooltipPayload[];
};

export const EventChart = ({ events }: EventChartProps) => {
    const chartData = events.map((event, index) => ({
        name: event.title,
        registrations: event._count.registrations,
        date: format(event.startDate, "MMM dd"),
        trend: index > 0 ? events[index - 1]._count.registrations : event._count.registrations,
    }));

    const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border border-border bg-card p-4 shadow-lg">
                    <p className="font-semibold text-card-foreground">{payload[0].payload.name}</p>
                    <p className="text-sm text-muted-foreground">{payload[0].payload.date}</p>
                    <p className="mt-2 font-bold text-primary">
                        {payload[0].value} registrations
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="w-full border-border/50 shadow-xl">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-bold bg-linear-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                            Event Performance
                        </CardTitle>
                        <CardDescription className="text-base">
                            Registration trends across top performing events
                        </CardDescription>
                    </div>
                    <div className="rounded-full bg-primary/10 px-4 py-2">
                        <span className="text-sm font-semibold text-primary">Live Data</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={450}>
                    <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                        <defs>
                            {COLORS.map((color, index) => (
                                <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                                    <stop offset="100%" stopColor={color} stopOpacity={0.2} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                        <XAxis
                            dataKey="name"
                            angle={-35}
                            textAnchor="end"
                            height={120}
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13, fontWeight: 500 }}
                            stroke="hsl(var(--border))"
                        />
                        <YAxis
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13 }}
                            stroke="hsl(var(--border))"
                            label={{
                                value: "Registrations",
                                angle: -90,
                                position: "insideLeft",
                                style: { fill: "hsl(var(--muted-foreground))", fontSize: 14 },
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.1)" }} />
                        <Legend
                            wrapperStyle={{ paddingTop: "20px" }}
                            iconType="circle"
                        />
                        <Line
                            type="monotone"
                            dataKey="trend"
                            stroke="hsl(var(--chart-2))"
                            strokeWidth={2}
                            dot={false}
                            name="Trend"
                            strokeDasharray="5 5"
                        />
                        <Bar dataKey="registrations" radius={[12, 12, 0, 0]} name="Registrations">
                            {chartData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={`url(#gradient-${index % COLORS.length})`}
                                />
                            ))}
                        </Bar>
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
