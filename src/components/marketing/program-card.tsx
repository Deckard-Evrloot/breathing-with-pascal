"use client"

import { motion } from "framer-motion"
import { ArrowRight, Clock, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProgramCardProps {
    title: string
    duration: string
    goal: string
}

export function ProgramCard({ title, duration, goal }: ProgramCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-md w-full p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-white mt-12"
        >
            <div className="space-y-4">
                <h2 className="text-2xl font-light tracking-wide">{title}</h2>

                <div className="flex items-center gap-2 text-white/80 font-light">
                    <Clock className="w-4 h-4" />
                    <span>{duration}</span>
                </div>

                <div className="flex items-start gap-2 text-white/80 font-light">
                    <Target className="w-4 h-4 mt-1" />
                    <p>{goal}</p>
                </div>

                <Link href="/login" className="w-full mt-6 block">
                    <Button
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-none rounded-full backdrop-blur-sm transition-all duration-300 group"
                        size="lg"
                    >
                        Begin Journey
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </motion.div>
    )
}
