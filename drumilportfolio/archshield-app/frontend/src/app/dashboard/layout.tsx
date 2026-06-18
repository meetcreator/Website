import Link from "next/link";

const links = [
  ["Overview", "/dashboard"],
  ["Analyze", "/dashboard/analyze"],
  ["Designer", "/dashboard/designer"],
  ["Recommendations", "/dashboard/recommendations"],
  ["History", "/dashboard/history"],
  ["Settings", "/dashboard/settings"],
  ["Help", "/dashboard/help"],
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="dashboard">
      <aside className="sidebar">
        {links.map(([label, href]) => (
          <Link href={href} key={href}>{label}</Link>
        ))}
      </aside>
      <section className="content">{children}</section>
    </main>
  );
}
