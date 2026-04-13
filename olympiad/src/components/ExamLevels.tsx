"use client";

import { motion } from "framer-motion";
import { School, MapPin, Flag } from "lucide-react";

const levels = [
  {
    level: "Level 1",
    title: "School Level",
    desc: "The foundation where students compete within their own schools. Focused on identifying local talent.",
    icon: <School className="w-8 h-8" />,
    color: "bg-blue-500",
  },
  {
    level: "Level 2",
    title: "State Level",
    desc: "Top performers from schools compete at a regional level. Increased difficulty and broader exposure.",
    icon: <MapPin className="w-8 h-8" />,
    color: "bg-emerald-500",
  },
  {
    level: "Level 3",
    title: "National/International",
    desc: "The final showdown. Elite students from across the globe compete for the top honors.",
    icon: <Flag className="w-8 h-8" />,
    color: "bg-amber-500",
  },
];

export default function ExamLevels() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Competition Trajectory</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {levels.map((lvl, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx === 0 ? -20 : idx === 2 ? 20 : 0 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-xl"
            >
              <div className={`absolute -top-6 left-8 w-16 h-16 ${lvl.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                {lvl.icon}
              </div>
              <div className="mt-8">
                <span className="text-sm font-bold text-primary uppercase tracking-widest">{lvl.level}</span>
                <h3 className="text-2xl font-bold mt-2 mb-4">{lvl.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{lvl.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
