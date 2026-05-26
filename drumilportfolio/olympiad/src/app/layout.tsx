import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BASE_PATH } from "@/lib/basePath";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Global Competency Olympiad | Early Skill Development",
  description: "A comprehensive platform to build strong foundations in Literacy, Numeracy, and Science for young learners in Nursery, Junior KG, and Senior KG.",
  keywords: "global competency olympiad, literacy olympiad, numeracy olympiad, science olympiad, early skill development, nursery, jr kg, sr kg",
  icons: {
    icon: `${BASE_PATH}/logo.png`,
    apple: `${BASE_PATH}/logo.png`,
  },
};

import { WhatsAppButton } from "@/components/Announcement";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
