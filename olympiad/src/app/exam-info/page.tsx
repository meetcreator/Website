"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, FileCheck, Users, Info } from "lucide-react";

export default function ExamDetailsPage() {
  const details = [
    {
      title: "Exam Pattern",
      desc: "Age-appropriate assessments featuring pictorial questions and conceptual understanding tests.",
      icon: <FileCheck className="text-blue-500" />
    },
    {
      title: "Exam Duration",
      desc: "60 minutes to ensuring every child has ample time to think and respond independently.",
      icon: <Clock className="text-amber-500" />
    },
    {
      title: "Eligibility",
      desc: "Open to students specifically enrolled in Nursery, Junior KG, and Senior KG across all recognized schools.",
      icon: <Users className="text-emerald-500" />
    },
    {
      title: "Mode of Exam",
      desc: "Offline (Pen & Paper) conducted within school premises for a familiar environment.",
      icon: <ShieldCheck className="text-rose-500" />
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-48 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 blur-[150px] -z-10 rounded-full" />
        
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24"
          >
            <span className="text-[#2da3c2] font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Information Desk</span>
            <h1 className="text-5xl md:text-7xl font-black text-[#002d5b] italic uppercase tracking-tighter leading-tight mb-8">
              Exam <span className="text-[#ff9c00]">Information</span>
            </h1>
            <p className="text-slate-500 font-bold text-xs md:text-sm max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
              Everything you need to know about the Global Competency Olympiad structure and logistics.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-24">
            {details.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col md:flex-row gap-8 items-start"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#002d5b] italic uppercase mb-4">{item.title}</h3>
                  <p className="text-slate-500 text-sm font-bold leading-relaxed uppercase tracking-tight">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#002d5b] rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden"
          >
             <Info className="absolute top-10 right-10 w-48 h-48 text-white/5 rotate-12" />
             <div className="relative z-10 max-w-3xl">
                <h2 className="text-4xl md:text-6xl font-black italic uppercase leading-tight mb-10 tracking-tighter">
                  Marking <span className="text-[#ff9c00]">Scheme</span>
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                    <span className="text-4xl font-black text-[#ff9c00]">01</span>
                    <p className="text-xs md:text-sm font-bold uppercase tracking-widest">Multiple Choice Questions (MCQ) for easy understanding.</p>
                  </div>
                  <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                    <span className="text-4xl font-black text-[#2da3c2]">02</span>
                    <p className="text-xs md:text-sm font-bold uppercase tracking-widest">+4 for correct answers. No negative marking at this stage.</p>
                  </div>
                  <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                    <span className="text-4xl font-black text-[#69cc63]">03</span>
                    <p className="text-xs md:text-sm font-bold uppercase tracking-widest">Pictorial questions to assist visual learning and recognition.</p>
                  </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
