import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GCO Olympiad | Global Competency Olympiad for Preschool",
  description: "A first-of-its-kind skill-based Olympiad specially designed for preschool learners in Nursery, Junior KG, and Senior KG.",
};

export default function GCOLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
