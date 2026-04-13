"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileEdit,
  BarChart3,
  Settings,
  LogOut,
  Trophy,
  Clock,
  Video
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

const sidebarLinks = [
  { name: "Overview", icon: <LayoutDashboard size={20} />, active: true },
  { name: "Mock Tests", icon: <FileEdit size={20} /> },
  { name: "Results", icon: <BarChart3 size={20} /> },
  { name: "Live Classes", icon: <Video size={20} /> },
  { name: "Rankings", icon: <Trophy size={20} /> },
  { name: "Settings", icon: <Settings size={20} /> },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-border hidden md:flex flex-col">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
              O
            </div>
            <span className="font-bold tracking-tight">GCO OLYMPIAD</span>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => setActiveTab(link.name)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                activeTab === link.name
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              {link.icon}
              {link.name}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-border">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all font-semibold text-sm">
            <LogOut size={20} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-auto">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">Alex Johnson</p>
              <p className="text-xs text-muted-foreground">Class 10 | Math Olympiad</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full border border-border overflow-hidden">
              {/* User Avatar Placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-600" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {activeTab === "Overview" ? (
            <div className="space-y-8">
              {/* Welcome Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20"
              >
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-2">Hello, Alex! 👋</h2>
                  <p className="opacity-80 max-w-md">Your Mathematics Olympiad Level 1 is scheduled for June 15th. Keep practicing!</p>
                  <button className="mt-6 bg-white text-primary px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
                    Continue Learning
                  </button>
                </div>
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold">24h 15m</h4>
                      <p className="text-xs text-muted-foreground">Study Time</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-3/4" />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center">
                      <Trophy size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold">Global Rank #42</h4>
                      <p className="text-xs text-muted-foreground">Mathematics</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-1/2" />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center">
                      <FileEdit size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold">12 / 15</h4>
                      <p className="text-xs text-muted-foreground">Quizzes Done</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[80%]" />
                  </div>
                </div>
              </div>

              {/* Modules Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Upcoming Mock Tests</h3>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-border flex items-center justify-between group cursor-pointer hover:border-primary transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold">
                            M{i}
                          </div>
                          <div>
                            <h5 className="font-bold">Mathematics Mock {i}</h5>
                            <p className="text-xs text-muted-foreground">Closes in 2 days • 50 Questions</p>
                          </div>
                        </div>
                        <button className="text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">Start Now</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Latest Results</h3>
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-border flex flex-col items-center justify-center text-center">
                    <BarChart3 size={48} className="text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No recent results found. Complete a mock test to see your analytics.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-border">
              <LogOut size={48} className="text-muted-foreground/30 mb-4" />
              <h2 className="text-2xl font-bold text-muted-foreground italic">Coming Soon</h2>
              <p className="text-muted-foreground mt-2">{activeTab} feature is currently being developed.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
