
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Shield className="w-8 h-8 text-blue-400" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        ArchShield
                    </span>
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-slate-300 hover:text-white transition-colors">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">
                        How It Works
                    </Link>
                    <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors">
                        Pricing
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10 hover:text-blue-300">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
