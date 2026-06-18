"use client";

import { motion } from "framer-motion";
import { Book, FileText, Layout, CheckCircle2, Trophy } from "lucide-react";

const materials = [
  {
    title: "Preparatory Booklet",
    desc: "Comprehensive guides designed specifically for young learners in Nursery to Sr. KG.",
    icon: <Book className="text-blue-500" />,
    items: ["Foundational concepts", "Engaging exercises"],
  },
  {
    title: "Sample Papers",
    desc: "Practice with real exam patterns to build familiarity and confidence at an early stage.",
    icon: <FileText className="text-emerald-500" />,
    items: ["Exam simulation", "Pattern recognition"],
  },
  {
    title: "Online Prep Material",
    desc: "Digital resources and interactive content accessible from anywhere for effective learning.",
    icon: <Layout className="text-amber-500" />,
    items: ["Interactive modules", "Progress tracking"],
  },
  {
    title: "Certificates & Medals",
    desc: "Recognizing every student's effort with certificates and rewarding excellence with medals.",
    icon: <Trophy className="text-[#ff9c00]" />,
    items: ["Merit certificates", "Achievement medals"],
  },
];

export default function StudyMaterial() {
  return (
    <section id="study" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <span className="text-secondary font-bold uppercase tracking-widest text-[10px] mb-4 block">Resources</span>
            <h2 className="text-4xl md:text-6xl font-black text-[#002d5b] italic leading-tight mb-8">
              Study Material <br />
              <span className="text-[#2da3c2]">& Benefits</span>
            </h2>
            <p className="text-slate-500 font-bold text-lg mb-10 leading-relaxed uppercase tracking-tighter">
              Equip your little ones with the right tools to shine. Our materials are 
              crafted to make learning both effective and enjoyable.
            </p>

            <div className="grid gap-4">
               {["Build strong foundations", "nurture critical thinking", "Gain early exposure to problem-solving"].map((benefit, i) => (
                 <div key={i} className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="w-6 h-6 bg-[#69cc63]/10 text-[#69cc63] rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} strokeWidth={3} />
                    </div>
                    <p className="font-black text-[#002d5b] text-sm uppercase tracking-tight">{benefit}</p>
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:w-1/2 grid sm:grid-cols-2 gap-6">
            {materials.map((mat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col gap-6"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                  {mat.icon}
                </div>
                <div>
                  <h4 className="font-black text-[#002d5b] text-lg mb-3 italic uppercase tracking-tighter leading-tight">{mat.title}</h4>
                  <p className="text-slate-500 font-bold text-[10px] mb-4 leading-relaxed line-clamp-2">{mat.desc}</p>
                  <div className="space-y-2">
                    {mat.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#2da3c2]" />
                        <span className="text-[9px] font-black uppercase text-slate-400">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
