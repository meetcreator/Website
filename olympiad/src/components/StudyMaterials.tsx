"use client";

import { motion } from "framer-motion";
import { Book, FileText, Download, ShoppingCart } from "lucide-react";

export default function StudyMaterials() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
             {/* Visual representation of books/materials */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-primary p-6 rounded-2xl aspect-[3/4] flex flex-col justify-between text-white shadow-xl transform -rotate-3">
                   <Book size={32} />
                   <div>
                     <p className="font-bold">Mathematics</p>
                     <p className="text-xs opacity-80">Vol 1: Level 1-3</p>
                   </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-secondary p-6 rounded-2xl aspect-[3/4] flex flex-col justify-between text-white shadow-xl transform rotate-3 translate-y-6">
                   <Book size={32} />
                   <div>
                     <p className="font-bold">Science Pro</p>
                     <p className="text-xs opacity-80">Full Series</p>
                   </div>
                </div>
             </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            <h2 className="text-4xl font-bold mb-6">Master Your Subject</h2>
            <p className="text-lg text-muted-foreground mb-10">
              Access curated study books, sample papers, and solved previous year questions prepared by international experts.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border hover:border-primary transition-all cursor-pointer group">
                <FileText className="text-primary" />
                <div className="flex-grow">
                  <h4 className="font-bold">Sample Question Papers</h4>
                  <p className="text-xs text-muted-foreground">Free download for all registered students.</p>
                </div>
                <Download size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border hover:border-primary transition-all cursor-pointer group">
                <Book className="text-secondary" />
                <div className="flex-grow">
                  <h4 className="font-bold">Subject Master Books</h4>
                  <p className="text-xs text-muted-foreground">Comprehensive theory & practice questions.</p>
                </div>
                <ShoppingCart size={20} className="text-muted-foreground group-hover:text-secondary transition-colors" />
              </div>
            </div>

            <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all">
              Explore Store
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
