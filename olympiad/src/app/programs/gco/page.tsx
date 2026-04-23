"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, Award, BookOpen, Target, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function GCOPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2da3c2]/5 -skew-x-12 translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="text-[#2da3c2] font-black uppercase tracking-widest text-xs mb-4 block">Our Flagship Program</span>
            <h1 className="text-5xl md:text-7xl font-black text-[#002d5b] italic leading-none mb-8">
              Global Competency <br />
              <span className="text-[#2da3c2]">Olympiad (GCO)</span>
            </h1>
            <p className="text-slate-500 font-bold text-lg md:text-xl mb-10 leading-relaxed uppercase tracking-tighter">
              A comprehensive assessment platform designed to identify, nurture, and celebrate 
              academic excellence in young learners across Literacy, Numeracy, and Science.
            </p>
          </div>
        </div>
      </section>

      {/* Main Info */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#002d5b]/5 rounded-[4rem] rotate-3" />
              <div className="relative bg-white border border-slate-100 p-8 md:p-12 rounded-[4rem] shadow-xl">
                <h2 className="text-3xl font-black text-[#002d5b] italic mb-8 uppercase tracking-tighter">What is GCO?</h2>
                <div className="space-y-6">
                  {[
                    "International standard assessment for primary and secondary levels.",
                    "Focuses on conceptual understanding rather than rote learning.",
                    "Provides detailed performance analysis for every student.",
                    "Aligned with national and international educational benchmarks.",
                    "Global ranking and certification for top achievers."
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-6 h-6 bg-[#2da3c2]/10 text-[#2da3c2] rounded-full flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle2 size={16} />
                      </div>
                      <p className="text-slate-600 font-medium leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-black text-[#002d5b] italic mb-4 uppercase tracking-tighter">Program Objectives</h3>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-tight mb-8">
                  We aim to bridge the gap between classroom learning and real-world application.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { icon: <Target className="text-blue-500" />, title: "Precision", desc: "Accurate skill mapping" },
                    { icon: <Zap className="text-amber-500" />, title: "Agility", desc: "Fast problem solving" },
                    { icon: <Shield className="text-emerald-500" />, title: "Confidence", desc: "Exam readiness" },
                    { icon: <Award className="text-purple-500" />, title: "Recognition", desc: "Global certificates" }
                  ].map((obj, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                      <div className="mb-4">{obj.icon}</div>
                      <h4 className="font-black text-[#002d5b] text-sm uppercase mb-1">{obj.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{obj.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#2da3c2]/10 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black italic mb-4">Core <span className="text-[#2da3c2]">Subjects</span></h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Comprehensive coverage for holistic development</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "English Literacy", desc: "Grammar, vocabulary, reading comprehension, and creative writing skills assessed through complex scenarios." },
              { title: "Mathematics", desc: "Focus on logical reasoning, mental math, geometry, and real-life mathematical applications." },
              { title: "Science", desc: "Testing scientific inquiry, biological concepts, physical sciences, and environmental awareness." }
            ].map((sub, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-[#2da3c2] rounded-2xl flex items-center justify-center mb-8">
                  <BookOpen size={24} className="text-white" />
                </div>
                <h4 className="text-xl font-black mb-4 uppercase italic tracking-tighter">{sub.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{sub.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
