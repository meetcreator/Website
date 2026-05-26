"use client";

import { useState, useEffect } from "react";
import { b2bClients } from "@/lib/mockData";
import { ExternalLink, ShieldCheck, Plus, CheckCircle, Download, X, TrendingUp, DollarSign, Users, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import { useSocket } from "@/hooks/useSocket";

type Client = {
    name: string;
    value: number;
    growth: string;
};

export default function ClientMaster() {
    const [clients, setClients] = useState<Client[]>([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newClient, setNewClient] = useState({ name: "", value: "", growth: "" });
    const [exported, setExported] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const handleExport = () => {
        const csv = [
            "Client Name,Annual Contract Value ($),Growth",
            ...clients.map(c => `"${c.name}",${c.value},"${c.growth}"`),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "strategic_accounts.csv";
        a.click();
        URL.revokeObjectURL(url);
        setExported(true);
        setTimeout(() => setExported(false), 2000);
    };

    const fetchClients = () => {
        api.clients.getAll().then((data: any[]) => {
            if (data && Array.isArray(data)) {
                setClients(data.map((c: any) => ({
                    name: c.name,
                    value: c.value,
                    growth: c.growth
                })));
            }
        }).catch((err) => {
            console.error("Failed to fetch clients", err);
        });
    };

    useEffect(() => {
        fetchClients();
    }, []);

    useSocket((event) => {
        if (event.startsWith('client.')) {
            fetchClients();
        }
    });

    const handleAddClient = async () => {
        if (!newClient.name || !newClient.value) return;
        try {
            await api.clients.create({
                name: newClient.name,
                value: parseInt(newClient.value) * 1000,
                growth: newClient.growth || "+0%",
            });
            setNewClient({ name: "", value: "", growth: "" });
            setShowAdd(false);
        } catch (e) { console.error(e); }
    };

    const handleDeleteClient = async (name: string) => {
        try {
            await api.clients.delete(name);
            setSelectedClient(null);
        } catch (e) { console.error(e); }
    };

    return (
        <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-900 bg-slate-900/10 p-5 md:p-10">
            {/* Account Detail Modal */}
            {selectedClient && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedClient(null)}>
                    <div className="bg-slate-950 border border-slate-800 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6 md:mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center font-black text-xl md:text-2xl text-white shadow-lg flex-shrink-0">
                                    {selectedClient.name[0]}
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black tracking-tighter text-white">{selectedClient.name}</h3>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] md:text-[10px] font-black uppercase tracking-wider mt-1">
                                        <ShieldCheck size={10} /> Active Partner
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedClient(null)} className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8">
                            {[
                                { icon: <DollarSign size={18} />, label: "Annual Contract", value: `$${(selectedClient.value / 1000).toFixed(1)}k` },
                                { icon: <TrendingUp size={18} />, label: "Growth Rate", value: selectedClient.growth, green: selectedClient.growth.startsWith('+') },
                                { icon: <Users size={18} />, label: "Tier", value: "Enterprise" },
                                { icon: <Calendar size={18} />, label: "Renewal", value: "Q3 2026" },
                            ].map((stat, i) => (
                                <div key={i} className="p-4 md:p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1.5 md:mb-2">{stat.icon}<span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{stat.label}</span></div>
                                    <p className={`text-lg md:text-xl font-black tracking-tighter ${stat.green ? 'text-emerald-400' : 'text-white'}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => { alert(`Sending renewal notice to ${selectedClient.name}...`); setSelectedClient(null); }}
                                className="flex-1 py-3.5 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all text-sm"
                            >
                                Send Renewal Notice
                            </button>
                            <button
                                onClick={() => handleDeleteClient(selectedClient.name)}
                                className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl border border-rose-500/30 text-rose-400 font-bold hover:bg-rose-500/10 transition-all text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-10">
                <div>
                    <h3 className="text-xl md:text-2xl font-black tracking-tighter text-white">Strategic Account Registry</h3>
                    <p className="text-slate-500 text-xs md:text-sm font-light mt-1">{clients.length} active enterprise accounts</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    <button
                        onClick={handleExport}
                        className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-white"
                    >
                        {exported ? <CheckCircle size={16} className="text-emerald-400" /> : <Download size={16} />}
                        {exported ? "Exported!" : "Export Report"}
                    </button>
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="flex-1 lg:flex-none px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Add Account
                    </button>
                </div>
            </div>

            {showAdd && (
                <div className="mb-8 p-6 rounded-3xl border border-blue-500/20 bg-blue-500/5 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Company Name</label>
                            <input
                                value={newClient.name}
                                onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))}
                                placeholder="e.g. Apex Industries"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-white"
                            />
                        </div>
                        <div className="">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Value ($k)</label>
                            <input
                                type="number"
                                value={newClient.value}
                                onChange={e => setNewClient(p => ({ ...p, value: e.target.value }))}
                                placeholder="150"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-white"
                            />
                        </div>
                        <div className="">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Growth %</label>
                            <input
                                value={newClient.growth}
                                onChange={e => setNewClient(p => ({ ...p, growth: e.target.value }))}
                                placeholder="+10%"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-white"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAddClient} className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all">Create Account</button>
                        <button onClick={() => setShowAdd(false)} className="px-5 py-3 rounded-xl border border-slate-800 text-sm font-bold hover:bg-slate-800 transition-all text-white"><X size={16} /></button>
                    </div>
                </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-900">
                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Client Entity</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Annual Value</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Growth</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Status</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/50">
                        {clients.map((client, i) => (
                            <tr key={i} className="group hover:bg-white/5 transition-colors">
                                <td className="py-6 pr-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center font-bold text-slate-400 group-hover:from-blue-600 group-hover:to-blue-500 group-hover:text-white transition-all shadow-inner">
                                            {client.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold tracking-tight text-slate-200">{client.name}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-bold">Strategic Partner</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 pr-4">
                                    <span className="font-mono font-bold text-slate-300">${(client.value / 1000).toFixed(1)}k</span>
                                </td>
                                <td className="py-6 pr-4">
                                    <span className={`font-mono font-bold text-sm ${client.growth.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {client.growth}
                                    </span>
                                </td>
                                <td className="py-6 pr-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                                        <ShieldCheck size={12} /> Active
                                    </span>
                                </td>
                                <td className="py-6 text-right">
                                    <button
                                        onClick={() => setSelectedClient(client)}
                                        className="p-2 text-slate-500 hover:text-white transition-colors"
                                        title="View Account Details"
                                    >
                                        <ExternalLink size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {clients.map((client, i) => (
                    <div key={i} onClick={() => setSelectedClient(client)} className="p-5 rounded-2xl border border-slate-900 bg-slate-900/40 active:bg-slate-900 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-black text-slate-500 text-lg">
                                {client.name[0]}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base leading-tight">{client.name}</h4>
                                <div className="flex gap-3 mt-1">
                                    <span className="text-[10px] font-mono font-bold text-slate-400">${(client.value / 1000).toFixed(1)}k</span>
                                    <span className={`text-[10px] font-mono font-bold ${client.growth.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {client.growth}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded-lg text-slate-600">
                            <ExternalLink size={16} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
