"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Trophy, Users, Heart } from "lucide-react";
import Link from "next/link";

export default function RegistrationBanner() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2da3c2]/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-[#002d5b] rounded-[4rem] p-12 md:p-24 overflow-hidden shadow-2xl"
        >
          {/* Decorative icons */}
          <Sparkles className="absolute top-10 right-10 text-white/5 w-40 h-40 rotate-12" />
          
          <div className="relative z-10 text-center md:text-left flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-3/5">
              <span className="bg-[#2da3c2] text-white font-black text-[10px] uppercase tracking-[0.3em] px-6 py-2 rounded-full mb-8 inline-block">
                Presented by Inner Space Organization
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8 italic uppercase tracking-tighter">
                Give Your Little Ones <br />
                <span className="text-[#ff9c00]">An Opportunity</span> to Shine
              </h2>
              <p className="text-white/70 text-lg mb-12 font-bold leading-relaxed max-w-xl">
                Register your school today in the Global Competency Olympiad and build a strong foundation for your students&apos; future success.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link 
                  href="/register" 
                  className="bg-[#ff9c00] text-[#002d5b] font-black py-5 px-10 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-xl hover:shadow-orange-500/30 flex items-center justify-center gap-3"
                >
                  School Registration <ArrowRight size={20} strokeWidth={3} />
                </Link>
                <Link
                  href="/#contact"
                  className="bg-white/10 hover:bg-white/20 text-white font-black py-5 px-10 rounded-2xl text-sm uppercase tracking-widest transition-all flex items-center justify-center border border-white/10"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="md:w-2/5 grid grid-cols-2 gap-4">
               {[
                 { label: "Confidence", value: <Star className="text-[#ff9c00] mx-auto" /> },
                 { label: "Creativity", value: <Heart className="text-[#ff9c00] mx-auto" /> },
                 { label: "Recognition", value: <Trophy className="text-[#ff9c00] mx-auto" /> },
                 { label: "Real Skills", value: <Users className="text-[#ff9c00] mx-auto" /> },
               ].map((stat, i) => (
                 <div key={i} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center flex flex-col items-center justify-center">
                    <div className="mb-2">{stat.value}</div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
