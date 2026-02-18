
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function SignupPage() {
    return (
        <div className="flex items-center justify-center min-h-screen px-4 pt-20">
            <Card className="w-full max-w-md bg-slate-900/50 border-slate-800 backdrop-blur-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-blue-500/10">
                            <Shield className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">Create an account</CardTitle>
                    <CardDescription className="text-slate-400">
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first-name" className="text-slate-200">First name</Label>
                            <Input
                                id="first-name"
                                placeholder="John"
                                className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last-name" className="text-slate-200">Last name</Label>
                            <Input
                                id="last-name"
                                placeholder="Doe"
                                className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-200">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-200">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                        />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0">
                        Create Account
                    </Button>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 text-center">
                    <div className="text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
