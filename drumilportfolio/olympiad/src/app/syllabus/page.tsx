"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { BookOpen, Calculator, Beaker, CheckCircle2 } from "lucide-react";

const syllabusData = [
  {
    category: "Literacy (GCLO)",
    icon: <BookOpen className="text-blue-500" size={32} />,
    color: "border-blue-100 bg-blue-50/30",
    description: "Building strong language foundations through focus on Reading, Writing, Speaking, and Listening.",
    levels: [
      {
        grade: "Nursery",
        topics: ["Letter Recognition", "Phonics (Beginning Sounds)", "Picture Reading", "Basic Vocabulary"]
      },
      {
        grade: "Junior KG",
        topics: ["Sight Words", "Formation of Letters", "Listening Comprehension", "Action Words", "Simple Rhymes"]
      },
      {
        grade: "Senior KG",
        topics: ["Sentence Formation", "Reading CVC Words", "Story Sequencing", "Verbal Expression", "Advanced Vocabulary"]
      }
    ]
  },
  {
    category: "Numeracy (GCNO)",
    icon: <Calculator className="text-amber-500" size={32} />,
    color: "border-amber-100 bg-amber-50/30",
    description: "Nurturing mathematical thinking, logical reasoning, and problem-solving skills.",
    levels: [
      {
        grade: "Nursery",
        topics: ["Number Recognition (1-10)", "Big vs Small", "Basic Shapes", "Sorting Objects"]
      },
      {
        grade: "Junior KG",
        topics: ["Numbers (1-50)", "Concept of Zero", "Patterns & Sequences", "Simple Addition (Concrete Objects)"]
      },
      {
        grade: "Senior KG",
        topics: ["Numbers (1-100)", "Before, After, Between", "Simple Subtraction", "Measurement Basics", "Problem Solving"]
      }
    ]
  },
  {
    category: "Science (GCSO)",
    icon: <Beaker className="text-emerald-500" size={32} />,
    color: "border-emerald-100 bg-emerald-50/30",
    description: "Building scientific curiosity, conceptual understanding, and analytical reasoning.",
    levels: [
      {
        grade: "Nursery",
        topics: ["Parts of Body", "Colors in Nature", "Animals", "Sense Organs"]
      },
      {
        grade: "Junior KG",
        topics: ["Living vs Non-Living", "Plant Growth", "Weather & Seasons", "Food & Nutrition"]
      },
      {
        grade: "Senior KG",
        topics: ["Environmental Care", "Space & Solar System", "Water Cycle Basics", "Simple Experimentation"]
      }
    ]
  }
];

export default function SyllabusPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-48 pb-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <span className="text-[#2da3c2] font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Our Curriculum</span>
            <h1 className="text-5xl md:text-7xl font-black text-[#002d5b] italic uppercase tracking-tighter mb-8 leading-tight">
              Detailed <span className="text-[#ff9c00]">Syllabus</span>
            </h1>
            <p className="text-slate-500 font-bold text-sm md:text-lg max-w-2xl mx-auto uppercase tracking-wide">
              Global Standards in early childhood education, specifically designed for younger minds to excel.
            </p>
          </motion.div>

          <div className="grid gap-12">
            {syllabusData.map((subject, sIdx) => (
              <motion.div
                key={subject.category}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: sIdx * 0.1 }}
                className={`text-left p-8 md:p-12 border rounded-[4rem] ${subject.color} shadow-sm backdrop-blur-sm relative overflow-hidden`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    {subject.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-[#002d5b] italic uppercase mb-2">{subject.category}</h2>
                    <p className="text-slate-600 font-medium text-xs md:text-sm">{subject.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative z-10">
                  {subject.levels.map((level) => (
                    <div key={level.grade} className="bg-white/60 p-8 rounded-[2.5rem] border border-white/40 shadow-sm hover:shadow-md transition-all">
                      <h3 className="text-[#002d5b] font-black text-xl mb-6 italic">{level.grade}</h3>
                      <ul className="space-y-4">
                        {level.topics.map((topic, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-3">
                            <CheckCircle2 size={16} className="text-[#2da3c2] shrink-0 mt-0.5" />
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
