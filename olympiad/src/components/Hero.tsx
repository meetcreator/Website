"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Globe, School, Trophy, Monitor, Download } from "lucide-react";
import Link from "next/link";
import { assetPath } from "@/lib/basePath";

const slides = [
  {
    image: assetPath('/GALLERY/ChildrenExam.jpg'),
    title: "Unlock Your Child’s True Potential",
    subtitle: "Participate in internationally recognized Olympiads in Math, Science & English.",
  },
  {
    image: assetPath('/GALLERY/childrenAwards.jpg'),
    title: "Global Recognition & Awards",
    subtitle: "Compete with students worldwide and celebrate academic excellence.",
  },
  {
    image: assetPath('/GALLERY/childrenAward.jpg'),
    title: "Building Confidence & Skills",
    subtitle: "Designed to help students develop problem-solving mindsets.",
  },
];

const badges = [
  { text: "Students from 60+ Countries", icon: <Globe size={24} /> },
  { text: "5000+ Schools Participation", icon: <School size={24} /> },
  { text: "Thousands of Prizes to be Won", icon: <Trophy size={24} /> },
  { text: "Fully Online / School-Based", icon: <Monitor size={24} /> },
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
    <section className="pt-48 pb-12 bg-white flex flex-col items-center px-4">
      {/* Slideshow Container */}
      <div className="max-w-7xl w-full h-[500px] md:h-[650px] rounded-[3rem] shadow-2xl overflow-hidden relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#002d5b]/90 via-[#002d5b]/40 to-transparent z-10" />
            <img
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
                  Register Now <ChevronRight size={20} strokeWidth={3} />
                </Link>
                <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-[#002d5b] transition-all inline-flex items-center gap-3">
                  Download Sample Papers <Download size={20} />
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
