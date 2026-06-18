"use client";

import { motion } from "framer-motion";
import { School, ArrowRight, UserCircle, Mail, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SchoolRegisterPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-56 pb-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-[#2da3c2] font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Institutional Enrollment</span>
            <h1 className="text-5xl md:text-7xl font-black text-[#002d5b] italic uppercase tracking-tighter mb-8 leading-tight">
              School <span className="text-[#ff9c00]">Registration</span>
            </h1>
            <p className="text-slate-500 font-bold text-xs md:text-sm max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
              Register your institution to bring the Global Competency Olympiad to your students. 
              Note: Individual student registrations are not accepted.
            </p>
          </motion.div>

          <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2da3c2]/5 -translate-y-1/2 translate-x-1/2 rounded-full" />
            
            <form className="space-y-10 relative z-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-[#002d5b] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 mb-8">
                    <School size={16} className="text-[#2da3c2]" /> School Information
                  </h3>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">Official School Name</label>
                    <input
                      type="text"
                      placeholder="Enter Full School Name"
                      className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#2da3c2] focus:bg-white transition-all text-[#002d5b]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">School Address</label>
                    <textarea
                      placeholder="City, State, Country"
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#2da3c2] focus:bg-white transition-all text-[#002d5b] resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[#002d5b] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 mb-8">
                    <UserCircle size={16} className="text-[#ff9c00]" /> Contact Person
                  </h3>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">Coordinator Name</label>
                    <input
                      type="text"
                      placeholder="Principal or HOD Name"
                      className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#2da3c2] focus:bg-white transition-all text-[#002d5b]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">Contact Number</label>
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#2da3c2] focus:bg-white transition-all text-[#002d5b]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 pt-6 border-t border-slate-50">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">Official Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="email"
                      placeholder="school@example.com"
                      className="w-full bg-slate-50 border border-slate-100 py-5 pl-14 pr-5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#2da3c2] focus:bg-white transition-all text-[#002d5b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">Approx. Participation</label>
                  <div className="relative">
                    <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <select
                      className="w-full bg-slate-50 border border-slate-100 py-5 pl-14 pr-5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#2da3c2] focus:bg-white transition-all appearance-none text-[#002d5b]"
                    >
                      <option>Less than 50 Students</option>
                      <option>50 - 200 Students</option>
                      <option>200 - 500 Students</option>
                      <option>500+ Students</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button className="w-full bg-[#ff9c00] text-[#002d5b] py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:shadow-[#ff9c00]/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4">
                  SUBMIT INSTITUTIONAL INQUIRY <ArrowRight size={20} strokeWidth={3} />
                </button>
              </div>
            </form>

            <div className="mt-12 text-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="text-[9px] font-extrabold text-[#002d5b] leading-relaxed uppercase tracking-widest flex items-center justify-center gap-2">
                <Info size={12} className="text-[#2da3c2]" /> 
                Our team will contact you within 48 hours with the registration kit and examination manual.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Info({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
