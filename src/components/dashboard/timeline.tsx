"use client"

import { Check, Lock, Play, Mic, Wind, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { format, parseISO } from "date-fns"

export interface TimelineSession {
    id: string
    title: string
    date: string
    status: 'completed' | 'active' | 'locked'
    description?: string
    audioAssetId?: string
    breathingPatternId?: string
    documentAssetId?: string
}

interface TimelineProps {
    sessions: TimelineSession[]
    onSessionSelect: (id: string) => void
}

export function Timeline({ sessions, onSessionSelect }: TimelineProps) {
    return (
        <div className="relative pl-8 md:pl-16 py-8 space-y-12 max-w-2xl mx-auto">
            {/* Solid Line */}
            <div className="absolute left-[19px] md:left-[35px] top-4 bottom-4 w-px bg-stone-200" />

            {sessions.map((session, index) => {
                const isCompleted = session.status === 'completed'
                const isActive = session.status === 'active'
                const isLocked = session.status === 'locked'

                const hasAudio = !!session.audioAssetId
                const hasBreathing = !!session.breathingPatternId

                // Safe date parsing
                let dateObj: Date
                try {
                    dateObj = parseISO(session.date)
                } catch (e) {
                    dateObj = new Date()
                }

                return (
                    <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                            "relative group pl-6",
                            isLocked ? "opacity-60" : "cursor-pointer"
                        )}
                        onClick={() => !isLocked && onSessionSelect(session.id)}
                    >
                        {/* Node */}
                        <div className={cn(
                            "absolute left-[-33px] md:left-[-49px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10 bg-white",
                            isCompleted && "border border-stone-800 text-stone-800",
                            isActive && "border border-stone-400 shadow-xl scale-110",
                            isLocked && "border border-stone-200 text-stone-300"
                        )}>
                            {isCompleted && <Check className="w-4 h-4" />}
                            {isActive && (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full border border-stone-800 opacity-20 animate-ping" />
                                    <div className="w-2.5 h-2.5 bg-stone-800 rounded-full" />
                                </div>
                            )}
                            {isLocked && <Lock className="w-3 h-3" />}
                        </div>

                        {/* Card Content */}
                        <div className={cn(
                            "flex items-center justify-between p-6 rounded-2xl transition-all duration-300",
                            isActive ? "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100" : "hover:bg-stone-50/50"
                        )}>
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-xs font-medium tracking-wider uppercase",
                                        isActive ? "text-stone-800" : "text-stone-400"
                                    )}>
                                        {format(dateObj, 'MMM dd')}
                                    </span>
                                    {isActive && (
                                        <span className="px-1.5 py-0.5 rounded-full bg-stone-100 text-[10px] font-medium text-stone-600">
                                            Current
                                        </span>
                                    )}
                                    <div className="flex items-center gap-1.5 ml-1">
                                        {hasAudio && (
                                            <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100" title="Audio Guide">
                                                <Mic className="w-2.5 h-2.5 text-amber-600" />
                                            </div>
                                        )}
                                        {hasBreathing && (
                                            <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100" title="Breathing Exercise">
                                                <Wind className="w-2.5 h-2.5 text-teal-600" />
                                            </div>
                                        )}
                                        {session.documentAssetId && (
                                            <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100" title="Accompanying Document">
                                                <FileText className="w-2.5 h-2.5 text-indigo-600" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h3 className={cn(
                                    "text-lg font-light tracking-tight",
                                    isLocked ? "text-stone-400" : "text-stone-900"
                                )}>
                                    {session.title}
                                </h3>
                                {session.description && !isLocked && (
                                    <p className="text-sm text-stone-500 line-clamp-1 font-light">
                                        {session.description}
                                    </p>
                                )}
                            </div>

                            {/* Action Icon */}
                            <div className="pl-4">
                                {isLocked ? (
                                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center">
                                        <Lock className="w-4 h-4 text-stone-300" />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                                        isActive ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600"
                                    )}>
                                        <Play className={cn("w-4 h-4 ml-0.5 fill-current")} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}
