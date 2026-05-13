import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HOTS Olympiad Grade 1-8 | Higher Order Thinking Skills",
  description: "India's first integrated skill-based Olympiad assessing Logical Reasoning, Critical Thinking, Creativity, and more for Grades 1-8.",
};

export default function HOTSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
