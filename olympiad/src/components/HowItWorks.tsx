"use client";

import { motion } from "framer-motion";
import { UserPlus, Pencil, GraduationCap, Award, BarChart } from "lucide-react";

const steps = [
  { title: "Register", icon: <UserPlus />, desc: "Sign up as a school" },
  { title: "Practice", icon: <Pencil />, desc: "Access study materials & mocks" },
  { title: "Exam", icon: <GraduationCap />, desc: "Take the global Olympiad exam" },
  { title: "Results", icon: <BarChart />, desc: "Get detailed performance report" },
  { title: "Awards", icon: <Award />, desc: "Receive medals & certificates" },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 -translate-y-1/2 z-0" />
          
          <div className="grid md:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-white dark:bg-slate-800 border-4 border-primary/10 rounded-full flex items-center justify-center text-primary mb-6 shadow-xl group-hover:border-primary transition-all">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
