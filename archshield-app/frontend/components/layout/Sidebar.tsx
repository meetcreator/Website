"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Shield,
    LayoutDashboard,
    Search,
    LayoutTemplate,
    History,
    CheckCircle2,
    Settings,
    LogOut
} from "lucide-react";

const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analyze", href: "/dashboard/analyze", icon: Search },
    { name: "Designer", href: "/dashboard/designer", icon: LayoutTemplate },
    { name: "History", href: "/dashboard/history", icon: History },
    { name: "Recommendations", href: "/dashboard/recommendations", icon: CheckCircle2 },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-screen w-64 border-r border-slate-800 bg-slate-950/50">
            <div className="p-6">
                <Link className="flex items-center gap-2" href="/">
                    <Shield className="h-6 w-6 text-purple-500" />
                    <span className="font-bold text-xl tracking-tight text-white">ArchShield</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            pathname === item.href
                                ? "bg-purple-600/10 text-purple-400 border border-purple-500/20"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex flex-col gap-2">
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                    <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-pink-400 hover:bg-pink-400/5 transition-colors">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
