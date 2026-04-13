"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function Announcement() {
  return (
    <section className="bg-[#69cc63] py-16 flex justify-center">
      <h2 className="text-3xl md:text-5xl font-black text-[#002d5b] tracking-tight text-center px-6">
        Registration open for International Cybersecurity
      </h2>
    </section>
  );
}

export function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
       <div className="w-16 h-16 bg-[#25d366] rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer hover:scale-110 transition-transform">
          <MessageCircle size={36} fill="white" strokeWidth={1} />
       </div>
    </div>
  );
}
