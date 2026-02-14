import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileCode, CheckCircle2, AlertCircle } from "lucide-react";

export default function AnalyzePage() {
    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Vulnerability Analysis</h2>
                <p className="text-slate-400">Upload your Terraform files to detect security risks and compliance issues.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Upload Card */}
                <Card className="lg:col-span-2 border-dashed border-2 border-slate-800 bg-slate-950 hover:bg-slate-900/50 transition-colors cursor-pointer group">
                    <CardContent className="flex flex-col items-center justify-center h-[300px] text-center pt-6">
                        <div className="p-4 bg-purple-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="h-10 w-10 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Drop your Terraform files here</h3>
                        <p className="text-slate-400 max-w-[300px] mb-6">
                            Support for single .tf files or complete project directories (zip uploads coming soon).
                        </p>
                        <Button variant="secondary">Browse Files</Button>
                    </CardContent>
                </Card>

                {/* Rules Summary */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Security Rules</CardTitle>
                        <CardDescription className="text-slate-400">ArchShield scans for over 120 compliance standards.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">AWS Foundations Benchmark</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">CIS Microsoft Azure</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">GCP Security Best Practices</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">SOC2 Compliance Rules</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">ISO 27001 Controls</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="link" className="p-0 h-auto">View full ruleset</Button>
                    </CardFooter>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Findings</CardTitle>
                    <CardDescription className="text-slate-400">Analysis results from your last upload.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-slate-500">
                        <FileCode className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No results yet. Start by uploading a configuration file.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
