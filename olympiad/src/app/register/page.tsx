"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { School, ArrowRight, CheckCircle2, ChevronDown, UserCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const [subject, setSubject] = useState("Literacy (GCLO)");

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-56 pb-24 px-6">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black text-[#002d5b] italic uppercase tracking-tighter mb-4">
              Enroll Your <span className="text-[#2da3c2]">Child</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Join the Global Competency Olympiad journey today.
            </p>
          </motion.div>

          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2da3c2]/5 -translate-y-1/2 translate-x-1/2 rounded-full" />
            
            <div className="mb-10 text-center relative z-10">
              <div className="inline-flex items-center justify-center gap-2 py-3 px-8 bg-[#002d5b] rounded-xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl">
                <UserCircle size={14} /> Student Enrollment
              </div>
            </div>

            <form className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">Child's Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#2da3c2] focus:bg-white transition-all text-[#002d5b]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">Grade / Level</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#2da3c2] focus:bg-white transition-all appearance-none text-[#002d5b]"
                  >
                    <option>Nursery</option>
                    <option>Junior KG</option>
                    <option>Senior KG</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">Parent's Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#2da3c2] focus:bg-white transition-all text-[#002d5b]"
                />
              </div>

              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">Choose Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#2da3c2] focus:bg-white transition-all appearance-none text-[#002d5b]"
                >
                  <option>Literacy (GCLO)</option>
                  <option>Numeracy (GCNO)</option>
                  <option>Science (GCSO)</option>
                  <option>All Subjects</option>
                </select>
                <ChevronDown className="absolute right-5 bottom-5 text-slate-400 pointer-events-none" size={20} />
              </div>

              <button className="w-full bg-[#ff9c00] text-[#002d5b] py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:shadow-[#ff9c00]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4">
                SUBMIT REGISTRATION <ArrowRight size={20} strokeWidth={3} />
              </button>
            </form>

            <div className="mt-8 text-center px-4">
              <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                By submitting, you agree to receive information about exam schedules and preparatory materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
