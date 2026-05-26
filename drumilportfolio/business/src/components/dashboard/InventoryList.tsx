"use client";

import { useState, useEffect } from "react";
import { Package, AlertTriangle, RefreshCw, Layers, Plus, CheckCircle, Loader2, Minus, Trash2, X, Download } from "lucide-react";
import { api } from "@/lib/api";
import { useSocket } from "@/hooks/useSocket";

const mockInventory = [
    { id: "PR-1024", name: "Executive Suite A1", stock: 12, minStock: 20, turnover: "4.2x", status: "low" },
    { id: "PR-2048", name: "Cloud Enterprise License", stock: 842, minStock: 100, turnover: "12.5x", status: "ok" },
    { id: "PR-3072", name: "Premium Support Unit", stock: 45, minStock: 50, turnover: "2.8x", status: "critical" },
    { id: "PR-4096", name: "Infrastructure Node B", stock: 124, minStock: 80, turnover: "8.1x", status: "ok" },
];

type InventoryItem = {
    id: string;
    name: string;
    stock: number;
    minStock: number;
    turnover: string;
    status: string;
};

export default function InventoryList() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [restocking, setRestocking] = useState(false);
    const [success, setSuccess] = useState("");
    const [showNewEntry, setShowNewEntry] = useState(false);
    const [newItem, setNewItem] = useState({ name: "", stock: "", minStock: "" });
    const [adjustingId, setAdjustingId] = useState<string | null>(null);

    const fetchInventory = () => {
        api.inventory.getAll()
            .then((data: any[]) => {
                const mapped = data.map((item: any) => ({
                    id: item.product?.id || item.id || item.product?.sku || "N/A",
                    name: item.product?.name || item.name || "Unknown",
                    stock: item.quantity ?? item.stock ?? 0,
                    minStock: item.minThreshold ?? item.minStock ?? 10,
                    turnover: item.turnover || "N/A",
                    status: (item.quantity ?? item.stock ?? 0) < (item.minThreshold ?? item.minStock ?? 10) ? "critical" : "ok",
                }));
                setInventory(mapped);
            })
            .catch((err) => {
                console.error("Failed to fetch inventory", err);
            });
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    useSocket((event) => {
        if (event.startsWith('inventory.')) {
            fetchInventory();
        }
    });

    const recalcStatus = (stock: number, minStock: number): string => {
        if (stock <= 0) return "critical";
        if (stock < minStock) return stock < minStock * 0.5 ? "critical" : "low";
        return "ok";
    };

    const handleRestockAll = async () => {
        setRestocking(true);
        try {
            await api.inventory.restockAll();
            setSuccess("All low-stock items have been restocked!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setRestocking(false);
        }
    };

    const handleAdjustStock = async (id: string, delta: number) => {
        setAdjustingId(id);
        try {
            await api.inventory.updateStock(id, delta);
        } catch (err) {
            console.error(err);
        } finally {
            setAdjustingId(null);
        }
    };

    const handleDeleteItem = async (id: string) => {
        try {
            await api.inventory.delete(id);
            setInventory(prev => prev.filter(item => item.id !== id));
            setSuccess("Item removed from inventory.");
            setTimeout(() => setSuccess(""), 2000);
        } catch (e) {
            console.error("Failed to delete item", e);
        }
    };

    const handleAddEntry = async () => {
        if (!newItem.name || !newItem.stock) return;
        const stockNum = parseInt(newItem.stock);
        const minStockNum = parseInt(newItem.minStock) || 10;

        try {
            await api.inventory.create({
                name: newItem.name,
                stock: stockNum,
                minStock: minStockNum
            });

            setNewItem({ name: "", stock: "", minStock: "" });
            setShowNewEntry(false);
            setSuccess("New inventory entry added!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (e) {
            console.error("Failed to create item", e);
        }
    };

    const handleExport = () => {
        const csv = [
            "ID,Product Name,Stock,Min Threshold,Turnover",
            ...inventory.map(i => `"${i.id}","${i.name}",${i.stock},${i.minStock},"${i.turnover}"`),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "inventory_report.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-900 bg-slate-900/10 p-5 md:p-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Layers size={18} className="text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Logistics Data</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black tracking-tighter text-white">Inventory Intelligence</h3>
                    <p className="text-slate-500 text-xs md:text-sm mt-1">{inventory.filter(i => i.status !== 'ok').length} items need attention</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    <button
                        onClick={handleExport}
                        className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        <Download size={14} /> Export
                    </button>
                    <button
                        onClick={handleRestockAll}
                        disabled={restocking}
                        className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {restocking ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                        Restock
                    </button>
                    <button
                        onClick={() => setShowNewEntry(!showNewEntry)}
                        className="w-full lg:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2"
                    >
                        <Plus size={14} /> New Entry
                    </button>
                </div>
            </div>

            {success && (
                <div className="mb-6 flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
                    <CheckCircle size={16} /> {success}
                </div>
            )}

            {showNewEntry && (
                <div className="mb-8 p-6 rounded-3xl border border-blue-500/20 bg-blue-500/5 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Product Name</label>
                            <input
                                value={newItem.name}
                                onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                                placeholder="e.g. Server Rack Unit"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-white"
                            />
                        </div>
                        <div className="">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Stock Qty</label>
                            <input
                                type="number"
                                value={newItem.stock}
                                onChange={e => setNewItem(p => ({ ...p, stock: e.target.value }))}
                                placeholder="100"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-white"
                            />
                        </div>
                        <div className="">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Min Threshold</label>
                            <input
                                type="number"
                                value={newItem.minStock}
                                onChange={e => setNewItem(p => ({ ...p, minStock: e.target.value }))}
                                placeholder="20"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-white"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAddEntry} className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all">Add Item</button>
                        <button onClick={() => setShowNewEntry(false)} className="px-5 py-3 rounded-xl border border-slate-800 text-sm font-bold hover:bg-slate-800 transition-all text-white"><X size={16} /></button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {inventory.map((item) => (
                    <div key={item.id} className="group p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-900 bg-slate-900/40 hover:bg-slate-900 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto">
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${item.status === 'critical' ? 'bg-rose-500/10 text-rose-400' :
                                item.status === 'low' ? 'bg-amber-500/10 text-amber-400' :
                                    'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                <Package size={24} className="md:w-7 md:h-7" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 truncate">{item.id}</p>
                                <h4 className="text-base md:text-lg font-bold tracking-tight text-white truncate">{item.name}</h4>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 md:gap-8 w-full md:w-auto text-center border-y border-slate-800/50 md:border-none py-4 md:py-0">
                            <div>
                                <p className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Stock</p>
                                <p className={`text-lg md:text-xl font-black tracking-tighter font-mono ${item.status === 'critical' ? 'text-rose-400' : item.status === 'low' ? 'text-amber-400' : 'text-white'}`}>{item.stock}</p>
                            </div>
                            <div>
                                <p className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Min</p>
                                <p className="text-lg md:text-xl font-black tracking-tighter text-slate-400 font-mono">{item.minStock}</p>
                            </div>
                            <div>
                                <p className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Turn</p>
                                <p className="text-lg md:text-xl font-black tracking-tighter text-blue-400 font-mono">{item.turnover}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
                            <div className="flex items-center gap-2">
                                {item.status !== 'ok' && (
                                    <span className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${item.status === 'critical' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                                        }`}>
                                        <AlertTriangle size={10} /> {item.status}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleAdjustStock(item.id, -10)}
                                    disabled={adjustingId === item.id || item.stock <= 0}
                                    className="w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-30"
                                    title="Remove 10 units"
                                >
                                    <Minus size={14} />
                                </button>
                                <button
                                    onClick={() => handleAdjustStock(item.id, 50)}
                                    disabled={adjustingId === item.id}
                                    className="w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all disabled:opacity-30"
                                    title="Add 50 units"
                                >
                                    {adjustingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                </button>
                                <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center text-slate-500 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                                    title="Remove item"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
