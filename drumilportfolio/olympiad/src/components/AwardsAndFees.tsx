"use client";

import { motion } from "framer-motion";
import { 
  Trophy, Medal, Gift,
  Globe, Check,
  Clock
} from "lucide-react";



const timeline = [
  { level: "School Level", duration: "September – October" },
  { level: "Inter School Level", duration: "February" },
  { level: "State Level", duration: "April" },
  { level: "National Level", duration: "May – June" },
];

const prizes = [
  { 
    title: "Participation Rewards", 
    items: ["Special gift for every student", "Participation certificate for all"],
    icon: <Gift className="text-blue-500" />
  },
  { 
    title: "Achievement Awards", 
    items: ["Medals for Top 3 students at all levels", "Medals for students scoring above 80%"],
    icon: <Medal className="text-amber-500" />
  },
  { 
    title: "Highest Excellence", 
    items: ["Special recognition at National level", "Institutional trophies for top schools"],
    icon: <Trophy className="text-[#ff9c00]" />
  },
];

export default function AwardsAndFees() {
  return (
    <section id="awards" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid lg:grid-cols-1 gap-12 mb-24 max-w-2xl mx-auto w-full">
          {/* Timeline Table */}
          <div className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-xl border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
                <Clock size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#002d5b] uppercase italic tracking-tighter">Exam Timeline</h3>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Level-wise Schedule</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                  <span className="font-black text-[#002d5b] uppercase tracking-tight text-sm">{item.level}</span>
                  <span className="font-black text-rose-600 text-sm italic">{item.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prizes Section */}
        <div className="text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-[10px] mb-4 block">Recognition</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic">Prizes & <span className="text-[#2da3c2]">Rewards</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {prizes.map((prize, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {prize.icon}
              </div>
              <h4 className="text-xl font-black text-[#002d5b] mb-6 uppercase tracking-tight italic">{prize.title}</h4>
              <ul className="space-y-4">
                {prize.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm font-bold text-slate-500">
                    <div className="w-5 h-5 bg-[#69cc63]/10 text-[#69cc63] rounded-full flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
