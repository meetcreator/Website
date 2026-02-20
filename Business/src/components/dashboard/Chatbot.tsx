"use client";

import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, X, Bot } from "lucide-react";
import { api } from "@/lib/api";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: "Hello! I'm ARCH-AI, your Business Intelligence Engine. Ask me about revenue, inventory, churn risk, or forecasts." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            const res = await api.ai.chat(userMsg);
            const responseText = res?.response || res?.message || res;

            if (typeof responseText !== 'string') {
                throw new Error("Invalid response format");
            }

            setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
        } catch (err) {
            console.error("AI Chat Error:", err);
            setMessages(prev => [...prev, { role: 'ai', text: "I'm currently unable to process your request. Please check your database connection." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100]">
            {isOpen ? (
                <div className="fixed inset-0 md:inset-auto md:bottom-0 md:right-0 md:relative w-full h-full md:w-[420px] md:h-[620px] bg-slate-900/95 backdrop-blur-2xl border border-slate-800 md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="p-5 md:p-6 bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 flex justify-between items-center relative overflow-hidden flex-shrink-0">
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="p-2 md:p-2.5 bg-white/10 rounded-xl md:rounded-2xl backdrop-blur-md">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <span className="font-black text-white text-sm md:text-base tracking-tighter block leading-tight">ARCH-AI</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                    <span className="text-[9px] md:text-[10px] text-white/70 font-bold uppercase tracking-widest">Neural Link Active</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="relative z-10 w-9 h-9 rounded-full bg-black/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/40 transition-all"
                        >
                            <X size={18} />
                        </button>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16"></div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 md:p-5 overflow-y-auto flex flex-col gap-4 bg-slate-950/30">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {m.role === 'ai' && (
                                    <div className="w-7 h-7 rounded-xl bg-blue-600/20 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                                        <Bot size={14} className="text-blue-400" />
                                    </div>
                                )}
                                <div className={`max-w-[85%] md:max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-600/20'
                                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-tl-sm text-white'
                                    }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="w-7 h-7 rounded-xl bg-blue-600/20 flex items-center justify-center mr-2 flex-shrink-0">
                                    <Bot size={14} className="text-blue-400" />
                                </div>
                                <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick prompts */}
                    <div className="px-5 pb-2 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-hide">
                        {["Revenue trends", "Inventory status", "Churn risk", "Forecast Q1"].map(prompt => (
                            <button
                                key={prompt}
                                onClick={() => { setInput(prompt); }}
                                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-[9px] md:text-[10px] font-bold hover:bg-slate-700 hover:text-white transition-all flex-shrink-0"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3 flex-shrink-0 pb-10 md:pb-4">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about revenue..."
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/60 transition-all placeholder:text-slate-600 text-white"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 flex-shrink-0"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 md:w-16 md:h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/40 hover:scale-110 transition-all hover:bg-blue-500 group relative"
                >
                    <div className="absolute inset-0 rounded-2xl bg-blue-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
                    <MessageSquare size={24} className="md:w-7 md:h-7 relative z-10 group-hover:rotate-12 transition-transform" />
                </button>
            )}
        </div>
    );
}
