"use client";

import { useState } from "react";
import { b2cSegments } from "@/lib/mockData";
import { Users, Heart, Zap, UserX, CheckCircle, Download } from "lucide-react";
import { api } from "@/lib/api";

export default function CustomerSegments() {
    const icons = [<Heart key="h" />, <Zap key="z" />, <Users key="u" />, <UserX key="x" />];
    const [campaignSent, setCampaignSent] = useState(false);
    const [exported, setExported] = useState(false);

    const handleDeployCampaign = async () => {
        try {
            await api.analytics.deployCampaign({ name: "Churn Reduction", segment: "At Risk Cohort" });
            setCampaignSent(true);
            setTimeout(() => setCampaignSent(false), 3000);
        } catch (e) { console.error(e); }
    };

    const handleExportSegments = () => {
        // Generate CSV from segment data
        const csv = [
            "Segment,Percentage,Estimated Users",
            ...b2cSegments.map(s => `${s.name},${s.value}%,${Math.floor(Math.random() * 5000 + 1000)}`),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "customer_segments.csv";
        a.click();
        URL.revokeObjectURL(url);

        setExported(true);
        setTimeout(() => setExported(false), 2000);
    };

    return (
        <div className="rounded-[2.5rem] border border-slate-900 bg-slate-900/10 p-10">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-2xl font-black tracking-tighter">Behavioral Cohorts</h3>
                    <p className="text-slate-500 text-sm font-light mt-1">Lifecycle segmentation and churn probability</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExportSegments}
                        className="px-5 py-2 rounded-xl border border-slate-800 text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                        {exported ? <CheckCircle size={14} className="text-emerald-400" /> : <Download size={14} />}
                        {exported ? "Exported!" : "Export Segments"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {b2cSegments.map((segment, i) => (
                    <div key={i} className="p-8 rounded-[2rem] border border-slate-900 bg-slate-900/30 hover:bg-slate-900/50 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-[4rem]"></div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg" style={{ backgroundColor: `${segment.color}15`, color: segment.color }}>
                                {icons[i] || <Users />}
                            </div>

                            <h4 className="text-lg font-black tracking-tight mb-1">{segment.name}</h4>
                            <p className="text-3xl font-black tracking-tighter mb-4">{segment.value}%</p>

                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <span>Reach: {(segment.value * 120).toLocaleString()} users</span>
                                <span className="text-emerald-400">+2.4%</span>
                            </div>

                            <div className="mt-8 w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${segment.value}%`, backgroundColor: segment.color }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 p-8 rounded-[2rem] border border-dashed border-slate-800 bg-slate-900/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <Zap size={32} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg tracking-tight text-white underline decoration-indigo-500 decoration-2 underline-offset-4">AI Insight: High Churn Risk</h4>
                        <p className="text-slate-500 text-sm mt-1 max-w-md">Our predictive model identified 124 users in the "At Risk" segment with high cart abandonment rates today. Recommended action: 15% discount push notification.</p>
                    </div>
                </div>
                <button
                    onClick={handleDeployCampaign}
                    className="px-8 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 whitespace-nowrap flex items-center gap-2"
                >
                    {campaignSent ? (
                        <><CheckCircle size={18} /> Campaign Deployed!</>
                    ) : (
                        "Deploy Campaign"
                    )}
                </button>
            </div>
        </div>
    );
}
