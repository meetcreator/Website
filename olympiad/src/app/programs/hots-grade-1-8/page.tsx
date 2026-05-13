"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Lightbulb, 
  Trophy, 
  Users, 
  GraduationCap, 
  ChevronRight, 
  BrainCircuit, 
  Search, 
  Palette, 
  MessageSquare, 
  Calculator,
  Target,
  ClipboardList,
  Medal,
  Award,
  CheckCircle2,
  Calendar,
  Wallet,
  BookOpen
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import SamplePapersSyllabus from "@/components/SamplePapersSyllabus";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HOTSGrade1to8Page() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-blue-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-200/20 -skew-x-12 translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="text-blue-600 font-black uppercase tracking-widest text-xs mb-4 block">A Skill-Based Integrated Olympiad</span>
            <h1 className="text-5xl md:text-7xl font-black text-[#002d5b] italic leading-tight mb-8">
              Higher Order Thinking <br />
              <span className="text-blue-600 font-black">Skills Olympiad</span>
            </h1>
            <p className="text-slate-600 font-medium text-lg md:text-xl mb-10 leading-relaxed max-w-2xl">
              Empowering students with the skills of the future through Logical Reasoning, Critical Thinking, Creativity, Verbal Ability, and Numerical Skills.
            </p>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-blue-100 shadow-xl inline-block">
              <p className="text-slate-500 font-bold text-sm uppercase tracking-tighter">
                Designed specially for Grades 1–8 • Focuses on Real Understanding & Innovation
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic mb-8 uppercase tracking-tighter">
                Integrated Skills for <br />
                <span className="text-blue-600">Future-Ready Learners</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                The Higher Order Thinking Skills Olympiad is India&apos;s first integrated skill-based Olympiad that assesses students on multiple thinking dimensions instead of subject memorization alone.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Analytical Thinking", "Creative Thinking", "Problem Solving", 
                  "Logical Reasoning", "Decision Making", "Verbal Skills", "Numerical Ability"
                ].map((skill, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-blue-600 w-5 h-5" />
                    <span className="text-slate-700 font-bold text-sm uppercase tracking-tight">{skill}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-blue-600 font-black text-sm uppercase italic tracking-widest bg-blue-50 inline-block px-4 py-2 rounded-full">
                Aligns with NEP 2020 & Competency-Based Education
              </p>
            </motion.div>
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-100/50 rounded-[4rem] -rotate-2" />
              <div className="relative bg-[#002d5b] p-12 rounded-[3.5rem] shadow-2xl text-white">
                <Lightbulb className="w-16 h-16 text-blue-400 mb-8" />
                <h3 className="text-3xl font-black italic mb-6 uppercase tracking-tighter">Beyond Rote Learning</h3>
                <p className="text-blue-100/80 leading-relaxed text-lg italic">
                  &quot;Our mission is to shift the focus from&apos;what to learn&apos; to&apos;how to think&apos;, preparing students for a world that values innovation over information.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Olympiad Levels */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic mb-4 uppercase tracking-tighter">Olympiad <span className="text-blue-600">Levels</span></h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Two-tiered assessment for progressive excellence</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Basic Level */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white h-full p-10 rounded-[4rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <GraduationCap size={40} />
                  </div>
                </div>
                <span className="text-blue-600 font-black text-sm uppercase tracking-widest mb-2 block">Foundation Skill Assessment</span>
                <h3 className="text-4xl font-black text-[#002d5b] italic mb-6 uppercase tracking-tighter">BASIC LEVEL</h3>
                <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                  Helps students strengthen essential thinking and reasoning abilities through age-appropriate challenges.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="space-y-4">
                    <h4 className="font-black text-[#002d5b] text-xs uppercase tracking-widest">Exam Details</h4>
                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                      <Users size={16} className="text-blue-600" />
                      <span>Grades 1–8</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                      <Calendar size={16} className="text-blue-600" />
                      <span>Nov Examination</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                      <Wallet size={16} className="text-blue-600" />
                      <span className="font-bold">₹400 Fee</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-black text-[#002d5b] text-xs uppercase tracking-widest">Assessment Areas</h4>
                    <ul className="text-xs text-slate-500 space-y-2 uppercase font-bold tracking-tight">
                      <li>• Logical Thinking</li>
                      <li>• Observation Skills</li>
                      <li>• Verbal Ability</li>
                      <li>• Numerical Skills</li>
                      <li>• Creative Thinking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Advanced Level */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-[#002d5b] h-full p-10 rounded-[4rem] border border-[#003d7b] shadow-xl hover:shadow-2xl transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Trophy size={40} />
                  </div>
                </div>
                <span className="text-blue-400 font-black text-sm uppercase tracking-widest mb-2 block">Achiever Skill Assessment</span>
                <h3 className="text-4xl font-black text-white italic mb-6 uppercase tracking-tighter">ADVANCED LEVEL</h3>
                <p className="text-blue-100/70 text-lg mb-8 leading-relaxed">
                  Designed for students who demonstrate higher analytical and application-based abilities.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="space-y-4">
                    <h4 className="font-black text-blue-400 text-xs uppercase tracking-widest">Exam Details</h4>
                    <div className="flex items-center gap-3 text-blue-100/80 text-sm">
                      <CheckCircle2 size={16} className="text-blue-400" />
                      <span>Qualified Students</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-100/80 text-sm">
                      <Calendar size={16} className="text-blue-400" />
                      <span>March Examination</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-100/80 text-sm">
                      <Wallet size={16} className="text-blue-400" />
                      <span className="font-bold">₹600 Fee</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-black text-blue-400 text-xs uppercase tracking-widest">Advanced Areas</h4>
                    <ul className="text-xs text-blue-100/60 space-y-2 uppercase font-bold tracking-tight">
                      <li>• Higher Analytical Reasoning</li>
                      <li>• Strategic Problem Solving</li>
                      <li>• Advanced Critical Thinking</li>
                      <li>• Pattern Analysis</li>
                      <li>• Decision Making</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Covered */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic mb-4 uppercase tracking-tighter">Skills <span className="text-blue-600">Covered</span></h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Developing core competencies for the 21st century</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { icon: <BrainCircuit />, title: "Logical Reasoning", desc: "Develops structured and analytical thinking." },
              { icon: <Search />, title: "Critical Thinking", desc: "Encourages evaluation and decision-making." },
              { icon: <Palette />, title: "Creativity", desc: "Promotes innovation and original thinking." },
              { icon: <MessageSquare />, title: "Verbal Skills", desc: "Enhances language and communication." },
              { icon: <Calculator />, title: "Numerical Skills", desc: "Strengthens mathematical reasoning." }
            ].map((skill, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform mb-6">
                  {skill.icon}
                </div>
                <h4 className="font-black text-[#002d5b] text-sm uppercase italic tracking-tighter mb-3">{skill.title}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Pattern */}
      <section className="py-24 bg-[#002d5b] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 -skew-x-12" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black italic mb-8 uppercase tracking-tighter">Exam <span className="text-blue-400">Pattern</span></h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Multiple Choice Questions", "Visual Reasoning", "Situation-Based Tasks",
                  "Pattern Recognition", "Creative Thinking Tasks", "Analytical Puzzles"
                ].map((type, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <Target size={20} className="text-blue-400 flex-shrink-0" />
                    <span className="text-sm font-bold uppercase tracking-tight">{type}</span>
                  </div>
                ))}
              </div>
              <div className="mt-12 p-8 bg-blue-600 rounded-[2.5rem] flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <ClipboardList size={32} />
                </div>
                <div>
                  <h4 className="font-black text-lg uppercase italic tracking-tighter">Grade-wise Design</h4>
                  <p className="text-blue-100 text-sm font-medium">Questions are specially curated according to the developmental level of each grade.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[4rem] text-[#002d5b]">
              <h3 className="text-3xl font-black italic mb-8 uppercase tracking-tighter">Awards & <span className="text-blue-600">Recognition</span></h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="flex items-center gap-3 text-blue-600 font-black text-sm uppercase tracking-widest mb-4">
                    <Medal size={18} /> For Students
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Participation Certificates", "Merit Certificates", "National Rank Certificates",
                      "Gold, Silver & Bronze Awards", "Topper Recognition", "Performance Reports"
                    ].map((award, i) => (
                      <span key={i} className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-tight border border-slate-100 text-slate-600">
                        {award}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-3 text-blue-600 font-black text-sm uppercase tracking-widest mb-4">
                    <Award size={18} /> For Schools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Excellence Awards", "Innovation in Education Recognition", "Best Participation Awards"
                    ].map((award, i) => (
                      <span key={i} className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-tight border border-slate-100 text-slate-600">
                        {award}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-blue-50 rounded-[5rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic mb-6 uppercase tracking-tighter">
                Registrations <span className="text-blue-600">Open</span>
              </h2>
              <p className="text-slate-600 text-lg mb-10 font-medium">
                Join India&apos;s First Skill-Based Integrated Olympiad and prepare students for the future through Higher Order Thinking Skills.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[2.5rem] border border-blue-100 shadow-sm">
                  <h4 className="text-blue-600 font-black uppercase text-xs tracking-widest mb-2">Basic Level</h4>
                  <div className="text-3xl font-black text-[#002d5b] mb-1">₹400</div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Exam: November</div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-blue-100 shadow-sm">
                  <h4 className="text-blue-600 font-black uppercase text-xs tracking-widest mb-2">Advanced Level</h4>
                  <div className="text-3xl font-black text-[#002d5b] mb-1">₹600</div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Exam: March</div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                  <BookOpen size={16} className="text-blue-600" />
                  Mode of Conduct: Paper-Pencil Based Examination through Schools
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/register" 
                    className="bg-[#002d5b] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
                  >
                    Register Your School Today <ChevronRight size={16} />
                  </Link>
                  <Link 
                    href="/contact" 
                    className="bg-white text-[#002d5b] border-2 border-[#002d5b] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all flex items-center justify-center"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
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

      {/* Program Footer Summary */}
      <section className="py-12 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-xl font-black text-[#002d5b] italic uppercase tracking-tighter">Higher Order Thinking Skills Olympiad</h3>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">India&apos;s First Skill-Based Integrated Olympiad</p>
            <div className="flex flex-wrap justify-center gap-6 mt-4 text-[10px] font-black uppercase tracking-widest text-blue-600">
              <span>Grades 1–8</span>
              <span className="text-slate-300">|</span>
              <span>Competency-Based Assessment</span>
              <span className="text-slate-300">|</span>
              <span>Future-Ready Skills</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

