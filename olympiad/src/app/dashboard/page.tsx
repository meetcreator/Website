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
  Video,
  UserCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

const sidebarLinks = [
  { name: "Overview", icon: <LayoutDashboard size={20} />, active: true },
  { name: "Preparatory", icon: <FileEdit size={20} /> },
  { name: "My Progress", icon: <BarChart3 size={20} /> },
  { name: "Interactive", icon: <Video size={20} /> },
  { name: "Rewards", icon: <Trophy size={20} /> },
  { name: "Settings", icon: <Settings size={20} /> },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-border hidden md:flex flex-col">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3">
             <div className="flex flex-col">
              <span className="text-xl font-black text-[#002d5b] tracking-tighter leading-none italic uppercase">GCO</span>
              <span className="text-[9px] font-bold text-red-600 tracking-[0.2em] leading-none text-center">OLYMPIAD</span>
            </div>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => setActiveTab(link.name)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                activeTab === link.name
                  ? "bg-[#002d5b] text-white shadow-xl"
                  : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              {link.icon}
              {link.name}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-border">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest">
            <LogOut size={20} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-auto">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-black italic uppercase tracking-tighter text-[#002d5b]">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-[#002d5b] uppercase tracking-tight">Aryan Mehta</p>
              <p className="text-[9px] font-bold text-[#2da3c2] uppercase tracking-widest">Senior KG | GCLO Literacy</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-border overflow-hidden flex items-center justify-center text-[#002d5b]">
              <UserCircle size={28} />
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
                className="bg-[#002d5b] rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl"
              >
                <div className="relative z-10">
                  <h2 className="text-4xl font-black mb-4 italic uppercase tracking-tighter">Hello, Aryan! 👋</h2>
                  <p className="text-white/70 font-bold uppercase tracking-widest text-xs max-w-md leading-loose">
                    Your Literacy Olympiad Level 1 preparation is 65% complete. You're doing great!
                  </p>
                  <button className="mt-8 bg-[#ff9c00] text-[#002d5b] px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                    Continue Learning
                  </button>
                </div>
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2da3c2]/10 rounded-full blur-3xl -ml-20 -mb-20" />
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-[#002d5b] uppercase tracking-tight">12h 45m</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prep Time</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-3/4" />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-[#002d5b] uppercase tracking-tight">85% Score</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Accuracy</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-1/2" />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                      <FileEdit size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-[#002d5b] uppercase tracking-tight">4 / 6</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sample Papers</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[66%]" />
                  </div>
                </div>
              </div>

              {/* Modules Grid */}
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-[#002d5b] uppercase italic tracking-tighter">Preparatory Material</h3>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-[#2da3c2] hover:shadow-xl transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-[#002d5b]">
                            P{i}
                          </div>
                          <div>
                            <h5 className="font-black text-[#002d5b] text-sm uppercase tracking-tight">Literacy Practice Set {i}</h5>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Listening & Reading Focus</p>
                          </div>
                        </div>
                        <button className="text-[#2da3c2] font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Practice</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-[#002d5b] uppercase italic tracking-tighter">Recent Achievements</h3>
                  <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                    <BarChart3 size={48} className="text-slate-200 mb-6" />
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-loose">
                      Complete more practice sets to unlock detailed performance analytics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 shadow-sm">
              <LogOut size={48} className="text-slate-100 mb-6" />
              <h2 className="text-2xl font-black text-slate-200 italic uppercase tracking-tighter">Coming Soon</h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">{activeTab} feature is currently being developed.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
