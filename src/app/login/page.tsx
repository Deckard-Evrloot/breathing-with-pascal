"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Wind } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const [mode, setMode] = useState<"login" | "signup">("login")
    const [sent, setSent] = useState(false)

    const handleDevLogin = (role: 'teacher' | 'student') => {
        // Bypass Supabase Auth for Dev Mode (Safe from Ban)
        // Set a cookie to simulate session
        document.cookie = `dev_mode_user=${role}; path=/; max-age=86400;` // 1 day

        toast.success(role === 'teacher' ? "Welcome back, Pascal!" : "Welcome back, Tobi!")

        if (role === 'teacher') {
            router.push("/dashboard/teacher")
        } else {
            // Send student directly to dashboard
            router.push("/dashboard/student")
        }
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (mode === "login") {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })
                if (error) throw error
                router.push("/dashboard/student")
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    }
                })
                if (error) throw error
                setSent(true)
                toast.success("Confirmation email sent!")
            }
        } catch (error: any) {
            console.error("Auth Error Full Object:", error)
            let msg = error.message || "Authentication failed"
            if (msg.includes("row")) msg = "Please check your network connection."
            if (error?.status === 429) msg = "Too many attempts. Please wait 1 minute."
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
                <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-stone-100 text-center">
                    <div className="inline-flex p-3 rounded-full bg-green-100 mb-2">
                        <Wind className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-light text-stone-900 tracking-tight">Check your Inbox</h1>
                    <p className="text-stone-500">
                        We've sent a verification link to <strong className="font-medium text-stone-900">{email}</strong>.
                    </p>
                    <p className="text-sm text-stone-400">
                        Please click the link to confirm your account and start your journey.
                    </p>
                    <Button variant="outline" onClick={() => setSent(false)} className="w-full">
                        Back to Login
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
            <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-stone-100">
                <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-full bg-primary/10 mb-2">
                        <Wind className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-light text-stone-900 tracking-tight">
                        {mode === "login" ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="text-sm text-stone-500">
                        {mode === "login" ? "Sign in to continue your journey" : "Start your breathwork journey"}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        {mode === "login" ? "Sign In" : "Sign Up"}
                    </Button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-stone-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-stone-500">Open Access Mode</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-xs text-center text-stone-400">Quick Login (Passwordless)</p>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="secondary"
                            className="w-full text-xs"
                            onClick={() => handleDevLogin('teacher')}
                            disabled={isLoading}
                            type="button"
                        >
                            👨‍🏫 Pascal (Teacher)
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-full text-xs"
                            onClick={() => handleDevLogin('student')}
                            disabled={isLoading}
                            type="button"
                        >
                            🧘 Tobi (Student)
                        </Button>
                    </div>
                </div>

                <p className="text-center text-xs text-stone-400 mt-4">
                    {mode === "login" ? "No account? " : "Already have an account? "}
                    <button
                        onClick={() => setMode(mode === "login" ? "signup" : "login")}
                        className="text-primary hover:underline font-medium"
                    >
                        {mode === "login" ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    )
}
