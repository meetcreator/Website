import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArchShield | Cloud Architecture Analysis",
  description: "AI-assisted cloud architecture review, recommendations, and design workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="shell nav-inner">
            <Link href="/" className="brand">
              <span className="mark">A</span>
              ArchShield
            </Link>
            <div className="nav-links">
              <Link href="/#features">Features</Link>
              <Link href="/#pricing">Pricing</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
