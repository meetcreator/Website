import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function SignupPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <Link className="flex items-center gap-2" href="/">
                        <Shield className="h-8 w-8 text-purple-500" />
                        <span className="font-bold text-2xl tracking-tight text-white">ArchShield</span>
                    </Link>
                </div>
                <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Create account</CardTitle>
                        <CardDescription className="text-slate-400">
                            Enter your details to register for ArchShield
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none text-slate-200" htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm ring-offset-slate-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none text-slate-200" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm ring-offset-slate-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none text-slate-200" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm ring-offset-slate-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <Button className="w-full mt-2">Create Account</Button>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 text-center">
                        <div className="text-sm text-slate-400">
                            Already have an account?{" "}
                            <Link className="text-purple-400 hover:underline" href="/login">
                                Log in
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
