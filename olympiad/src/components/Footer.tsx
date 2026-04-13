"use client";

import Link from "next/link";
import { Mail, Phone, Globe, Camera, MessageCircle, Share2, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#002d5b] text-white/50 pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Media Coverage / Trusted By */}
      <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">As seen in media coverage</p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale invert">
           {["India Today", "Zee News", "ANI News", "The Print", "Hindustan Times"].map((media) => (
             <span key={media} className="font-black text-2xl italic tracking-tighter uppercase whitespace-nowrap">{media}</span>
           ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <img 
                src="/olympiad/logo.png" 
                alt="CREST & G Sun Logo" 
                className="h-12 w-auto object-contain brightness-0 invert" 
              />
              <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                CREST & G Sun<span className="text-[#ff9c00]">2026</span>
              </span>
            </Link>
            <p className="text-xs font-bold leading-relaxed mb-8 max-w-xs uppercase tracking-tight">
              Leading the way in global academic excellence through concept-based competitive learning.
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
              <li><Link href="#" className="hover:text-[#ff9c00] transition-colors">Exam Schedule</Link></li>
              <li><Link href="#olympiads" className="hover:text-[#ff9c00] transition-colors">Winter Olympiads</Link></li>
              <li><Link href="#olympiads" className="hover:text-[#ff9c00] transition-colors">Summer Olympiads</Link></li>
              <li><Link href="#awards" className="hover:text-[#ff9c00] transition-colors">Download Brochure</Link></li>
              <li><Link href="/gallery" className="hover:text-[#ff9c00] transition-colors">Event Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-10">Resources</h4>
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest">
              <li><Link href="#study" className="hover:text-[#ff9c00] transition-colors">Sample Papers</Link></li>
              <li><Link href="#study" className="hover:text-[#ff9c00] transition-colors">Answer Keys</Link></li>
              <li><Link href="#study" className="hover:text-[#ff9c00] transition-colors">Study Guides</Link></li>
              <li><Link href="#" className="hover:text-[#ff9c00] transition-colors">School Portal</Link></li>
              <li><Link href="#" className="hover:text-[#ff9c00] transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-10">Contact Support</h4>
            <ul className="space-y-8 text-sm font-bold">
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#ff9c00] shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[8px] text-white/40 uppercase mb-1 font-black">Email Official</p>
                  <p className="text-white text-xs">info@crestolympiads.com</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#2da3c2] shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[8px] text-white/40 uppercase mb-1 font-black">Hotline Support</p>
                  <p className="text-white text-xs">+91-9818294134</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#ff4d4d] shrink-0">
                  <Globe size={18} />
                </div>
                <div>
                  <p className="text-[8px] text-white/40 uppercase mb-1 font-black">Official Website</p>
                  <p className="text-white text-xs">crestolympiads.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
          <p>© {new Date().getFullYear()} CREST & G Sun Olympiads. Global Excellence.</p>
          <div className="flex gap-12">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
