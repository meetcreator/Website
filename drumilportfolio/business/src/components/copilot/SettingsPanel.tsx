"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Save, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

type Setting = { key: string; label: string; description: string; type: "toggle" | "number" | "currency"; unit?: string };

const SETTINGS: Setting[] = [
    { key: "currentBalance", label: "Current Cash Balance", description: "Starting balance used for 30/60/90-day projections (Module 3).", type: "currency" },
    { key: "autoFollowUp", label: "Auto-Send Follow-Ups", description: "When ON, approved follow-up drafts send automatically. Default: OFF (manual approval required).", type: "toggle" },
    { key: "autoProcurement", label: "Auto-Send Purchase Orders", description: "When ON, approved PO drafts send automatically. Default: OFF.", type: "toggle" },
    { key: "followUpStaleDays", label: "Follow-Up Threshold (days)", description: "Orders older than this without contact trigger a follow-up task.", type: "number", unit: "days" },
    { key: "priceDeviationThreshold", label: "Price Deviation Alert (%)", description: "Supplier quotes above this % over 90-day avg get flagged.", type: "number", unit: "%" },
    { key: "churnRiskThreshold", label: "Churn Risk Threshold (score)", description: "Accounts scoring below this trigger a retention suggestion.", type: "number", unit: "/100" },
];

export default function SettingsPanel() {
    const [values, setValues] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        api.settings.get()
            .then(setValues)
            .catch(() => setValues({}))
            .finally(() => setLoading(false));
    }, []);

    const save = async () => {
        setSaving(true);
        try {
            await api.settings.update(values);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="h-64 bg-slate-100 rounded-3xl animate-pulse" />;

    return (
        <div className="max-w-2xl space-y-6 font-sans">
            <div className="flex items-center gap-2 mb-6">
                <Settings size={18} className="text-blue-500" />
                <h3 className="text-xl font-black tracking-tight text-slate-900">Co-Pilot Settings</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-auto">Tenant-level</span>
            </div>

            <div className="space-y-3">
                {SETTINGS.map((s, i) => (
                    <motion.div key={s.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center gap-4"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-slate-900">{s.label}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{s.description}</p>
                        </div>

                        {s.type === "toggle" ? (
                            <button
                                onClick={() => setValues(v => ({ ...v, [s.key]: !v[s.key] }))}
                                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${values[s.key] ? "bg-blue-600" : "bg-slate-700"}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${values[s.key] ? "translate-x-5" : "translate-x-0"}`} />
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 shrink-0">
                                <input
                                    type="number"
                                    value={values[s.key] ?? ""}
                                    onChange={e => setValues(v => ({ ...v, [s.key]: parseFloat(e.target.value) || 0 }))}
                                    className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 text-right focus:outline-none focus:border-blue-500"
                                />
                                {s.unit && <span className="text-[10px] text-slate-500 font-bold">{s.unit}</span>}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <button
                onClick={save}
                disabled={saving}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm font-black text-white transition-all flex items-center justify-center gap-2"
            >
                {saved ? <><CheckCircle size={16} /> Saved</> : saving ? "Saving..." : <><Save size={16} /> Save Settings</>}
            </button>
        </div>
    );
}
