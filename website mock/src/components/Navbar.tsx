"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe, User, Share2, ChevronDown, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/", dropdown: false },
  { name: "About", href: "#about", dropdown: false },
  {
    name: "Olympiads",
    href: "#olympiads",
    dropdown: true,
    items: [
      { name: "Mathematics (CMO)", href: "#" },
      { name: "Science (CSO)", href: "#" },
      { name: "English (CEO)", href: "#" },
      { name: "Reasoning (CRO)", href: "#" },
      { name: "Cyber (CCO)", href: "#" },
      { name: "Spell Bee (CSBW)", href: "#" },
    ],
  },
  { name: "Exam Details", href: "#exams", dropdown: false },
  { name: "Awards", href: "#awards", dropdown: false },
  { name: "Study Material", href: "#study", dropdown: false },
  { name: "Register", href: "/register", dropdown: false },
  { name: "Contact", href: "#contact", dropdown: false },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300",
      isScrolled ? "shadow-md" : ""
    )}>
      {/* Top Header: Logo (Center) and Socials (Right) */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-50 relative">
        <div className="lg:w-1/4"></div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/GALLERY/logo.png" 
              alt="CREST & G Sun Logo" 
              className="h-12 md:h-16 w-auto object-contain transition-transform hover:scale-105"
            />
            <div className="flex flex-col">
                <span className="text-lg font-black text-[#002d5b] tracking-tighter leading-none italic uppercase">CREST & G Sun</span>
                <span className="text-[9px] font-bold text-red-600 tracking-[0.2em] leading-none text-center">OLYMPIADS</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4 lg:w-1/4 justify-end">
          <a href="#" className="hover:text-secondary text-primary transition-colors">
            <div className="w-6 h-6 bg-[#002d5b] rounded-sm flex items-center justify-center text-white p-1">
              <Share2 size={14} fill="white" />
            </div>
          </a>
          <a href="#" className="hover:text-secondary text-primary transition-colors">
            <div className="w-6 h-6 bg-[#002d5b] rounded-sm flex items-center justify-center text-white p-1">
              <Camera size={14} />
            </div>
          </a>

          <button
            className="lg:hidden text-foreground ml-4"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="hidden lg:flex justify-center py-4 bg-white shadow-sm border-t border-slate-50">
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative group"
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                className="nav-link text-[#002d5b] hover:text-[#2da3c2] text-[10px] font-black uppercase whitespace-nowrap px-3 py-2 flex items-center gap-1 transition-colors"
              >
                {link.name} {link.dropdown && <ChevronDown size={11} className={cn("text-slate-400 transition-transform", activeDropdown === link.name && "rotate-180")} />}
              </Link>

              <AnimatePresence>
                {link.dropdown && activeDropdown === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 min-w-[220px]"
                  >
                    <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden p-2">
                      {link.items?.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-3 text-[10px] font-bold text-[#002d5b] hover:bg-slate-50 hover:text-[#2da3c2] rounded-xl transition-all"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
                      className="text-sm font-bold uppercase text-[#002d5b]"
                    >
                      {link.name}
                    </Link>
                    {link.dropdown && (
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                        className="p-2"
                      >
                        <ChevronDown size={18} className={cn("text-slate-400 transition-transform", activeDropdown === link.name && "rotate-180")} />
                      </button>
                    )}
                  </div>

                  {link.dropdown && activeDropdown === link.name && (
                    <div className="pl-4 border-l-2 border-slate-50 flex flex-col gap-3 py-2">
                      {link.items?.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-xs font-bold text-slate-500 hover:text-secondary"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
