"use client";

import { motion } from "framer-motion";
import { 
  Trophy, Medal, Star, Gift, Laptop, School, 
  IndianRupee, Globe, Fingerprint, Calendar 
} from "lucide-react";

export default function AwardsAndFees() {
  return (
    <section id="awards" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Structure & Fees */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {/* CREST Details */}
          <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-500/10 text-blue-600 rounded-3xl flex items-center justify-center mb-8">
              <Laptop size={40} />
            </div>
            <h3 className="text-3xl font-black text-[#002d5b] uppercase italic mb-2 tracking-tighter">CREST Exams</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-8">Structure & Enrollment</p>
            
            <ul className="space-y-4 mb-10 w-full text-left font-bold text-slate-600 text-sm">
              <li className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl"><Fingerprint size={18} className="text-blue-500" /> Online & Webcam Proctored</li>
              <li className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl"><Star size={18} className="text-blue-500" /> Parent-assisted (KG - Grade 1)</li>
              <li className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl"><Globe size={18} className="text-blue-500" /> International Recognition</li>
            </ul>

            <div className="mt-auto w-full bg-[#002d5b] p-8 rounded-[2rem] text-white">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Registration Fee</p>
              <div className="flex justify-center items-end gap-2">
                <span className="text-4xl font-black">₹225</span>
                <span className="text-sm opacity-60 mb-1">/ subject</span>
              </div>
              <p className="text-[10px] mt-4 opacity-40 font-bold uppercase tracking-widest">(Intl: $15 USD)</p>
            </div>
          </div>

          {/* G Sun Details */}
          <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-rose-500/10 text-rose-600 rounded-3xl flex items-center justify-center mb-8">
              <School size={40} />
            </div>
            <h3 className="text-3xl font-black text-[#002d5b] uppercase italic mb-2 tracking-tighter">G Sun Exams</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-8">Structure & Enrollment</p>
            
            <ul className="space-y-4 mb-10 w-full text-left font-bold text-slate-600 text-sm">
              <li className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl"><School size={18} className="text-rose-500" /> Conducted in Schools</li>
              <li className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl"><Calendar size={18} className="text-rose-500" /> CBSE / ICSE Based Syllabus</li>
              <li className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl"><TrendingUp size={18} className="text-rose-500" /> Multi-Level Evaluation</li>
            </ul>

            <div className="mt-auto w-full bg-rose-600 p-8 rounded-[2rem] text-white">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Registration Fee</p>
              <div className="flex justify-center items-end gap-2">
                <span className="text-4xl font-black">₹150</span>
                <span className="text-sm opacity-60 mb-1">/ subject</span>
              </div>
              <p className="text-[10px] mt-4 opacity-40 font-bold uppercase tracking-widest">(School Enrollment only)</p>
            </div>
          </div>
        </div>

        {/* Awards Section */}
        <div className="text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-[10px] mb-4 block">Recognition</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic">Awards & <span className="text-[#2da3c2]">Recognition</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { level: "School Level", title: "Level 1 Winners", items: ["Gold, Silver, Bronze Medals", "Certificates for all participants"], icon: <Medal /> },
            { level: "State Level", title: "Level 2 Winners", items: ["Prestigious Trophies", "Exclusive Smart Watches", "State Ranking Certificates"], icon: <Trophy /> },
            { level: "National Level", title: "Level 3 Winners", items: ["National Trophies", "Special Gift Hampers", "Lifetime Recognition"], icon: <Gift /> },
          ].map((award, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full flex items-center justify-center text-slate-200 group-hover:text-[#ff9c00] transition-colors">
                {award.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2da3c2] mb-4 block">{award.level}</span>
              <h4 className="text-xl font-black text-[#002d5b] mb-6 uppercase tracking-tight">{award.title}</h4>
              <ul className="space-y-4">
                {award.items.map((item, i) => (
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

function TrendingUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
