"use client";

import Link from "next/link";
import { Mail, Phone, Globe, Camera, MessageCircle, Share2, MapPin } from "lucide-react";
import { assetPath } from "@/lib/basePath";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#002d5b] text-white/50 pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <img
                src={assetPath('/logo.png')}
                alt="Global Competency Olympiad Logo"
                className="h-12 w-auto object-contain brightness-0 invert"
              />
              <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                GCO<span className="text-[#ff9c00]">2026</span>
              </span>
            </Link>
            <p className="text-xs font-bold leading-relaxed mb-8 max-w-xs uppercase tracking-tight text-white/70">
              Developing creativity, critical thinking, and essential real-world skills for young learners.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#ff9c00] hover:text-[#002d5b] transition-all"><Share2 size={16} /></Link>
              <Link href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#ff9c00] hover:text-[#002d5b] transition-all"><Globe size={16} /></Link>
              <Link href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#ff9c00] hover:text-[#002d5b] transition-all"><Camera size={16} /></Link>
              <Link href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#ff9c00] hover:text-[#002d5b] transition-all"><MessageCircle size={16} /></Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-10">Quick Links</h4>
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest">
              <li><Link href="#" className="hover:text-[#ff9c00] transition-colors">Home</Link></li>
              <li><Link href="#about" className="hover:text-[#ff9c00] transition-colors">About Olympiad</Link></li>
              <li><Link href="#olympiads" className="hover:text-[#ff9c00] transition-colors">Subjects Offered</Link></li>
              <li><Link href="#schools" className="hover:text-[#ff9c00] transition-colors">For Schools</Link></li>
              <li><Link href="/gallery" className="hover:text-[#ff9c00] transition-colors">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-10">Resources</h4>
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest">
              <li><Link href="#study" className="hover:text-[#ff9c00] transition-colors">Sample Papers</Link></li>
              <li><Link href="#study" className="hover:text-[#ff9c00] transition-colors">Preparatory Material</Link></li>

              <li><Link href="/register" className="hover:text-[#ff9c00] transition-colors">Registration</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-10">Contact Details</h4>
            <ul className="space-y-8 text-sm font-bold">
              <li className="flex gap-4">
                <Link href="mailto:innerspaceeducation@gmail.com" className="flex gap-4 group">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#ff9c00] shrink-0 group-hover:bg-[#ff9c00] group-hover:text-[#002d5b] transition-all">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[8px] text-white/40 uppercase mb-1 font-black">Email Us</p>
                    <p className="text-white text-[10px] group-hover:text-white transition-colors">innerspaceeducation@gmail.com</p>
                  </div>
                </Link>
              </li>
              <li className="flex gap-4">
                <Link href="tel:9825078167" className="flex gap-4 group">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#2da3c2] shrink-0 group-hover:bg-[#2da3c2] group-hover:text-[#002d5b] transition-all">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[8px] text-white/40 uppercase mb-1 font-black">Call Us</p>
                    <p className="text-white text-[10px] group-hover:text-white transition-colors">9825078167</p>
                  </div>
                </Link>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#f87171] shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[8px] text-white/40 uppercase mb-1 font-black">Address</p>
                  <p className="text-white text-[10px] leading-tight max-w-[150px]">S-21, National Plaza, Alkapuri, Vadodara</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-center md:text-left">
          <p>© {new Date().getFullYear()} Global Competency Olympiad. Inner Space Organization.</p>
          <div className="flex gap-12">
            <Link href="https://innerspace.innerspaceedu.com/gco" target="_blank" className="hover:text-white transition-colors">innerspace.innerspaceedu.com/gco</Link>
          </div>
        </div>

        {/* Creator Credit */}
        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 w-full max-w-xs">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/5"></div>
            <div className="w-1 h-1 rounded-full bg-white/10"></div>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/5"></div>
          </div>

          <Link
            href="https://wa.me/919726120903"
            target="_blank"
            className="group relative flex flex-col items-center gap-3 hover:scale-105 transition-all duration-500"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 group-hover:text-[#ff9c00] transition-colors duration-500">
              Handcrafted By
            </span>
            <div className="flex items-center gap-4 px-6 py-2 rounded-full border border-white/0 group-hover:border-white/5 group-hover:bg-white/[0.02] transition-all duration-500">
              <span className="text-[12px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white transition-colors duration-500">
                Drumil Patel
              </span>
              <div className="w-px h-3 bg-white/10 group-hover:bg-[#ff9c00]/30 transition-colors"></div>
              <div className="flex items-center gap-2">
                <MessageCircle size={12} className="text-white/10 group-hover:text-[#25D366] transition-colors" />
                <span className="text-[10px] font-bold text-white/10 group-hover:text-white/40 transition-colors">
                  9726120903
                </span>
              </div>
            </div>

            {/* Minimalist Underline Animation */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff9c00]/50 to-transparent group-hover:w-full transition-all duration-700"></div>
          </Link>
        </div>
      </div>
    </footer>
  );
}
