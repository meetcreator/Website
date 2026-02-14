import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Zap, Server, Database, Network } from "lucide-react";

export default function RecommendationsPage() {
    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Security Recommendations</h2>
                <p className="text-slate-400">Actionable advice based on industry standards (CIS, SOC2, ISO).</p>
            </div>

            <div className="grid gap-6">
                <Card className="border-l-4 border-l-red-500">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-red-500" />
                                Unencrypted S3 Buckets
                            </CardTitle>
                            <Badge variant="destructive">Critical</Badge>
                        </div>
                        <CardDescription className="text-slate-400">Standard: CIS AWS Foundations 2.1.1</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm">
                            Detected 3 buckets without Default Encryption enabled. This allows data to be stored as plaintext on disk.
                        </p>
                        <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-300 border border-slate-800">
                            <p># Remediation: Add server_side_encryption_configuration</p>
                            <p className="text-purple-400">resource "aws_s3_bucket_server_side_encryption_configuration" "example" {"{ ... }"}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Network className="h-5 w-5 text-amber-500" />
                                Open Inbound Port 22
                            </CardTitle>
                            <Badge className="bg-amber-500 hover:bg-amber-600">High</Badge>
                        </div>
                        <CardDescription className="text-slate-400">Standard: CIS AWS Foundations 4.1</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm">
                            Security group allowing SSH access (Port 22) from <span className="text-red-400">0.0.0.0/0</span>. This exposes your instance to brute-force attacks.
                        </p>
                        <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-300 border border-slate-800">
                            <p># Remediation: Restrict ingress to specific IP ranges</p>
                            <p className="text-purple-400">cidr_blocks = ["YOUR_IP/32"]</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-purple-500" />
                                MFA Not Required for IAM
                            </CardTitle>
                            <Badge className="bg-purple-500 hover:bg-purple-600">Medium</Badge>
                        </div>
                        <CardDescription className="text-slate-400">Standard: SOC2 CC6.1</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm">
                            IAM users are not explicitly required to have Multi-Factor Authentication (MFA) enabled via policy.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
