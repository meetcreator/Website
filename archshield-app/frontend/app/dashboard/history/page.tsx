import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowRight, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const mockHistory = [
    { id: 1, name: "Production-VPC-Main", date: "2026-02-14", score: 92, status: "Secure", issues: 2 },
    { id: 2, name: "Staging-Database-Cluster", date: "2026-02-12", score: 74, status: "Warning", issues: 8 },
    { id: 3, name: "Public-S3-Exfiltration-Test", date: "2026-02-10", score: 45, status: "Critical", issues: 14 },
];

export default function HistoryPage() {
    return (
        <div className="p-8 space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analysis History</h2>
                    <p className="text-slate-400">Review and audit your past infrastructure security scans.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                            placeholder="Search history..."
                            className="pl-9 h-10 rounded-md border border-slate-800 bg-slate-950 w-[250px] text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                    </div>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-slate-900/50 border-b border-slate-800 text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Project Name</th>
                                    <th className="px-6 py-4 font-medium">Date Analyzed</th>
                                    <th className="px-6 py-4 font-medium">Security Score</th>
                                    <th className="px-6 py-4 font-medium">Issue Count</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {mockHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-100">{item.name}</td>
                                        <td className="px-6 py-4 text-slate-400">{item.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full",
                                                            item.score > 80 ? "bg-green-500" : item.score > 60 ? "bg-amber-500" : "bg-red-500"
                                                        )}
                                                        style={{ width: `${item.score}%` }}
                                                    />
                                                </div>
                                                <span className="font-semibold">{item.score}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">{item.issues} detected</td>
                                        <td className="px-6 py-4">
                                            {item.status === "Secure" && <span className="flex items-center gap-1.5 text-green-500"><CheckCircle2 className="h-3.5 w-3.5" /> Secure</span>}
                                            {item.status === "Warning" && <span className="flex items-center gap-1.5 text-amber-500"><AlertTriangle className="h-3.5 w-3.5" /> Warning</span>}
                                            {item.status === "Critical" && <span className="flex items-center gap-1.5 text-red-500"><AlertCircle className="h-3.5 w-3.5" /> Critical</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm">
                                                Details
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
