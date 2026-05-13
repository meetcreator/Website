"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  CheckCircle2, 
  BookOpen, 
  Target, 
  Zap, 
  Users, 
  Palette, 
  BrainCircuit, 
  Search, 
  Calculator, 
  Trophy,
  ChevronRight,
  School,
  Leaf,
  Sparkles,
  ClipboardCheck,
  Heart,
  Shield,
  Lightbulb
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

export default function GCOPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-[#2da3c2]/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2da3c2]/10 -skew-x-12 translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="text-[#2da3c2] font-black uppercase tracking-widest text-xs mb-4 block">“Every Child is a Thinker”</span>
            <h1 className="text-5xl md:text-7xl font-black text-[#002d5b] italic leading-tight mb-8">
              Global Competency <br />
              <span className="text-[#2da3c2] font-black">Olympiad (GCO)</span>
            </h1>
            <p className="text-slate-600 font-medium text-lg md:text-xl mb-10 leading-relaxed max-w-2xl">
              A first-of-its-kind skill-based Olympiad specially designed for preschool learners — Nursery, Jr. KG, and Sr. KG.
            </p>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-[#2da3c2]/20 shadow-xl inline-block">
              <p className="text-slate-500 font-bold text-sm uppercase tracking-tighter">
                Nurturing curiosity, creativity, and foundational skills in a joyful environment.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic mb-8 uppercase tracking-tighter">
                Beyond <br />
                <span className="text-[#2da3c2]">Rote Learning</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Unlike traditional examinations, GCO encourages children to think, observe, explore, imagine, and solve problems in a stress-free environment.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                The olympiad is aligned with the vision of NEP 2020 and focuses on holistic development through experiential and competency-based learning.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <BookOpen className="text-[#2da3c2]" />, text: "Foundational Literacy" },
                  { icon: <Calculator className="text-[#2da3c2]" />, text: "Numeracy & Science" },
                  { icon: <Palette className="text-[#2da3c2]" />, text: "Creativity & Imagination" },
                  { icon: <BrainCircuit className="text-[#2da3c2]" />, text: "Logical Thinking" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {item.icon}
                    <span className="text-slate-700 font-bold text-xs uppercase tracking-tight">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <div className="relative">
              <div className="absolute -inset-4 bg-[#2da3c2]/10 rounded-[4rem] -rotate-2" />
              <div className="relative bg-[#002d5b] p-12 rounded-[3.5rem] shadow-2xl text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2da3c2]/20 rounded-full -translate-y-1/2 translate-x-1/2" />
                <Sparkles className="w-16 h-16 text-[#2da3c2] mb-8" />
                <h3 className="text-3xl font-black italic mb-6 uppercase tracking-tighter">Holistic Development</h3>
                <ul className="space-y-4">
                  {[
                    "Enhance creativity and imagination",
                    "Strengthen observation and reasoning",
                    "Improve communication and vocabulary",
                    "Build confidence and independent thinking"
                  ].map((obj, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-200 text-sm italic font-medium">
                      <CheckCircle2 size={18} className="text-[#2da3c2] shrink-0" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Levels */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic mb-4 uppercase tracking-tighter">Participation <span className="text-[#2da3c2]">Categories</span></h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Tailored assessment for each preschool stage</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { 
                cat: "Nursery", 
                desc: "Simple observation, matching, identification, and listening-based activities.",
                color: "bg-[#2da3c2]"
              },
              { 
                cat: "Junior KG", 
                desc: "Basic reasoning, language readiness, numeracy, patterns, and creativity-based activities.",
                color: "bg-[#258da8]"
              },
              { 
                cat: "Senior KG", 
                desc: "Problem-solving, analytical thinking, early comprehension, and application-based activities.",
                color: "bg-[#002d5b]"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all"
              >
                <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                  <Users size={24} />
                </div>
                <h4 className="text-2xl font-black text-[#002d5b] mb-4 italic uppercase tracking-tighter">{item.cat}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black text-[#002d5b] italic mb-2 uppercase tracking-tighter">Olympiad <span className="text-[#2da3c2]">Levels</span></h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Progressing from school to state excellence</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {["School Level", "Inter-School Level", "State Level"].map((level, i) => (
                <div key={i} className="px-8 py-4 bg-[#2da3c2]/10 border border-[#2da3c2]/20 rounded-2xl text-[#2da3c2] font-black uppercase tracking-widest text-xs">
                  {level}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Competency Areas */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic mb-4 uppercase tracking-tighter">Competency <span className="text-[#2da3c2]">Areas</span></h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Comprehensive skill mapping for young minds</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "English Skills",
                icon: <BookOpen />,
                items: ["Alphabet readiness", "Vocabulary building", "Listening and speaking", "Picture reading", "Phonics readiness", "Comprehension skills"],
                color: "bg-blue-50",
                accent: "text-blue-600"
              },
              {
                title: "Math Skills",
                icon: <Calculator />,
                items: ["Number recognition", "Counting concepts", "Shapes and patterns", "Sequencing", "Comparison and classification", "Logical numeracy"],
                color: "bg-teal-50",
                accent: "text-teal-600"
              },
              {
                title: "Science & Awareness",
                icon: <Leaf />,
                items: ["My body and senses", "Plants and animals", "Transport and surroundings", "Healthy habits", "Observation and discovery"],
                color: "bg-emerald-50",
                accent: "text-emerald-600"
              },
              {
                title: "Higher Order Thinking",
                icon: <Zap />,
                items: ["Creativity", "Critical thinking", "Logical reasoning", "Problem-solving", "Visual thinking", "Imagination and innovation"],
                color: "bg-amber-50",
                accent: "text-amber-600"
              }
            ].map((area, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`p-10 rounded-[4rem] ${area.color} border border-transparent hover:border-slate-200 transition-all shadow-sm hover:shadow-xl`}
              >
                <div className={`w-16 h-16 bg-white rounded-3xl flex items-center justify-center ${area.accent} shadow-sm mb-8`}>
                  {area.icon}
                </div>
                <h4 className="text-3xl font-black text-[#002d5b] italic mb-6 uppercase tracking-tighter">{area.title}</h4>
                <div className="grid grid-cols-2 gap-y-3">
                  {area.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2 text-slate-600 font-semibold text-xs uppercase tracking-tight">
                      <div className={`w-1.5 h-1.5 rounded-full bg-slate-300`} />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Features & Assessment Pattern */}
      <section className="py-24 bg-[#002d5b] text-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black italic mb-8 uppercase tracking-tighter">Unique <span className="text-[#2da3c2]">Features</span></h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "National Level Competition", "Skill-Based Pattern", "Child-Friendly Questions",
                  "Stress-Free Participation", "NEP 2020 Aligned", "Age-Appropriate Design",
                  "Interactive Model", "Beyond Textbooks"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 group hover:bg-[#2da3c2]/20 transition-all">
                    <Target size={20} className="text-[#2da3c2]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-12 rounded-[4rem] text-[#002d5b]">
              <h3 className="text-3xl font-black italic mb-8 uppercase tracking-tighter">Assessment <span className="text-[#2da3c2]">Pattern</span></h3>
              <p className="text-slate-500 font-medium mb-8">Focusing on understanding and application rather than memorization.</p>
              <div className="space-y-4">
                {[
                  { icon: <Search />, text: "Picture-based questions & Observation activities" },
                  { icon: <ClipboardCheck />, text: "Matching, sorting & Logical reasoning tasks" },
                  { icon: <Lightbulb />, text: "Creative thinking challenges & Real-life application" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[#2da3c2]">{item.icon}</div>
                    <span className="text-sm font-bold uppercase tracking-tight text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic mb-4 uppercase tracking-tighter">Recognition & <span className="text-[#2da3c2]">Awards</span></h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Celebrating every milestone of our young learners</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-10 rounded-[4rem] bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <Trophy className="w-16 h-16 text-[#2da3c2] mb-8" />
              <h4 className="text-2xl font-black text-[#002d5b] italic mb-6 uppercase tracking-tighter">For Students</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {["Participation Certificates", "Merit Certificates", "Outstanding Performance Medals", "National Topper Awards"].map((award, i) => (
                  <span key={i} className="px-6 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-tight border border-slate-200 text-slate-600 shadow-sm">
                    {award}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-10 rounded-[4rem] bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <School className="w-16 h-16 text-[#002d5b] mb-8" />
              <h4 className="text-2xl font-black text-[#002d5b] italic mb-6 uppercase tracking-tighter">For Schools</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {["Excellence in Competency Education", "Best Participation School", "Coordinator Appreciation"].map((award, i) => (
                  <span key={i} className="px-6 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-tight border border-slate-200 text-slate-600 shadow-sm">
                    {award}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-3xl font-black italic mb-8 uppercase tracking-tighter text-[#2da3c2]">Benefits for <span className="text-white">Students</span></h3>
              <ul className="space-y-4">
                {[
                  "Improves confidence and thinking skills",
                  "Enhances curiosity and creativity",
                  "Encourages independent learning",
                  "Strengthens foundational competencies",
                  "Makes learning enjoyable and meaningful"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <Heart size={20} className="text-[#2da3c2]" />
                    <span className="text-sm font-medium italic text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-3xl font-black italic mb-8 uppercase tracking-tighter text-[#2da3c2]">Benefits for <span className="text-white">Schools</span></h3>
              <ul className="space-y-4">
                {[
                  "Promotes competency-based education",
                  "Enhances school academic profile",
                  "Encourages innovative teaching practices",
                  "Supports implementation of NEP 2020 goals",
                  "Provides national-level exposure"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <Shield size={20} className="text-[#2da3c2]" />
                    <span className="text-sm font-medium italic text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#2da3c2]/5 rounded-[5rem] p-12 md:p-20 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2da3c2]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic mb-6 uppercase tracking-tighter">
                Register Your <span className="text-[#2da3c2]">School</span>
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
                <div className="flex items-center gap-3 text-slate-600 font-bold uppercase tracking-widest text-xs">
                  <School className="text-[#2da3c2]" />
                  Offline at School Campus
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-bold uppercase tracking-widest text-xs">
                  <Users className="text-[#2da3c2]" />
                  Min 50 registrations per school
                </div>
              </div>
              <p className="text-slate-500 font-medium mb-10">
                Available for students from Nursery, Junior KG, and Senior KG. Join the first-of-its-kind skill-based Olympiad today.
              </p>
              <Link 
                href="/register" 
                className="bg-[#002d5b] text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-[#2da3c2] transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 mx-auto max-w-xs"
              >
                Registration Link <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SamplePapersSyllabus 
        programName="GCO"
        samplePapers={[
          { grade: "Nursery", link: "#" },
          { grade: "Junior KG", link: "/olympiad/sample_papers/hots_junior_kg.pdf" },
          { grade: "Senior KG", link: "/olympiad/sample_papers/hots_senior_kg.pdf" },
          { grade: "Sample Report", link: "/olympiad/sample_papers/sample_report.pdf" }
        ]}
        themeColor="#2da3c2"
      />

      <Footer />
    </main>
  );
}

