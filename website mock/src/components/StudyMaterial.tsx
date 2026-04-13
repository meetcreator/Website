"use client";

import { motion } from "framer-motion";
import { Book, FileText, Layout, CheckCircle2, ArrowRight } from "lucide-react";

const materials = [
  {
    title: "Specialized Workbooks",
    desc: "Curated content for Math, Science, English, and Reasoning to master the syllabus.",
    icon: <Book className="text-blue-500" />,
    items: ["Conceptual Clarity", "Step-by-step solutions"],
  },
  {
    title: "Previous Year Papers",
    desc: "Real exam patterns and questions from past competitions to build familiarity.",
    icon: <FileText className="text-emerald-500" />,
    items: ["Time management", "Exam simulation"],
  },
  {
    title: "Practice Worksheets",
    desc: "Daily or weekly worksheets to keep the learning momentum alive.",
    icon: <Layout className="text-amber-500" />,
    items: ["Regular assessment", "Progress tracking"],
  },
];

export default function StudyMaterial() {
  return (
    <section id="study" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <span className="text-secondary font-bold uppercase tracking-widest text-[10px] mb-4 block">Preparation</span>
            <h2 className="text-4xl md:text-6xl font-black text-[#002d5b] italic leading-tight mb-8">
              Premium <br />
              <span className="text-[#2da3c2]">Study Material</span>
            </h2>
            <p className="text-slate-500 font-bold text-lg mb-10 leading-relaxed uppercase tracking-tighter">
              Equip your child with the right resources to excel. Our materials are 
              specifically designed to reinforce concepts and build exam confidence.
            </p>

            <div className="grid gap-4">
               {["Reinforce core concepts", "Improve knowledge retention", "Build peak exam confidence"].map((benefit, i) => (
                 <div key={i} className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="w-6 h-6 bg-[#69cc63]/10 text-[#69cc63] rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} strokeWidth={3} />
                    </div>
                    <p className="font-black text-[#002d5b] text-sm uppercase tracking-tight">{benefit}</p>
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:w-1/2 grid gap-8">
            {materials.map((mat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col sm:flex-row gap-8 items-center sm:items-start"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                  {mat.icon}
                </div>
                <div>
                  <h4 className="font-black text-[#002d5b] text-xl mb-4 italic uppercase tracking-tighter">{mat.title}</h4>
                  <p className="text-slate-500 font-bold text-xs mb-6 leading-relaxed">{mat.desc}</p>
                  <button className="flex items-center gap-2 text-[#2da3c2] font-black text-[10px] uppercase tracking-[0.2em] group">
                    Inquire Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
