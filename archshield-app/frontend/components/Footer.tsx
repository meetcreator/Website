
import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-slate-800 py-12 px-6 bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-6 h-6 text-blue-400" />
                            <span className="text-xl font-bold text-white">ArchShield</span>
                        </div>
                        <p className="text-slate-400 text-sm">
                            AI-powered cloud architecture analysis and optimization platform.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="/dashboard/help" className="hover:text-white transition-colors">Documentation</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
                    © 2026 ArchShield. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
