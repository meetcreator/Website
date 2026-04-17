"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Globe, School, Trophy, Monitor, Download, BookOpen, Calculator, Beaker } from "lucide-react";
import Link from "next/link";
import { assetPath } from "@/lib/basePath";

const slides = [
  {
    image: assetPath('/GALLERY/ChildrenExam.jpg'),
    title: "Global Competency Olympiad",
    subtitle: "A comprehensive platform to build strong foundations in Literacy, Numeracy, and Science for young learners.",
  },
  {
    image: assetPath('/GALLERY/childrenawards4.jpeg'),
    title: "International Benchmarking",
    subtitle: "Providing world-class assessments to measure and nurture the potential of every child.",
  },
  {
    image: assetPath('/GALLERY/childrenAwards.jpg'),
    title: "Early Skill Development",
    subtitle: "Designed for Nursery, Junior KG, and Senior KG to develop creativity and critical thinking.",
  },
  {
    image: assetPath('/GALLERY/childrenawards1.jpeg'),
    title: "Celebrating Excellence",
    subtitle: "Every child is recognized and rewarded for their unique learning journey and achievements.",
  },
  {
    image: assetPath('/GALLERY/childAward.jpg'),
    title: "Essential Real-World Skills",
    subtitle: "Nurturing curiosity and problem-solving through engaging and effective assessments.",
  },
];

const badges = [
  { text: "Literacy (GCLO)", icon: <BookOpen size={24} /> },
  { text: "Numeracy (GCNO)", icon: <Calculator size={24} /> },
  { text: "Science (GCSO)", icon: <Beaker size={24} /> },
  { text: "Ages: Nursery - Sr. KG", icon: <School size={24} /> },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="pt-6 pb-12 bg-white flex flex-col items-center px-2 md:px-0">
      {/* Slideshow Container */}
      <div className="max-w-[100%] md:max-w-[96%] w-full h-[75vh] md:h-[88vh] rounded-[2rem] md:rounded-[4rem] shadow-2xl overflow-hidden relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#002d5b]/95 via-[#002d5b]/40 to-transparent z-10" />
            <motion.img
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear" }}
              src={slides[current].image}
              alt="Olympiad Slide"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay */}
        <div className="absolute inset-y-0 left-0 p-8 lg:p-20 z-20 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 italic uppercase tracking-tighter">
                {slides[current].title}
              </h1>
              <p className="text-white/90 text-xl mb-10 font-bold leading-relaxed max-w-xl">
                {slides[current].subtitle}
              </p>

              <div className="flex flex-wrap gap-6 mb-12">
                <Link
                  href="/register"
                  className="bg-[#ff9c00] text-[#002d5b] px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all inline-flex items-center gap-3"
                >
                  School Registration <ChevronRight size={20} strokeWidth={3} />
                </Link>
                <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-[#002d5b] transition-all inline-flex items-center gap-3">
                  Interested? Call Us <ChevronRight size={20} />
                </button>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge, idx) => (
                  <div key={idx} className="flex flex-col gap-2 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                    <div className="text-[#ff9c00]">{badge.icon}</div>
                    <p className="text-[10px] font-black uppercase text-white tracking-widest leading-tight">
                      {badge.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-white/20">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-white/20">
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
