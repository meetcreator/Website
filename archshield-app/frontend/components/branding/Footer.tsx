"use client";

import React from 'react';

const Footer = () => {
    return (
        <footer id="contact" className="py-[80px] pb-[40px] bg-black border-t border-white/10 mt-20">
            <div className="container mx-auto px-10 max-w-[1400px]">
                <div className="footer-top flex justify-between items-end pb-[60px] border-b border-white/10 mb-[40px] flex-col md:flex-row gap-10 md:gap-0">
                    <div className="footer-cta">
                        <span className="hero-label font-['Space_Grotesk'] uppercase tracking-[2px] text-[0.8rem] text-[#3b82f6] mb-[24px] block">Ready to Scale?</span>
                        <h2 className="text-[3rem] font-bold leading-[1.1] mb-[24px] text-white font-['Space_Grotesk']">Let's build your<br />infrastructure.</h2>
                    </div>
                    <a href="mailto:404notfoundany@gmail.com" className="btn inline-flex items-center justify-center padding-[16px_32px] font-['Space_Grotesk'] font-semibold text-[0.9rem] uppercase tracking-[1px] border border-white/20 bg-transparent text-white hover:bg-white hover:text-black transition-all">
                        404notfoundany@gmail.com
                    </a>
                </div>
                <div className="flex justify-between text-[#52525b] text-[0.8rem]">
                    <div>&copy; 2026 TINMCO Consultancy.</div>
                    <div>Designed for Authority.</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
