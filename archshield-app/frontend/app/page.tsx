
import Link from "next/link";
import { ArrowRight, Sparkles, Upload, Lock, DollarSign, TrendingUp, Cloud, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">AI-Powered Cloud Architecture Analysis</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Design, Analyze & Optimize
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Your Cloud Architecture
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Upload your existing infrastructure or design from scratch. Get AI-driven insights on security, scalability, cost optimization, and best practices across AWS, Azure, and GCP.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all">
                  Start Free Analysis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/dashboard/designer">
                <Button variant="outline" size="lg" className="border-slate-700 text-slate-200 hover:bg-slate-800/50 text-lg px-8 py-6 rounded-xl">
                  Try Designer
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">10K+</div>
                <div className="text-sm text-slate-400 mt-1">Architectures Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">98%</div>
                <div className="text-sm text-slate-400 mt-1">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">$2M+</div>
                <div className="text-sm text-slate-400 mt-1">Cost Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-slate-400 text-lg">Everything you need to build production-ready cloud architectures</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Upload, title: "Multi-Format Upload", desc: "Support for Terraform, CloudFormation, Kubernetes YAML, architecture diagrams, and more.", color: "blue" },
              { icon: Sparkles, title: "AI-Powered Analysis", desc: "Advanced AI detects anti-patterns, bottlenecks, and security vulnerabilities automatically.", color: "cyan" },
              { icon: Lock, title: "Security Hardening", desc: "Comprehensive security checks for IAM, encryption, network policies, and compliance.", color: "emerald" },
              { icon: DollarSign, title: "Cost Optimization", desc: "Identify over-provisioned resources and get recommendations to reduce cloud spending.", color: "purple" },
              { icon: TrendingUp, title: "Scalability Insights", desc: "Ensure your architecture can handle growth with auto-scaling and load balancing checks.", color: "orange" },
              { icon: Cloud, title: "Multi-Cloud Support", desc: "Works seamlessly with AWS, Azure, and GCP architectures in a unified platform.", color: "pink" }
            ].map((feature, i) => (
              <Card key={i} className={`bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 p-6 hover:border-${feature.color}-500/50 transition-all hover:shadow-lg hover:shadow-${feature.color}-500/20 group`}>
                <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/10 flex items-center justify-center mb-4 group-hover:bg-${feature.color}-500/20 transition-colors`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">How It Works</span>
            </h2>
            <p className="text-slate-400 text-lg">Get insights in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto text-2xl font-bold text-white shadow-lg shadow-blue-500/50">1</div>
              <h3 className="text-2xl font-semibold text-white">Upload or Design</h3>
              <p className="text-slate-400">Upload your existing IaC files or use our visual designer to create your architecture from scratch.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto text-2xl font-bold text-white shadow-lg shadow-purple-500/50">2</div>
              <h3 className="text-2xl font-semibold text-white">AI Analysis</h3>
              <p className="text-slate-400">Our AI engine analyzes your architecture across security, cost, performance, and reliability dimensions.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto text-2xl font-bold text-white shadow-lg shadow-emerald-500/50">3</div>
              <h3 className="text-2xl font-semibold text-white">Get Recommendations</h3>
              <p className="text-slate-400">Receive actionable recommendations with side-by-side comparisons and implementation guides.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Simple Pricing</span>
            </h2>
            <p className="text-slate-400 text-lg">Choose the plan that's right for your scale</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="rounded-xl border shadow-sm p-8 border-white/10 bg-slate-900 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
              <div className="text-3xl font-bold text-white mb-4">$0<span className="text-sm font-normal text-slate-500">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                {[1, 2, 3].map((f) => (
                  <li key={f} className="text-sm text-slate-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    Feature {f} for Starter
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full bg-white/5 hover:bg-white/10">Get Started</Button>
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="rounded-xl border shadow-sm p-8 bg-slate-900 flex flex-col border-blue-500/50 ring-1 ring-blue-500/50 scale-105 z-10">
              <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
              <div className="text-3xl font-bold text-white mb-4">$49<span className="text-sm font-normal text-slate-500">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                {[1, 2, 3].map((f) => (
                  <li key={f} className="text-sm text-slate-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    Feature {f} for Professional
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full bg-blue-500 hover:bg-blue-600">Get Started</Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-xl border shadow-sm p-8 border-white/10 bg-slate-900 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-white mb-4">Custom<span className="text-sm font-normal text-slate-500">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                {[1, 2, 3].map((f) => (
                  <li key={f} className="text-sm text-slate-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    Feature {f} for Enterprise
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full bg-white/5 hover:bg-white/10">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 border-0 p-12 text-center shadow-2xl shadow-blue-500/50">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to Optimize Your Cloud?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of architects and engineers who trust ArchShield to build better cloud infrastructures.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8 py-6 rounded-xl shadow-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
