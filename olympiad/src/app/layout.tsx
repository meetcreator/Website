import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BASE_PATH } from "@/lib/basePath";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CREST & G Sun Olympiad | Compete Globally, Excel Academically",
  description: "The premier international Olympiad platform for student and school registrations, mock tests, and global rankings in Math, Science, and more.",
  keywords: "olympiad, international exams, student registration, school registration, competitive exams, math olympiad, science olympiad",
  icons: {
    icon: `${BASE_PATH}/logo.png`,
    apple: `${BASE_PATH}/logo.png`,
  },
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
