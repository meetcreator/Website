import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Save, LayoutTemplate, Database, Server, Globe, Shield } from "lucide-react";

export default function DesignerPage() {
    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="border-b border-slate-800 p-4 bg-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-purple-600/10 text-purple-400 rounded-md border border-purple-500/20 text-sm font-medium">
                        <LayoutTemplate className="h-4 w-4" />
                        VPC-Web-App-Architecture
                    </div>
                    <p className="text-xs text-slate-500">Last saved: 3 minutes ago</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Play className="mr-2 h-4 w-4" />
                        Run Security Check
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Components */}
                <div className="w-64 border-r border-slate-800 bg-slate-950 p-4 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cloud Components</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col items-center justify-center p-3 border border-slate-800 rounded-lg hover:border-purple-500/50 hover:bg-purple-500/5 cursor-grab transition-all group">
                                <Server className="h-6 w-6 text-slate-400 group-hover:text-purple-400 mb-2" />
                                <span className="text-[10px] text-slate-400 group-hover:text-slate-200">Compute</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 border border-slate-800 rounded-lg hover:border-purple-500/50 hover:bg-purple-500/5 cursor-grab transition-all group">
                                <Database className="h-6 w-6 text-slate-400 group-hover:text-purple-400 mb-2" />
                                <span className="text-[10px] text-slate-400 group-hover:text-slate-200">Database</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 border border-slate-800 rounded-lg hover:border-purple-500/50 hover:bg-purple-500/5 cursor-grab transition-all group">
                                <Globe className="h-6 w-6 text-slate-400 group-hover:text-purple-400 mb-2" />
                                <span className="text-[10px] text-slate-400 group-hover:text-slate-200">Network</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 border border-slate-800 rounded-lg hover:border-purple-500/50 hover:bg-purple-500/5 cursor-grab transition-all group">
                                <Shield className="h-6 w-6 text-slate-400 group-hover:text-purple-400 mb-2" />
                                <span className="text-[10px] text-slate-400 group-hover:text-slate-200">Security</span>
                            </div>
                        </div>
                    </div>

                    <Card className="bg-purple-500/5 border-purple-500/20">
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm font-semibold">Designer Tip</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-xs text-slate-400 leading-relaxed">
                            Drag components onto the canvas to map your architecture. Connections will be automatically analyzed for misconfigurations.
                        </CardContent>
                    </Card>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 bg-slate-900/50 relative">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center opacity-20">
                            <LayoutTemplate className="h-24 w-24 mb-4" />
                            <p className="text-xl font-bold">Interactive Design Canvas</p>
                            <p className="text-sm">Designer components will render here in a production environment</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
