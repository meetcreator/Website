"use client";

import { motion } from "framer-motion";
import { 
  Calculator, Beaker, BookOpen, Brain, Monitor, 
  Wind, Sun, Palette, Leaf, GraduationCap 
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const crestWinter = [
  { name: "Mathematics (CMO)", icon: <Calculator />, color: "bg-blue-500" },
  { name: "Science (CSO)", icon: <Beaker />, color: "bg-emerald-500" },
  { name: "English (CEO)", icon: <BookOpen />, color: "bg-orange-500" },
  { name: "Reasoning (CRO)", icon: <Brain />, color: "bg-purple-500" },
  { name: "Cyber (CCO)", icon: <Monitor />, color: "bg-slate-700" },
  { name: "Spell Bee (CSBW)", icon: <GraduationCap />, color: "bg-amber-500" },
  { name: "Green Warrior (IGWO)", icon: <Leaf />, color: "bg-green-600" },
];

const crestSummer = [
  { name: "Spell Bee (CSB)", icon: <GraduationCap />, color: "bg-amber-400" },
  { name: "Mental Maths (CMMO)", icon: <Calculator />, color: "bg-blue-400" },
  { name: "Drawing (CIDO)", icon: <Palette />, color: "bg-pink-500" },
];

const gSun = [
  { name: "English Olympiad", icon: <BookOpen />, color: "bg-indigo-500" },
  { name: "Math Olympiad", icon: <Calculator />, color: "bg-rose-500" },
  { name: "Science Olympiad", icon: <Beaker />, color: "bg-cyan-500" },
];

export default function Subjects() {
  const [activeTab, setActiveTab] = useState("winter");

  const getSubjects = () => {
    if (activeTab === "winter") return crestWinter;
    if (activeTab === "summer") return crestSummer;
    return gSun;
  };

  return (
    <section id="olympiads" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-[10px] mb-4 block">Our Courses</span>
          <h2 className="text-4xl md:text-6xl font-black text-[#002d5b] italic">Olympiads <span className="text-[#2da3c2]">Offered</span></h2>
          <p className="text-slate-500 font-bold text-sm mt-4 max-w-xl mx-auto uppercase tracking-tighter">
            Designed to improve Vocabulary, Analytical skills, Scientific thinking, and Logical reasoning.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-100 p-2 rounded-2xl flex gap-2">
            {[
              { id: "winter", label: "CREST Winter", icon: <Wind size={16} /> },
              { id: "summer", label: "CREST Summer", icon: <Sun size={16} /> },
              { id: "gsun", label: "G Sun Olympiads", icon: <GraduationCap size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                  activeTab === tab.id ? "bg-[#002d5b] text-white shadow-xl" : "text-slate-500 hover:bg-slate-200"
                )}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {getSubjects().map((subject, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group text-center"
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform",
                subject.color
              )}>
                {subject.icon}
              </div>
              <h4 className="font-black text-[#002d5b] text-sm leading-tight uppercase tracking-tighter">
                {subject.name}
              </h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
