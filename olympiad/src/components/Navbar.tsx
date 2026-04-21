"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { assetPath } from "@/lib/basePath";

const navLinks = [
  { name: "Home", href: "/", dropdown: false },
  { name: "About", href: "/#about", dropdown: false },
  {
    name: "Programs",
    href: "/#programs",
    dropdown: true,
    mega: true,
    sections: [
      {
        title: "GCO",
        items: [
          { name: "English", href: "/programs/gco/english" },
          { name: "Mathematics", href: "/programs/gco/math" },
          { name: "Science", href: "/programs/gco/science" },
        ]
      },
      {
        title: "HOTS Preschool",
        items: [
          { name: "Assignment Programs", href: "/programs/hots/preschool" },
        ]
      },
      {
        title: "HOTS (Grade 1-8)",
        isGrades: true,
        items: [1, 2, 3, 4, 5, 6, 7, 8].map(g => ({
          name: `Grade ${g}`,
          syllabus: `/programs/hots/grade-${g}/syllabus`,
          papers: `/programs/hots/grade-${g}/papers`
        }))
      }
    ]
  },
  {
    name: "Schools",
    href: "/#schools",
    dropdown: false,
  },
  { name: "Gallery", href: "/gallery", dropdown: false },
  { name: "Contact", href: "/#contact", dropdown: false },
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
              src={assetPath('/logo.png')}
              alt="Global Competency Olympiad Logo"
              className="h-12 md:h-16 w-auto object-contain transition-transform hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-lg font-black text-[#002d5b] tracking-tighter leading-none italic uppercase">GCO</span>
              <span className="text-[9px] font-bold text-red-600 tracking-[0.2em] leading-none text-center">OLYMPIAD</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4 lg:w-1/4 justify-end">
          <Link 
            href="/register" 
            className="hidden lg:block bg-[#002d5b] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#2da3c2] transition-colors"
          >
            School Registration
          </Link>
          <button
            className="lg:hidden text-[#002d5b]"
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
                className="nav-link text-[#002d5b] hover:text-[#2da3c2] text-[10px] font-black uppercase whitespace-nowrap px-4 py-2 flex items-center gap-1 transition-colors"
              >
                {link.name} {link.dropdown && <ChevronDown size={11} className={cn("text-slate-400 transition-transform", activeDropdown === link.name && "rotate-180")} />}
              </Link>

              <AnimatePresence>
                {link.dropdown && activeDropdown === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50",
                      link.mega ? "min-w-[700px]" : "min-w-[200px]"
                    )}
                  >
                    <div className="bg-white border border-slate-100 shadow-2xl rounded-3xl overflow-hidden p-6">
                      {(link as any).mega ? (
                        <div className="grid grid-cols-3 gap-8">
                          {(link as any).sections?.map((section: any) => (
                            <div key={section.title} className="flex flex-col gap-4">
                              <h3 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase border-b border-slate-50 pb-2">
                                {section.title}
                              </h3>
                              <div className="flex flex-col gap-3">
                                {section.isGrades ? (
                                  <div className="grid grid-cols-2 gap-4">
                                    {section.items.map((grade: any) => (
                                      <div key={grade.name} className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-[#002d5b]">{grade.name}</span>
                                        <div className="flex gap-2">
                                          <Link href={grade.syllabus} className="text-[9px] text-[#2da3c2] hover:text-[#002d5b] font-medium transition-colors">Syllabus</Link>
                                          <span className="text-slate-200">|</span>
                                          <Link href={grade.papers} className="text-[9px] text-[#2da3c2] hover:text-[#002d5b] font-medium transition-colors">Sample Papers</Link>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  section.items.map((item: any) => (
                                    <Link
                                      key={item.name}
                                      href={item.href}
                                      className="text-[10px] font-bold text-[#002d5b] hover:text-[#2da3c2] transition-colors"
                                    >
                                      {item.name}
                                    </Link>
                                  ))
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          {(link as any).items?.map((item: any) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="block px-4 py-3 text-[10px] font-bold text-[#002d5b] hover:bg-slate-50 hover:text-[#2da3c2] rounded-xl transition-all"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
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
                    <div className="pl-4 border-l-2 border-slate-50 flex flex-col gap-4 py-2">
                      {(link as any).mega ? (
                        (link as any).sections?.map((section: any) => (
                          <div key={section.title} className="flex flex-col gap-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{section.title}</span>
                            <div className="flex flex-col gap-2 pl-2">
                              {section.isGrades ? (
                                <div className="grid grid-cols-1 gap-3">
                                  {section.items.map((grade: any) => (
                                    <div key={grade.name} className="flex flex-col gap-1">
                                      <span className="text-xs font-bold text-[#002d5b]">{grade.name}</span>
                                      <div className="flex gap-3">
                                        <Link href={grade.syllabus} onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] text-[#2da3c2] font-bold">Syllabus</Link>
                                        <Link href={grade.papers} onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] text-[#2da3c2] font-bold">Sample Papers</Link>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                section.items.map((item: any) => (
                                  <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-xs font-bold text-slate-500"
                                  >
                                    {item.name}
                                  </Link>
                                ))
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        (link as any).items?.map((item: any) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-xs font-bold text-slate-500"
                          >
                            {item.name}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
              <Link 
                href="/register" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-[#002d5b] text-white px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-center mt-4"
              >
                Register Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
