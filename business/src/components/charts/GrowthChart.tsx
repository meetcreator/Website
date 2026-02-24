"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

interface ChartProps {
    data: any[];
    type: "line" | "area";
    color?: string;
}

export default function GrowthChart({ data, type, color = "#3b82f6" }: ChartProps) {
    if (type === "area") {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                        itemStyle={{ color: "#f8fafc" }}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke={color}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        strokeWidth={3}
                    />
                </AreaChart>
            </ResponsiveContainer>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                />
                <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                    itemStyle={{ color: "#f8fafc" }}
                />
                <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={color}
                    strokeWidth={3}
                    dot={{ r: 4, fill: color, strokeWidth: 2, stroke: "#0f172a" }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
