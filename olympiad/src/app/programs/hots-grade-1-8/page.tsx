"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lightbulb, Trophy, Users, BarChart3, GraduationCap, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import SamplePapersSyllabus from "@/components/SamplePapersSyllabus";

export default function HOTSGrade1to8Page() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-blue-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-200/20 -skew-x-12 translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="text-blue-600 font-black uppercase tracking-widest text-xs mb-4 block">Advanced Learning Path</span>
            <h1 className="text-5xl md:text-7xl font-black text-[#002d5b] italic leading-none mb-8">
              HOTS for <br />
              <span className="text-blue-600">Grades 1-8</span>
            </h1>
            <p className="text-slate-500 font-bold text-lg md:text-xl mb-10 leading-relaxed uppercase tracking-tighter">
              Empowering students with analytical, evaluative, and creative thinking skills 
              to excel in a complex, data-driven world.
            </p>
          </div>
        </div>
      </section>

      {/* Core Competencies */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic mb-8 uppercase tracking-tighter">Beyond the <br /><span className="text-blue-600">Textbook</span></h2>
              <p className="text-slate-500 font-bold text-sm mb-12 uppercase tracking-widest leading-relaxed">
                Our curriculum for Grades 1-8 is meticulously structured to evolve with the student's 
                cognitive maturity, moving from basic comprehension to advanced synthesis.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "Critical Analysis", desc: "Developing the ability to break down complex information." },
                  { title: "Logical Deduction", desc: "Training the mind to find solutions through structured reasoning." },
                  { title: "Evaluative Thinking", desc: "Learning to judge the validity and quality of information." },
                  { title: "Problem Synthesis", desc: "Combining multiple concepts to solve unique challenges." }
                ].map((comp, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-[#002d5b] text-sm uppercase italic tracking-tighter">{comp.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{comp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: <Lightbulb className="text-amber-500" />, title: "Innovation", value: "21st Century Skills" },
                { icon: <BarChart3 className="text-blue-500" />, title: "Analytics", value: "Data-Driven" },
                { icon: <Users className="text-emerald-500" />, title: "Collaboration", value: "Team Problem Solving" },
                { icon: <GraduationCap className="text-purple-500" />, title: "Future-Ready", value: "Career Foundations" }
              ].map((stat, i) => (
                <div key={i} className="p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-xl transition-all">
                   <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center">
                     {stat.icon}
                   </div>
                   <div>
                     <h4 className="font-black text-[#002d5b] text-sm uppercase tracking-tighter mb-1">{stat.title}</h4>
                     <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{stat.value}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grade-wise Structure */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic mb-4 uppercase tracking-tighter">Grade-wise <span className="text-blue-600">Focus</span></h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Progressive difficulty for sustained growth</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                level: "Primary (Grade 1-3)", 
                focus: "Foundational Logic", 
                desc: "Introduction to logical puzzles, sequence completion, and basic spatial reasoning."
              },
              { 
                level: "Intermediate (Grade 4-5)", 
                focus: "Analytical Depth", 
                desc: "Multi-step problem solving, data interpretation, and early algebraic thinking."
              },
              { 
                level: "Advanced (Grade 6-8)", 
                focus: "Critical Synthesis", 
                desc: "Complex deduction, abstract reasoning, and real-world case study analysis."
              }
            ].map((level, i) => (
              <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
                <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-4 block">{level.level}</span>
                <h4 className="text-2xl font-black text-[#002d5b] mb-4 italic uppercase tracking-tighter">{level.focus}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">{level.desc}</p>
                <Link href="/register" className="inline-flex items-center gap-2 text-[#002d5b] font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-colors">
                  Learn More <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SamplePapersSyllabus 
        programName="HOTS Grade 1-8"
        samplePapers={[
          { grade: "Grade 1", link: "#" },
          { grade: "Grade 2", link: "#" },
          { grade: "Grade 3", link: "#" },
          { grade: "Grade 4", link: "#" },
          { grade: "Grade 5", link: "#" },
          { grade: "Grade 6", link: "#" },
          { grade: "Grade 7", link: "#" },
          { grade: "Grade 8", link: "#" },
          { grade: "Sample Report", link: "/olympiad/sample_papers/sample_report.pdf" }
        ]}
        themeColor="#2563eb"
      />

      <Footer />
    </main>
  );
}
