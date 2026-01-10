"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Wind, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function DashboardNav() {
    const pathname = usePathname()
    const isTeacher = pathname?.includes("/teacher")
    const isStudent = pathname?.includes("/student")
    const dashboardLink = isTeacher ? "/dashboard/teacher" : "/dashboard/student"

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white/50 backdrop-blur-md">
            <div className="container flex h-14 items-center justify-between px-4">
                <Link href={dashboardLink} className="flex items-center gap-2 font-medium hover:opacity-80 transition-opacity">
                    <Wind className="h-6 w-6 text-primary" />
                    <span className="hidden md:inline-block font-light text-stone-900 tracking-tight">Breathe with Me</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-stone-400 hover:text-destructive hover:bg-destructive/5" asChild>
                        <Link href="/login" title="Sign Out">
                            <LogOut className="h-4 w-4" />
                        </Link>
                    </Button>
                </nav>

                {/* Mobile Nav */}
                <div className="md:hidden flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-stone-400" asChild>
                        <Link href="/login">
                            <LogOut className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
