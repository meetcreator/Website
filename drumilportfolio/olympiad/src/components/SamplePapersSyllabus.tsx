"use client";

import { motion } from "framer-motion";
import { FileText, Download, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Resource {
  title: string;
  description: string;
  link: string;
  type: "syllabus" | "sample-paper";
}

interface SamplePapersSyllabusProps {
  programName: string;
  syllabusLink?: string;
  samplePapers: {
    grade: string;
    link: string;
  }[];
  themeColor?: string;
}

export default function SamplePapersSyllabus({ 
  programName, 
  syllabusLink = "/syllabus", 
  samplePapers,
  themeColor = "#2da3c2"
}: SamplePapersSyllabusProps) {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-black uppercase tracking-[0.3em] text-[10px] mb-4 block"
            style={{ color: themeColor }}
          >
            Preparation Materials
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-[#002d5b] italic uppercase tracking-tighter"
          >
            Syllabus & <span style={{ color: themeColor }}>Sample Papers</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Syllabus Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 rounded-[4rem] p-10 md:p-14 border border-slate-100 group hover:shadow-2xl transition-all"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <BookOpen size={32} style={{ color: themeColor }} />
              </div>
              <div className="bg-white/80 backdrop-blur px-4 py-1 rounded-full border border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Official Curriculum</span>
              </div>
            </div>
            
            <h3 className="text-3xl font-black text-[#002d5b] italic uppercase mb-4 tracking-tighter">Detailed Syllabus</h3>
            <p className="text-slate-500 font-bold text-sm mb-10 leading-relaxed uppercase tracking-tight">
              Get a comprehensive breakdown of the topics, learning objectives, and skill assessments covered in the {programName} program.
            </p>

            <Link 
              href={syllabusLink}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#002d5b] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all group/btn"
            >
              View Syllabus <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Sample Papers Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 rounded-[4rem] p-10 md:p-14 border border-slate-100 group hover:shadow-2xl transition-all"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <FileText size={32} style={{ color: themeColor }} />
              </div>
              <div className="bg-white/80 backdrop-blur px-4 py-1 rounded-full border border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Practice Sets</span>
              </div>
            </div>

            <h3 className="text-3xl font-black text-[#002d5b] italic uppercase mb-4 tracking-tighter">Sample Papers</h3>
            <p className="text-slate-500 font-bold text-sm mb-8 leading-relaxed uppercase tracking-tight">
              Download practice papers to familiarize students with the exam pattern and question types.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {samplePapers.map((paper, i) => (
                paper.link === "#" ? (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 opacity-50 cursor-not-allowed"
                  >
                    <span className="font-black text-[#002d5b] text-[10px] uppercase tracking-wider">{paper.grade}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Coming Soon</span>
                  </div>
                ) : (
                  <a
                    key={i}
                    href={paper.link}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group/item"
                  >
                    <span className="font-black text-[#002d5b] text-[10px] uppercase tracking-wider">{paper.grade}</span>
                    <Download size={14} className="text-slate-400 group-hover/item:text-[#002d5b] transition-colors" />
                  </a>
                )
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
