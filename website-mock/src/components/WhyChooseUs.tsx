"use client";

import { motion } from "framer-motion";
import { Lightbulb, Globe, Pencil, ClipboardCheck, TrendingUp, Check, X } from "lucide-react";

const advantages = [
  {
    title: "Concept-Based Learning",
    desc: "Focus on understanding deeper fundamentals, not just rote memorization.",
    icon: <Lightbulb size={24} />,
  },
  {
    title: "Global Exposure",
    desc: "Compete with students worldwide and benchmark against international standards.",
    icon: <Globe size={24} />,
  },
  {
    title: "Practice & Preparation",
    desc: "Access to high-quality sample papers and previous year question repositories.",
    icon: <Pencil size={24} />,
  },
  {
    title: "Transparent Evaluation",
    desc: "Instant answer keys and a challenge system (CREST) for complete fairness.",
    icon: <ClipboardCheck size={24} />,
  },
  {
    title: "Skill Development",
    desc: "Improves confidence, clarity, and overall academic results across all subjects.",
    icon: <TrendingUp size={24} />,
  },
];

const comparison = [
  { feature: "Mode", crest: "Online", traditional: "Pen & Paper" },
  { feature: "Learning", crest: "Concept-based", traditional: "Theory + practical" },
  { feature: "Practice Tests", crest: "Available", traditional: "Not available", crestIcon: true, tradIcon: false },
  { feature: "Transparency", crest: "Answer key & challenge", traditional: "Not available", crestIcon: true, tradIcon: false },
  { feature: "Exposure", crest: "Global", traditional: "Limited geography" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-[10px] mb-4 block">Key Advantages</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic">Why Choose <span className="text-[#2da3c2]">Our Olympiads?</span></h2>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-24">
          {advantages.map((advantage, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-[#2da3c2]/10 rounded-2xl flex items-center justify-center text-[#2da3c2] mb-6 group-hover:bg-[#2da3c2] group-hover:text-white transition-colors">
                {advantage.icon}
              </div>
              <h4 className="font-black text-[#002d5b] mb-3 leading-tight uppercase text-sm tracking-tight">{advantage.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed font-bold">{advantage.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <div id="exams" className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black text-[#002d5b] uppercase italic tracking-tighter">CREST vs Traditional Olympiads</h3>
            <p className="text-slate-400 font-bold text-sm mt-2">The future of competitive excellence is digital.</p>
          </div>
          
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#002d5b] text-white">
                  <th className="p-8 font-black uppercase tracking-widest text-[10px]">Feature</th>
                  <th className="p-8 font-black uppercase tracking-widest text-[10px] text-center border-l border-white/10">CREST Olympiads</th>
                  <th className="p-8 font-black uppercase tracking-widest text-[10px] text-center border-l border-white/10">Traditional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-sm text-[#002d5b]">
                {comparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-8 italic">{row.feature}</td>
                    <td className="p-8 text-center border-l border-slate-100 text-[#2da3c2]">
                      <div className="flex flex-col items-center gap-1">
                        {row.crestIcon !== undefined && <Check className="text-emerald-500 mb-1" size={20} />}
                        {row.crest}
                      </div>
                    </td>
                    <td className="p-8 text-center border-l border-slate-100 text-slate-400">
                      <div className="flex flex-col items-center gap-1">
                        {row.tradIcon !== undefined && <X className="text-red-400 mb-1" size={20} />}
                        {row.traditional}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-[10px] text-slate-400 font-bold mt-8 uppercase tracking-widest">Source: Page 2 - Official Brochure Comparison</p>
        </div>
      </div>
    </section>
  );
}
