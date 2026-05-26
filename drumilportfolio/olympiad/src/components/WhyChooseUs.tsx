"use client";

import { motion } from "framer-motion";
import { ClipboardList, FileCheck, CreditCard, CalendarClock, CheckCircle2 } from "lucide-react";

const requirements = [
  {
    title: "Student Consent",
    desc: "Collect student consent forms signed by parents.",
    icon: <ClipboardList size={28} />,
  },
  {
    title: "Registration",
    desc: "Submit registration and final enrollment forms.",
    icon: <FileCheck size={28} />,
  },
  {
    title: "Payments",
    desc: "Complete payments via online mode or QR code.",
    icon: <CreditCard size={28} />,
  },
  {
    title: "Exam Dates",
    desc: "Inform exam dates at least one month in advance.",
    icon: <CalendarClock size={28} />,
  },
];

export default function WhyChooseUs() {
  return (
    <section id="schools" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <span className="text-secondary font-bold uppercase tracking-widest text-xs mb-4 block">For Institutions</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic leading-tight mb-8">
              Information for <br />
              <span className="text-[#2da3c2]">Schools & Principals</span>
            </h2>
            <p className="text-slate-500 font-bold text-lg mb-10 leading-relaxed uppercase tracking-tighter">
              We partner with schools to ensure a seamless experience for students and educators alike. 
              Our streamlined process makes implementation easy and effective.
            </p>

            <div className="space-y-6">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex gap-6 items-start p-6 bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#2da3c2] group-hover:bg-[#2da3c2] group-hover:text-white transition-colors shrink-0">
                    {req.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-[#002d5b] text-base mb-2 uppercase tracking-tight">{req.title}</h4>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{req.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
            <div className="bg-[#002d5b] p-12 md:p-16 rounded-[4rem] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2da3c2] opacity-[0.05] rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <h3 className="text-3xl font-black mb-8 italic uppercase tracking-tighter border-b border-white/10 pb-6">Benefits for <span className="text-[#ff9c00]">Schools</span></h3>
              
              <ul className="space-y-6">
                {[
                  "Global benchmarking for students",
                  "Detailed performance analytics",
                  "Recognition certificates for teachers",
                  "Enhanced school reputation",
                  "Seamless online/offline coordination"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-white/80">
                    <CheckCircle2 size={20} className="text-[#69cc63] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-12 pt-12 border-t border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff9c00] mb-4">Questions about registration?</p>
                <div className="flex flex-wrap gap-4">
                  <a href="/register" className="bg-white text-[#002d5b] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#ff9c00] transition-colors block text-center">School Registration</a>
                  <button className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-colors">School Portal</button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
