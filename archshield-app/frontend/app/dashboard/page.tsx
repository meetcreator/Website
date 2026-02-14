import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Clock, ShieldCheck, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-8 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                    <p className="text-slate-400">Manage your infrastructure analysis projects.</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Project
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Projects</CardTitle>
                        <Clock className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Analyses</CardTitle>
                        <Search className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">48</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Clean Resources</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">342</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Vulnerabilities</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Projects</CardTitle>
                        <CardDescription className="text-slate-400">You have analyzed 5 projects this week.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Mock Project List */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Cloud-Arch-Project-{i}</p>
                                        <p className="text-sm text-slate-500">AWS • Last analyzed 2 days ago</p>
                                    </div>
                                    <div className="ml-auto font-medium text-purple-400">Score: 92/100</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Findings</CardTitle>
                        <CardDescription className="text-slate-400">Security recommendations for your infra.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-2 text-sm text-amber-400 bg-amber-400/10 p-3 rounded-lg border border-amber-400/20">
                                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                <p>S3 Buckets should have public access blocked by default.</p>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-amber-400 bg-amber-400/10 p-3 rounded-lg border border-amber-400/20">
                                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                <p>IAM Policies should follow the principle of least privilege.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
