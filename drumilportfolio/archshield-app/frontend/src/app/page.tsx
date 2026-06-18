import Link from "next/link";

const features = [
  ["Multi-format upload", "Review Terraform, CloudFormation, Kubernetes manifests, and diagrams from one workflow."],
  ["AI-powered analysis", "Surface security gaps, cost drift, reliability issues, and scaling risks before production."],
  ["Actionable recommendations", "Turn findings into prioritized remediation tasks with practical implementation notes."],
];

const plans = ["Starter", "Professional", "Enterprise"];

export default function Home() {
  return (
    <main>
      <section className="shell hero">
        <span className="eyebrow">AI-powered cloud architecture analysis</span>
        <h1>Design, analyze, and optimize your cloud architecture</h1>
        <p className="lead">
          Upload existing infrastructure or design from scratch. ArchShield helps teams improve security, scalability,
          cost, and reliability across AWS, Azure, and GCP.
        </p>
        <div className="actions">
          <Link href="/dashboard" className="button">Start Free Analysis</Link>
          <Link href="/dashboard/designer" className="button secondary">Try Designer</Link>
        </div>
      </section>

      <section className="shell stats">
        <div className="stat"><strong>10K+</strong><span>Architectures analyzed</span></div>
        <div className="stat"><strong>98%</strong><span>Recommendation accuracy</span></div>
        <div className="stat"><strong>$2M+</strong><span>Estimated savings found</span></div>
      </section>

      <section id="features" className="shell section">
        <h2>Powerful Features</h2>
        <div className="grid">
          {features.map(([title, body]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="shell section">
        <h2>Simple Pricing</h2>
        <div className="grid">
          {plans.map((plan) => (
            <article className="card" key={plan}>
              <h3>{plan}</h3>
              <p>{plan === "Enterprise" ? "Custom" : plan === "Professional" ? "$49/mo" : "$0/mo"}</p>
              <Link href="/dashboard" className="button secondary">Get Started</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
