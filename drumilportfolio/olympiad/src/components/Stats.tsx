"use client";

import { motion } from "framer-motion";
import { Users, Trophy, School, BookOpen } from "lucide-react";

const stats = [
  { label: "Participants", value: "49000 +", icon: <Users size={36} /> },
  { label: "Competitions", value: "12", icon: <BookOpen size={36} /> },
  { label: "Schools", value: "610 +", icon: <School size={36} /> },
  { label: "Medal Winners", value: "15500 +", icon: <Trophy size={36} /> },
];

export default function Stats() {
  return (
    <section className="py-12 stats-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center text-white"
            >
              <div className="mb-4 drop-shadow-lg">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-black mb-1 leading-none drop-shadow-sm">
                {stat.value}
              </h3>
              <p className="text-lg font-bold">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
