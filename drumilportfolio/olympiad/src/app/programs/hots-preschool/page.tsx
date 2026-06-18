"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Brain, Lightbulb, Search, Palette, Star, CheckCircle2, ChevronRight } from "lucide-react";
import SamplePapersSyllabus from "@/components/SamplePapersSyllabus";

// ─── Data ────────────────────────────────────────────────────────────────────

const hotsSkills = [
  "Think critically",
  "Solve problems",
  "Observe carefully",
  "Make decisions",
  "Express creativity",
  "Analyze situations",
  "Apply learning in real-life contexts",
];

const classStructure = [
  {
    cls: "Nursery",
    focus: ["Observe", "Identify", "Match", "Explore"],
    color: "bg-pink-50 border-pink-200",
    accent: "text-pink-500",
    badge: "bg-pink-100 text-pink-700",
  },
  {
    cls: "Jr. KG",
    focus: ["Compare", "Classify", "Predict", "Solve"],
    color: "bg-violet-50 border-violet-200",
    accent: "text-violet-500",
    badge: "bg-violet-100 text-violet-700",
  },
  {
    cls: "Sr. KG",
    focus: ["Analyze", "Reason", "Create", "Decision Making"],
    color: "bg-amber-50 border-amber-200",
    accent: "text-amber-500",
    badge: "bg-amber-100 text-amber-700",
  },
];

const bloomsLevels = [
  {
    icon: <Brain size={28} />,
    emoji: "🧠",
    title: "Remembering",
    subtitle: "\"I Can Recall and Recognize\"",
    desc: "This level develops a child's ability to remember, identify, and recall information.",
    skills: [
      "Recognizing objects",
      "Naming pictures",
      "Recalling facts",
      "Identifying colors, shapes, numbers, and letters",
      "Remembering sequences",
    ],
    classBreakdown: [
      { cls: "Nursery", detail: "Identify animals, fruits, colors · Recall rhymes and sounds" },
      { cls: "Jr. KG", detail: "Recognize patterns and symbols · Recall simple instructions" },
      { cls: "Sr. KG", detail: "Remember story details · Recall number concepts and vocabulary" },
    ],
    samples: [
      "\"What color is the apple?\"",
      "\"Can you name this animal?\"",
      "\"What comes after 5?\"",
    ],
    color: "from-pink-500 to-rose-500",
    light: "bg-pink-50",
    border: "border-pink-200",
    accent: "text-pink-600",
    badgeBg: "bg-pink-100",
  },
  {
    icon: <Lightbulb size={28} />,
    emoji: "💡",
    title: "Understanding",
    subtitle: "\"I Can Explain and Understand\"",
    desc: "This level checks whether children understand meaning and can explain ideas in simple ways.",
    skills: [
      "Explaining ideas",
      "Matching and classifying",
      "Comparing objects",
      "Following instructions",
      "Understanding relationships",
    ],
    classBreakdown: [
      { cls: "Nursery", detail: "Match related objects · Understand simple concepts like big-small" },
      { cls: "Jr. KG", detail: "Compare objects · Explain everyday situations" },
      { cls: "Sr. KG", detail: "Sequence events · Explain why something happens" },
    ],
    samples: [
      "\"Why do we wear raincoats?\"",
      "\"Which objects belong together?\"",
      "\"How are these two pictures different?\"",
    ],
    color: "from-violet-500 to-purple-500",
    light: "bg-violet-50",
    border: "border-violet-200",
    accent: "text-violet-600",
    badgeBg: "bg-violet-100",
  },
  {
    icon: <Search size={28} />,
    emoji: "🔍",
    title: "Analysing",
    subtitle: "\"I Can Think and Solve\"",
    desc: "This level develops logical reasoning, observation, and problem-solving abilities.",
    skills: [
      "Finding patterns",
      "Identifying differences",
      "Sequencing",
      "Problem-solving",
      "Cause-and-effect reasoning",
      "Decision making",
    ],
    classBreakdown: [
      { cls: "Nursery", detail: "Spot the difference · Complete simple patterns" },
      { cls: "Jr. KG", detail: "Identify odd one out · Arrange pictures in order" },
      { cls: "Sr. KG", detail: "Solve situational problems · Predict outcomes · Analyze picture scenarios" },
    ],
    samples: [
      "\"Which picture does not belong?\"",
      "\"What will happen next?\"",
      "\"How can we solve this problem?\"",
    ],
    color: "from-amber-500 to-orange-500",
    light: "bg-amber-50",
    border: "border-amber-200",
    accent: "text-amber-600",
    badgeBg: "bg-amber-100",
  },
  {
    icon: <Palette size={28} />,
    emoji: "🎨",
    title: "Creativity",
    subtitle: "\"I Can Imagine and Create\"",
    desc: "This level encourages imagination, innovation, and original thinking.",
    skills: [
      "Creative drawing",
      "Story creation",
      "Open-ended thinking",
      "Multiple solutions",
      "Imaginative responses",
    ],
    classBreakdown: [
      { cls: "Nursery", detail: "Complete picture drawing · Pretend play ideas" },
      { cls: "Jr. KG", detail: "Create endings to stories · Think of new uses for objects" },
      { cls: "Sr. KG", detail: "Design solutions · Invent ideas · Express independent thinking" },
    ],
    samples: [
      "\"Draw what you see in the sky.\"",
      "\"What can you make using a box?\"",
      "\"Imagine you could fly — where would you go?\"",
    ],
    color: "from-teal-500 to-emerald-500",
    light: "bg-teal-50",
    border: "border-teal-200",
    accent: "text-teal-600",
    badgeBg: "bg-teal-100",
  },
];

const assessmentTable = [
  {
    area: "Remembering",
    nursery: "Recognition & Recall",
    jrKg: "Recall & Identification",
    srKg: "Memory & Application",
  },
  {
    area: "Understanding",
    nursery: "Matching & Meaning",
    jrKg: "Comparing & Explaining",
    srKg: "Interpreting & Sequencing",
  },
  {
    area: "Analysing",
    nursery: "Observation",
    jrKg: "Logical Reasoning",
    srKg: "Problem Solving",
  },
  {
    area: "Creativity",
    nursery: "Imagination",
    jrKg: "Innovation",
    srKg: "Independent Creation",
  },
];

const benefits = [
  {
    title: "For Children",
    color: "bg-pink-50 border-pink-200",
    accent: "text-pink-600",
    dot: "bg-pink-500",
    items: [
      "Encourages confidence and curiosity",
      "Develops independent thinking",
      "Enhances creativity and communication",
      "Builds school readiness and life skills",
    ],
  },
  {
    title: "For Schools",
    color: "bg-violet-50 border-violet-200",
    accent: "text-violet-600",
    dot: "bg-violet-500",
    items: [
      "Innovative assessment framework",
      "NEP 2020 aligned approach",
      "Skill-based evaluation system",
      "Parent-friendly developmental reports",
    ],
  },
  {
    title: "For Parents",
    color: "bg-amber-50 border-amber-200",
    accent: "text-amber-600",
    dot: "bg-amber-500",
    items: [
      "Understand child's thinking abilities",
      "Identify strengths and growth areas",
      "Support learning at home effectively",
    ],
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HOTSPreschoolPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-40 pb-20 bg-pink-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-pink-200/20 -skew-x-12 translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <span className="text-pink-500 font-black uppercase tracking-widest text-xs mb-4 block">
              Inner Space — Early Childhood Development
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-[#002d5b] italic leading-none mb-6">
              Assessing Higher <br />
              <span className="text-pink-500">Order Thinking</span>
            </h1>
            <p className="text-slate-600 font-semibold text-xl md:text-2xl mb-4 leading-relaxed">
              Empowering Preschoolers to Explore, Question, and Innovate!
            </p>
            <p className="text-slate-500 text-base md:text-lg mb-10 leading-relaxed max-w-2xl">
              At Inner Space, we believe every child is naturally curious, creative, and capable of
              deep thinking. Early childhood is the ideal stage to nurture these abilities through
              meaningful experiences.
            </p>

            {/* Aligned with */}
            <div className="flex flex-wrap gap-3">
              {["NEP 2020", "Bloom's Taxonomy", "Panchakosha Framework", "Foundational Learning Goals"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full bg-white border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wide shadow-sm"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── What are HOTS? ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-pink-500 font-black uppercase tracking-widest text-xs mb-4 block">
                About The Program
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic mb-6 leading-tight">
                What are Higher Order <span className="text-pink-500">Thinking Skills?</span>
              </h2>
              <p className="text-slate-500 text-base mb-8 leading-relaxed">
                Higher Order Thinking Skills go beyond rote learning and memorization. They prepare
                children to become confident learners, innovators, and future-ready thinkers.
              </p>
              <ul className="space-y-3">
                {hotsSkills.map((skill) => (
                  <li key={skill} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 size={18} className="text-pink-500 shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Levels card */}
            <div className="space-y-6">
              <div className="p-8 rounded-3xl border border-slate-100 bg-slate-50 shadow-sm">
                <h3 className="text-[#002d5b] font-black text-xl uppercase italic tracking-tighter mb-6">
                  Levels of Assessment
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      level: "Basic Level",
                      purpose: "Foundational thinking and understanding",
                      who: "All preschool learners",
                      color: "bg-pink-100 text-pink-700",
                    },
                    {
                      level: "Advanced Level",
                      purpose: "Deeper reasoning, creativity, and problem solving",
                      who: "Children ready for higher challenge",
                      color: "bg-violet-100 text-violet-700",
                    },
                  ].map((l) => (
                    <div
                      key={l.level}
                      className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs"
                    >
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide self-start shrink-0 ${l.color}`}
                      >
                        {l.level}
                      </span>
                      <div>
                        <p className="text-[#002d5b] font-bold text-sm">{l.purpose}</p>
                        <p className="text-slate-400 text-xs mt-1">Suitable for: {l.who}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Classes */}
              <div className="grid grid-cols-3 gap-4">
                {classStructure.map((c) => (
                  <div
                    key={c.cls}
                    className={`p-5 rounded-2xl border ${c.color} text-center`}
                  >
                    <p className={`font-black text-sm mb-3 ${c.accent}`}>{c.cls}</p>
                    <div className="flex flex-col gap-1">
                      {c.focus.map((f) => (
                        <span
                          key={f}
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bloom's Levels ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-pink-500 font-black uppercase tracking-widest text-xs mb-4 block">
              Program Structure
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic mb-4 leading-tight">
              Four Cognitive <span className="text-pink-500">Domains</span>
            </h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto">
              Aligned with Bloom&apos;s Taxonomy, each domain builds progressively across Nursery, Jr. KG, and Sr. KG.
            </p>
          </div>

          <div className="space-y-10">
            {bloomsLevels.map((level, i) => (
              <div
                key={level.title}
                className={`rounded-3xl border ${level.border} ${level.light} overflow-hidden`}
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${level.color} p-6 flex items-center gap-4`}>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white shrink-0">
                    {level.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-white/80 text-sm font-bold">
                        {i + 1}.
                      </span>
                      <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter">
                        {level.emoji} {level.title}
                      </h3>
                    </div>
                    <p className="text-white/80 text-sm italic">{level.subtitle}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 grid lg:grid-cols-3 gap-8">
                  {/* Skills */}
                  <div>
                    <h4 className={`font-black text-xs uppercase tracking-widest ${level.accent} mb-4`}>
                      Skills Included
                    </h4>
                    <p className="text-slate-600 text-sm mb-4">{level.desc}</p>
                    <ul className="space-y-2">
                      {level.skills.map((s) => (
                        <li key={s} className="flex items-center gap-2 text-slate-700 text-sm">
                          <ChevronRight size={14} className={level.accent} />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Class breakdown */}
                  <div>
                    <h4 className={`font-black text-xs uppercase tracking-widest ${level.accent} mb-4`}>
                      Class-Wise Focus
                    </h4>
                    <div className="space-y-3">
                      {level.classBreakdown.map((cb) => (
                        <div key={cb.cls} className="bg-white rounded-xl p-4 border border-white/80 shadow-xs">
                          <span className={`text-xs font-black uppercase ${level.accent}`}>{cb.cls}</span>
                          <p className="text-slate-600 text-xs mt-1 leading-relaxed">{cb.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample questions */}
                  <div>
                    <h4 className={`font-black text-xs uppercase tracking-widest ${level.accent} mb-4`}>
                      Sample Questions
                    </h4>
                    <div className="space-y-3">
                      {level.samples.map((q) => (
                        <div
                          key={q}
                          className={`${level.badgeBg} rounded-xl p-4 text-sm font-semibold text-slate-700 flex gap-2`}
                        >
                          <span className="shrink-0">👉</span>
                          {q}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Assessment Structure Table ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-pink-500 font-black uppercase tracking-widest text-xs mb-4 block">
              Curriculum Map
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] italic mb-4">
              Assessment Structure <span className="text-pink-500">by Level</span>
            </h2>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#002d5b] text-white">
                  <th className="px-6 py-5 text-left font-black uppercase tracking-wider rounded-tl-3xl">
                    Cognitive Area
                  </th>
                  <th className="px-6 py-5 text-left font-black uppercase tracking-wider">Nursery</th>
                  <th className="px-6 py-5 text-left font-black uppercase tracking-wider">Jr. KG</th>
                  <th className="px-6 py-5 text-left font-black uppercase tracking-wider rounded-tr-3xl">
                    Sr. KG
                  </th>
                </tr>
              </thead>
              <tbody>
                {assessmentTable.map((row, i) => (
                  <tr
                    key={row.area}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <td className="px-6 py-4 font-black text-[#002d5b] uppercase italic tracking-tighter">
                      {row.area}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{row.nursery}</td>
                    <td className="px-6 py-4 text-slate-600">{row.jrKg}</td>
                    <td className="px-6 py-4 text-slate-600">{row.srKg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Basic vs Advanced */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {[
              {
                level: "Basic Level",
                focus: "Recognition, understanding, and guided thinking",
                components: ["Remembering ✔", "Understanding ✔", "Analyzing ✔", "Creativity ✔"],
                color: "border-pink-200 bg-pink-50",
                accent: "text-pink-600",
                badge: "bg-pink-100 text-pink-700",
              },
              {
                level: "Advanced Level",
                focus: "Analytical thinking, creativity, and independent problem-solving",
                components: ["Remembering ✔✔", "Understanding ✔✔", "Analyzing ✔✔✔", "Creativity ✔✔✔"],
                color: "border-violet-200 bg-violet-50",
                accent: "text-violet-600",
                badge: "bg-violet-100 text-violet-700",
              },
            ].map((l) => (
              <div key={l.level} className={`p-8 rounded-3xl border ${l.color}`}>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${l.badge}`}>
                  {l.level}
                </span>
                <p className="text-slate-600 text-sm mt-4 mb-6">{l.focus}</p>
                <div className="space-y-2">
                  {l.components.map((c) => (
                    <div key={c} className="flex items-center gap-3">
                      <Star size={14} className={l.accent} />
                      <span className={`font-semibold text-sm ${l.accent}`}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-24 bg-[#002d5b] text-white rounded-[4rem] mx-4 md:mx-10 mb-24 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black italic mb-4 leading-tight">
              Benefits of the <span className="text-pink-400">Program</span>
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Transforming learning outcomes for every stakeholder in a child&apos;s journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <h3 className="font-black text-xl uppercase italic tracking-tighter text-white mb-6">
                  {b.title}
                </h3>
                <ul className="space-y-3">
                  {b.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                      <CheckCircle2 size={16} className="text-pink-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Papers & Syllabus ── */}
      <SamplePapersSyllabus
        programName="HOTS Preschool"
        samplePapers={[
          { grade: "Nursery", link: "#" },
          { grade: "Junior KG", link: "/olympiad/sample_papers/hots_junior_kg.pdf" },
          { grade: "Senior KG", link: "/olympiad/sample_papers/hots_senior_kg.pdf" },
          { grade: "Sample Report", link: "/olympiad/sample_papers/sample_report.pdf" },
        ]}
        themeColor="#ec4899"
      />

      <Footer />
    </main>
  );
}
