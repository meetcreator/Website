"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Brain, Star, Palette, Rocket, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import SamplePapersSyllabus from "@/components/SamplePapersSyllabus";

export default function HOTSPreschoolPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-pink-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-pink-200/20 -skew-x-12 translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="text-pink-500 font-black uppercase tracking-widest text-xs mb-4 block">Early Childhood Development</span>
            <h1 className="text-5xl md:text-7xl font-black text-[#002d5b] italic leading-none mb-8">
              HOTS for <br />
              <span className="text-pink-500">Preschools</span>
            </h1>
            <p className="text-slate-500 font-bold text-lg md:text-xl mb-10 leading-relaxed uppercase tracking-tighter">
              Nurturing young minds through curiosity, creativity, and critical thinking. 
              Designed specifically for Nursery, Jr. KG, and Sr. KG learners.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic mb-6 uppercase tracking-tighter">The Power of <span className="text-pink-500">Curiosity</span></h2>
            <p className="text-slate-500 font-bold text-sm max-w-2xl mx-auto uppercase tracking-widest">
              At the preschool level, we focus on developing the "How" of learning rather than just the "What".
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Brain className="text-pink-500" />, 
                title: "Cognitive Skills", 
                desc: "Building memory, attention, and basic reasoning through play-based challenges." 
              },
              { 
                icon: <Palette className="text-orange-500" />, 
                title: "Creative Expression", 
                desc: "Encouraging out-of-the-box thinking through art, storytelling, and imaginative play." 
              },
              { 
                icon: <Sparkles className="text-amber-500" />, 
                title: "Pattern Recognition", 
                desc: "Identifying sequences and relationships in numbers, shapes, and everyday objects." 
              }
            ].map((skill, i) => (
              <div key={i} className="p-10 rounded-[4rem] bg-slate-50 border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  {skill.icon}
                </div>
                <h4 className="text-xl font-black text-[#002d5b] mb-4 uppercase italic tracking-tighter">{skill.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-24 bg-[#002d5b] text-white rounded-[4rem] mx-4 md:mx-10 mb-24 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black italic mb-8 leading-tight">Tailored for <br /> Little <span className="text-pink-400">Geniuses</span></h2>
              <div className="space-y-8">
                {[
                  { title: "Visual Learning", desc: "Highly illustrated and colorful study materials to keep engagement levels high." },
                  { title: "Story-Based Assessments", desc: "Problems presented as exciting adventures and stories." },
                  { title: "Skill-Based Reporting", desc: "Progress reports that focus on developmental milestones." }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Star className="text-pink-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg mb-2 uppercase tracking-tighter italic">{feature.title}</h4>
                      <p className="text-slate-400 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-pink-500 to-orange-500 rounded-[5rem] overflow-hidden shadow-2xl relative">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Rocket size={120} className="text-white animate-bounce" />
                 </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-3xl shadow-xl hidden md:block">
                 <Heart className="text-pink-500 mb-2" />
                 <p className="text-[#002d5b] font-black text-xs uppercase tracking-widest">Loved by kids & teachers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SamplePapersSyllabus 
        programName="HOTS Preschool"
        samplePapers={[
          { grade: "Nursery", link: "#" },
          { grade: "Junior KG", link: "/olympiad/sample_papers/hots_junior_kg.pdf" },
          { grade: "Senior KG", link: "/olympiad/sample_papers/hots_senior_kg.pdf" },
          { grade: "Sample Report", link: "/olympiad/sample_papers/sample_report.pdf" }
        ]}
        themeColor="#ec4899"
      />

      <Footer />
    </main>
  );
}
