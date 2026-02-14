import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Search, LayoutTemplate } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <header className="px-4 lg:px-6 h-16 flex items-center border-b border-slate-800 sticky top-0 bg-slate-950/80 backdrop-blur-sm z-50">
                <Link className="flex items-center justify-center gap-2" href="/">
                    <Shield className="h-6 w-6 text-purple-500" />
                    <span className="font-bold text-xl tracking-tight">ArchShield</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#features">
                        Features
                    </Link>
                    <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="/login">
                        Sign In
                    </Link>
                    <Button variant="default" size="sm" asChild>
                        <Link href="/signup">Get Started</Link>
                    </Button>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 overflow-hidden">
                    <div className="container mx-auto">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-7xl">
                                    Secure Your Cloud <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                                        Before Deployment.
                                    </span>
                                </h1>
                                <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl">
                                    The enterprise-grade IaC security analyzer. Detect vulnerabilities in your Terraform configurations in milliseconds.
                                </p>
                            </div>
                            <div className="space-x-4 pt-4">
                                <Button size="lg" className="rounded-full px-8 h-12 text-lg">
                                    Start Free Analysis
                                </Button>
                                <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-lg">
                                    View Demo
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-slate-900/50">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid gap-12 lg:grid-cols-3">
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="p-4 bg-purple-500/10 rounded-2xl">
                                    <Zap className="h-8 w-8 text-purple-500" />
                                </div>
                                <h3 className="text-xl font-bold">Ultra-Fast Analysis</h3>
                                <p className="text-slate-400">
                                    Static analysis of your HCL files in under 0.5s. Get instant feedback on security risks.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="p-4 bg-purple-500/10 rounded-2xl">
                                    <Shield className="h-8 w-8 text-purple-500" />
                                </div>
                                <h3 className="text-xl font-bold">120+ Security Rules</h3>
                                <p className="text-slate-400">
                                    Comprehensive scanning for open ports, unencrypted buckets, and IAM privilege escalations.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="p-4 bg-purple-500/10 rounded-2xl">
                                    <LayoutTemplate className="h-8 w-8 text-purple-500" />
                                </div>
                                <h3 className="text-xl font-bold">Architecture Designer</h3>
                                <p className="text-slate-400">
                                    Visual drag-and-drop designer with built-in security validation. Build secure-by-design.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full py-6 px-4 md:px-6 border-t border-slate-800">
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
                    <p>© 2026 ArchShield. All rights reserved.</p>
                    <nav className="flex gap-4 sm:gap-6">
                        <Link className="hover:text-white transition-colors" href="#">Terms</Link>
                        <Link className="hover:text-white transition-colors" href="#">Privacy</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
