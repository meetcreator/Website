"use client";

import { motion } from "framer-motion";
import { 
  Calculator, Beaker, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const subjects = [
  { 
    name: "Global Competency Literacy Olympiad (GCLO)", 
    short: "Literacy",
    icon: <BookOpen />, 
    color: "bg-orange-500",
    description: "Focuses on reading, writing, speaking, and listening to build strong language skills.",
    features: ["Reading", "Writing", "Speaking", "Listening"]
  },
  { 
    name: "Global Competency Numeracy Olympiad (GCNO)", 
    short: "Numeracy",
    icon: <Calculator />, 
    color: "bg-blue-500",
    description: "Enhances mathematical ability with emphasis on logical reasoning and problem-solving.",
    features: ["Logical reasoning", "Problem-solving", "Data interpretation", "Applications"]
  },
  { 
    name: "Global Competency Science Olympiad (GCSO)", 
    short: "Science",
    icon: <Beaker />, 
    color: "bg-emerald-500",
    description: "Encourages scientific thinking through conceptual understanding and inquiry-based learning.",
    features: ["Scientific curiosity", "Conceptual understanding", "Analytical reasoning", "Experimentation"]
  },
];

export default function Subjects() {
  return (
    <section id="olympiads" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-[10px] mb-4 block">Our Curriculum</span>
          <h2 className="text-4xl md:text-6xl font-black text-[#002d5b] italic">Subjects <span className="text-[#2da3c2]">Offered</span></h2>
          <p className="text-slate-500 font-bold text-sm mt-4 max-w-xl mx-auto uppercase tracking-tighter">
            Aligned with global standards for future readiness in Literacy, Numeracy, and Science.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {subjects.map((subject, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group"
            >
              <div className={cn(
                "w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform",
                subject.color
              )}>
                {subject.icon}
              </div>
              <h4 className="font-black text-[#002d5b] text-xl mb-4 uppercase tracking-tighter leading-tight">
                {subject.name}
              </h4>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                {subject.description}
              </p>
              
              <div className="space-y-3">
                {subject.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2da3c2]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#002d5b]">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
