"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Login() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-10 shadow-2xl"
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">Access your student or school dashboard.</p>
            </div>

            <form className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-5 py-4 bg-white/50 dark:bg-slate-800/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-5 py-4 bg-white/50 dark:bg-slate-800/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
                />
              </div>

              <div className="text-right">
                <Link href="#" className="text-sm font-bold text-primary hover:underline">Forgot Password?</Link>
              </div>

              <Link
                href="/dashboard"
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
              >
                Sign In <ArrowRight size={20} />
              </Link>
            </form>

            <div className="mt-10 text-center text-sm">
              <span className="text-muted-foreground">New to OlympiadPro? </span>
              <Link href="/register" className="font-bold text-primary hover:underline">Create Account</Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
