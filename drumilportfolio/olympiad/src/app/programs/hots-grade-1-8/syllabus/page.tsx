"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  BrainCircuit, 
  Search, 
  Palette, 
  MessageSquare, 
  Calculator,
  Trophy,
  GraduationCap,
  Users,
  Calendar,
  Wallet,
  CheckCircle2
} from "lucide-react";

export default function HOTS1to8SyllabusPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-48 pb-24 px-6 bg-blue-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Preparation Materials</span>
            <h1 className="text-5xl md:text-7xl font-black text-[#002d5b] italic uppercase tracking-tighter mb-8 leading-tight">
              Syllabus & <span className="text-blue-600">Structure</span>
            </h1>
            <p className="text-slate-500 font-bold text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
              The Olympiad is carefully designed to nurture Analytical Thinking, Creative Thinking, Problem Solving, Logical Reasoning, Decision Making, Verbal Skills, and Numerical Ability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Basic Level */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <GraduationCap size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#002d5b] italic uppercase">Basic Level</h2>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Foundation Skill Assessment</p>
                </div>
              </div>
              <p className="text-slate-600 font-medium mb-8">
                The Basic Level helps students strengthen essential thinking and reasoning abilities through age-appropriate challenges.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-black text-[#002d5b] text-xs uppercase tracking-widest mb-4 border-b pb-2">Exam Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium"><Users size={16} className="text-blue-600" /> Grades: 1–8</div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium"><CheckCircle2 size={16} className="text-blue-600" /> Mode: Paper-Pencil Test</div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium"><Calendar size={16} className="text-blue-600" /> Exam Month: November</div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium"><Wallet size={16} className="text-blue-600" /> Registration Fee: ₹400</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-black text-[#002d5b] text-xs uppercase tracking-widest mb-4 border-b pb-2">Assessment Areas</h3>
                  <ul className="grid grid-cols-2 gap-3 text-xs text-slate-500 font-bold uppercase tracking-tight">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> Logical Thinking</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> Observation Skills</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> Verbal Ability</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> Numerical Skills</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> Basic Critical Thinking</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> Creative Thinking</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Advanced Level */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#002d5b] p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                  <Trophy size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white italic uppercase">Advanced Level</h2>
                  <p className="text-blue-200 font-bold text-[10px] uppercase tracking-widest">Achiever Skill Assessment</p>
                </div>
              </div>
              <p className="text-blue-100/80 font-medium mb-8 relative z-10">
                The Advanced Level is designed for students who demonstrate higher analytical and application-based abilities.
              </p>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <h3 className="font-black text-blue-400 text-xs uppercase tracking-widest mb-4 border-b border-blue-800 pb-2">Exam Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-blue-100/90 text-sm font-medium"><Users size={16} className="text-blue-400" /> Eligibility: Qualified Students from Basic Level</div>
                    <div className="flex items-center gap-3 text-blue-100/90 text-sm font-medium"><CheckCircle2 size={16} className="text-blue-400" /> Mode: Paper-Pencil Test</div>
                    <div className="flex items-center gap-3 text-blue-100/90 text-sm font-medium"><Calendar size={16} className="text-blue-400" /> Exam Month: March</div>
                    <div className="flex items-center gap-3 text-blue-100/90 text-sm font-medium"><Wallet size={16} className="text-blue-400" /> Registration Fee: ₹600</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-black text-blue-400 text-xs uppercase tracking-widest mb-4 border-b border-blue-800 pb-2">Advanced Assessment Areas</h3>
                  <ul className="grid grid-cols-2 gap-3 text-xs text-blue-200 font-bold uppercase tracking-tight">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> Higher Analytical Reasoning</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> Strategic Problem Solving</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> Advanced Critical Thinking</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> Pattern Analysis</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> Creative Application</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> Decision Making</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-lg"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-[#002d5b] italic uppercase tracking-tighter mb-4">
                Skills <span className="text-blue-600">Covered</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-5 gap-6">
              {[
                { icon: <BrainCircuit />, title: "Logical Reasoning", desc: "Develops structured and analytical thinking." },
                { icon: <Search />, title: "Critical Thinking", desc: "Encourages evaluation, interpretation, and decision-making." },
                { icon: <Palette />, title: "Creativity", desc: "Promotes imagination, innovation, and original thinking." },
                { icon: <MessageSquare />, title: "Verbal Skills", desc: "Enhances language understanding and communication." },
                { icon: <Calculator />, title: "Numerical Skills", desc: "Strengthens number sense and mathematical reasoning." }
              ].map((skill, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    {skill.icon}
                  </div>
                  <h4 className="font-black text-[#002d5b] text-sm uppercase italic tracking-tighter mb-3">{skill.title}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">{skill.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
