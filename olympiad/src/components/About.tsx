"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Languages, Target, Brain, Trophy, Zap, BookOpen, Calculator, Beaker } from "lucide-react";
import { assetPath } from "@/lib/basePath";

const aims = [
  { text: "Language proficiency", icon: <Languages className="text-purple-500" /> },
  { text: "Mathematical thinking", icon: <Calculator className="text-amber-500" /> },
  { text: "Scientific curiosity", icon: <Beaker className="text-blue-500" /> },
  { text: "Real-world skills", icon: <Target className="text-emerald-500" /> },
];

const highlights = [
  { text: "Structured problem-solving", icon: <Brain size={20} /> },
  { text: "Early skill development", icon: <Zap size={20} /> },
  { text: "Effective and enjoyable learning", icon: <CheckCircle2 size={20} /> },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <span className="text-secondary font-bold uppercase tracking-widest text-xs mb-4 block">About the Olympiad</span>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight italic text-[#002d5b]">
              The Global <br />
              <span className="text-[#2da3c2]">Competency Olympiad</span>
            </h2>
            <p className="text-[#002d5b]/70 text-lg mb-8 leading-relaxed font-medium">
              Presented by **Inner Space Organization**, this unique initiative is focused on early skill development. 
              It goes beyond traditional learning by nurturing core competencies in young learners.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {aims.map((aim, idx) => (
                <div key={idx} className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    {aim.icon}
                  </div>
                  <p className="text-sm font-bold text-[#002d5b] leading-tight">{aim.text}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#002d5b] p-8 rounded-[2.5rem] text-white">
              <h4 className="flex items-center gap-2 font-black uppercase tracking-widest text-sm mb-6 text-[#ff9c00]">
                💡 Nurturing Future Ready Skills
              </h4>
              <div className="space-y-4">
                {highlights.map((fact, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="text-[#2da3c2] shrink-0">{fact.icon}</div>
                    <p className="font-bold text-sm tracking-wide">{fact.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
            <div className="aspect-[4/5] bg-[#2da3c2]/10 rounded-[4rem] p-4 relative overflow-hidden">
               <img 
                 src={assetPath('/GALLERY/childAward.jpg')} 
                 alt="Olympiad Success" 
                 className="w-full h-full object-cover rounded-[3rem] shadow-2xl"
               />
               
               {/* Decorative floating card */}
               <div className="absolute top-10 right-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100">
                  <p className="text-4xl font-black text-[#ff9c00] mb-1">N-UKG</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#002d5b]">Target Grades</p>
               </div>
               
               <div className="absolute bottom-10 left-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-[#002d5b] leading-none mb-1">Inner Space</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organization</p>
                  </div>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
