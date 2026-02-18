"use client";

import React from 'react';
import Link from 'next/link';

const Header = () => {
    return (
        <header className="fixed top-0 w-full h-[80px] z-[1000] backdrop-blur-[10px] border-b border-white/10 flex items-center bg-[#030305]/80">
            <div className="container mx-auto px-10 max-w-[1400px]">
                <nav className="flex justify-between items-center w-full">
                    <div className="logo font-['Space_Grotesk'] text-[1.5rem] font-semibold tracking-[1px]">
                        <Link href="/" className="text-white">TINMCO</Link>
                    </div>
                    <div className="nav-links flex gap-[40px]">
                        <Link href="/#methodology" className="text-[0.85rem] uppercase tracking-[1px] text-[#a1a1aa] hover:text-white transition-colors">Methodology</Link>
                        <Link href="/#capabilities" className="text-[0.85rem] uppercase tracking-[1px] text-[#a1a1aa] hover:text-white transition-colors">Capabilities</Link>
                        <Link href="/#portfolio" className="text-[0.85rem] uppercase tracking-[1px] text-[#a1a1aa] hover:text-white transition-colors">Portfolio</Link>
                        <Link href="/#contact" className="text-[0.85rem] uppercase tracking-[1px] text-[#a1a1aa] hover:text-white transition-colors">Initiate</Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
