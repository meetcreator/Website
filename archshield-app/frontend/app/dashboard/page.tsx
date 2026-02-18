
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="p-8 space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Total Analyzed</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">12</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Security Score</CardTitle>
                        <ShieldIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">85%</div>
                        <p className="text-xs text-muted-foreground">+5% improvement</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Cost Savings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">$1,200</div>
                        <p className="text-xs text-muted-foreground">Est. monthly savings</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Active Projects</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">4</div>
                        <p className="text-xs text-muted-foreground">+1 new project</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Analyses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Mock Recent Activity */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                        <Activity className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none text-white">Project Alpha Architecture</p>
                                        <p className="text-sm text-muted-foreground">AWS • scanned 2 hours ago</p>
                                    </div>
                                    <div className="ml-auto font-medium text-emerald-500">Safe</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <button className="w-full text-left px-4 py-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-medium transition-colors border border-blue-500/20">
                                + New Analysis
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors border border-slate-700">
                                Open Designer
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ShieldIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </svg>
    )
}
