import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OlympiadPro | Compete Globally, Excel Academically",
  description: "The premier international Olympiad platform for student and school registrations, mock tests, and global rankings in Math, Science, and more.",
  keywords: "olympiad, international exams, student registration, school registration, competitive exams, math olympiad, science olympiad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
