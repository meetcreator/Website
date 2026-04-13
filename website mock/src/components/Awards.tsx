"use client";

import { motion } from "framer-motion";
import { Medal, Trophy, FileBadge } from "lucide-react";

export default function Awards() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Prestigious Awards & Recognition</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We celebrate excellence with more than just high ranks. Every participant receives recognition for their hard work and dedication.
            </p>
            
            <div className="space-y-6">
              {[
                { title: "Global Medals", icon: <Medal className="text-amber-500" />, desc: "Gold, Silver, and Bronze medals for top performers globally." },
                { title: "Institutional Trophies", icon: <Trophy className="text-primary" />, desc: "Recognizing schools with the highest collective performance." },
                { title: "Digital Certificates", icon: <FileBadge className="text-secondary" />, desc: "Verifiable certificates for every participant." },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 glass rounded-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 blur-3xl -z-10" />
            <div className="grid grid-cols-2 gap-4">
               {/* Visual placeholders for medals/certificates */}
               <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl border border-border flex flex-col items-center justify-center text-center shadow-lg">
                  <Medal className="w-16 h-16 text-amber-500 mb-4" />
                  <span className="font-bold">Gold Medal</span>
                  <span className="text-xs text-muted-foreground">Top 0.1%</span>
               </div>
               <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl border border-border flex flex-col items-center justify-center text-center shadow-lg translate-y-8">
                  <Trophy className="w-16 h-16 text-primary mb-4" />
                  <span className="font-bold">Global Trophy</span>
                  <span className="text-xs text-muted-foreground">Rank #1 Schools</span>
               </div>
               <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl border border-border flex flex-col items-center justify-center text-center shadow-lg">
                  <FileBadge className="w-16 h-16 text-emerald-500 mb-4" />
                  <span className="font-bold">Excellence</span>
                  <span className="text-xs text-muted-foreground">Merit Holders</span>
               </div>
               <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl border border-border flex flex-col items-center justify-center text-center shadow-lg translate-y-8">
                  <Medal className="w-16 h-16 text-slate-400 mb-4" />
                  <span className="font-bold">Silver Medal</span>
                  <span className="text-xs text-muted-foreground">Top 1%</span>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
