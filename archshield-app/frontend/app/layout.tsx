
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/branding/Header";
import Footer from "@/components/branding/Footer";
import HeroCanvas from "@/components/branding/HeroCanvas";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArchShield - AI-Powered Cloud Architecture Analysis",
  description: "Design, Analyze & Optimize Your Cloud Architecture with AI-driven insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#030305] text-[#ffffff] font-sans relative overflow-x-hidden`}
      >
        <HeroCanvas />
        <Header />
        <main className="relative z-10 pt-[80px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
