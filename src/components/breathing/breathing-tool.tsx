"use client"

import { useState, useEffect, useRef } from "react"
import { motion, type Variants, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Square, Volume2, VolumeX, SkipForward } from "lucide-react"
import { cn } from "@/lib/utils"

type Phase = "in" | "hold-in" | "out" | "hold-out" | "idle"

export interface BreathingPhase {
    name: string
    rounds?: number
    in: number
    holdIn: number
    out: number
    holdOut: number
}

// Default patterns now follow phase structure
const DEFAULT_PHASES: BreathingPhase[] = [
    { name: "Box Breathing", rounds: 10, in: 4, holdIn: 4, out: 4, holdOut: 4 },
    { name: "4-7-8 Relax", rounds: 10, in: 4, holdIn: 7, out: 8, holdOut: 0 },
]

interface BreathingToolProps {
    phases?: BreathingPhase[] // Multi-step support
    pattern?: any // Legacy fallback
    className?: string
}

export function BreathingTool({ phases: inputPhases, pattern: legacyPattern, className }: BreathingToolProps) {
    // Normalize input to phases array
    const initialPhases = inputPhases || (legacyPattern ? [{ ...legacyPattern, name: "Breathing", rounds: 99 }] : [DEFAULT_PHASES[0]])

    const [phases, setPhases] = useState<BreathingPhase[]>(initialPhases)
    const [activePhaseIndex, setActivePhaseIndex] = useState(0)
    const [currentRound, setCurrentRound] = useState(1)

    const [phase, setPhase] = useState<Phase>("idle")
    const [timeLeft, setTimeLeft] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [progress, setProgress] = useState(100)
    const [isMuted, setIsMuted] = useState(false)

    const audioCtx = useRef<AudioContext | null>(null)

    // Reset when props change
    useEffect(() => {
        if (inputPhases) {
            setPhases(inputPhases)
            setActivePhaseIndex(0)
            setCurrentRound(1)
            setIsRunning(false)
            setPhase("idle")
        } else if (legacyPattern) {
            setPhases([{ ...legacyPattern, name: "Breathing", rounds: 99 }])
        }
    }, [inputPhases, legacyPattern])

    const activePhaseData = phases[activePhaseIndex] || phases[0]

    // Initialize Audio
    const initAudio = () => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
        if (audioCtx.current.state === 'suspended') {
            audioCtx.current.resume()
        }
    }

    const playTick = (type: "in" | "out" | "hold" | "finish") => {
        if (isMuted) return
        initAudio()
        const ctx = audioCtx.current
        if (!ctx) return

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.connect(gain)
        gain.connect(ctx.destination)

        // Frequencies
        // Finish = High chime
        const freq = type === "finish" ? 880 : type === "in" ? 660 : type === "out" ? 440 : 550
        osc.frequency.setValueAtTime(freq, ctx.currentTime)

        // Envelope
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01)

        osc.start()

        if (type === "finish") {
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
            osc.stop(ctx.currentTime + 1.5)
        } else {
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
            osc.stop(ctx.currentTime + 0.1)
        }
    }

    useEffect(() => {
        let timeout: NodeJS.Timeout
        let progressInterval: NodeJS.Timeout

        if (isRunning) {
            if (phase === "idle") {
                startPhase("in", activePhaseData)
            } else {
                if (timeLeft > 0) {
                    timeout = setTimeout(() => {
                        const nextTime = timeLeft - 1
                        setTimeLeft(nextTime)

                        // Play tick
                        if (phase === "in") playTick("in")
                        else if (phase === "out") playTick("out")
                        else if (String(phase).includes("hold")) playTick("hold")
                    }, 1000)

                    // Smooth progress bar for holds
                    if (String(phase).includes('hold')) {
                        const totalTime = phase === 'hold-in' ? activePhaseData.holdIn : activePhaseData.holdOut
                        if (totalTime > 0) {
                            const step = 100 / (totalTime * 20)
                            progressInterval = setInterval(() => {
                                setProgress(p => Math.max(0, p - step))
                            }, 50)
                        }
                    }
                } else {
                    nextPhase()
                }
            }
        } else {
            setPhase("idle")
            setTimeLeft(0)
            setProgress(100)
        }

        return () => {
            clearTimeout(timeout)
            clearInterval(progressInterval)
        }
    }, [isRunning, timeLeft, phase, activePhaseData])

    const startPhase = (newPhase: Phase, pattern: BreathingPhase) => {
        setPhase(newPhase)
        setProgress(100)

        // Delay logic? Assuming logic is now straightforward
        // We set the time for the NEW phase
        switch (newPhase) {
            case "in": setTimeLeft(pattern.in); break
            case "hold-in": setTimeLeft(pattern.holdIn); break
            case "out": setTimeLeft(pattern.out); break
            case "hold-out": setTimeLeft(pattern.holdOut); break
        }
    }

    const nextPhase = () => {
        // Current cycle sequence: IN -> HOLD-IN -> OUT -> HOLD-OUT -> (Complete Round)

        const hasHoldIn = activePhaseData.holdIn > 0
        const hasHoldOut = activePhaseData.holdOut > 0

        switch (phase) {
            case "in":
                if (hasHoldIn) startPhase("hold-in", activePhaseData)
                else startPhase("out", activePhaseData)
                break
            case "hold-in":
                startPhase("out", activePhaseData)
                break
            case "out":
                if (hasHoldOut) startPhase("hold-out", activePhaseData)
                else completeRound() // End of cycle
                break
            case "hold-out":
                completeRound() // End of cycle
                break
        }
    }

    const completeRound = () => {
        const totalRounds = activePhaseData.rounds || 999

        if (currentRound < totalRounds) {
            // Continue same phase
            setCurrentRound(r => r + 1)
            startPhase("in", activePhaseData)
        } else {
            // Phase Complete
            if (activePhaseIndex < phases.length - 1) {
                // Next Phase
                playTick("finish") // Transition sound
                setActivePhaseIndex(i => i + 1)
                setCurrentRound(1)
                startPhase("in", phases[activePhaseIndex + 1])
            } else {
                // Exercise Complete
                playTick("finish")
                setIsRunning(false)
                setPhase("idle")
                setCurrentRound(1)
                setActivePhaseIndex(0) // Reset
            }
        }
    }

    const circleVariants: Variants = {
        idle: { scale: 1, opacity: 0.5 },
        in: { scale: 1.8, opacity: 1, transition: { duration: activePhaseData.in, ease: "easeInOut" } },
        "hold-in": { scale: 1.85, opacity: 1, transition: { duration: activePhaseData.holdIn, repeat: Infinity, repeatType: "reverse" } },
        out: { scale: 1, opacity: 0.8, transition: { duration: activePhaseData.out, ease: "easeInOut" } },
        "hold-out": { scale: 0.95, opacity: 0.8, transition: { duration: activePhaseData.holdOut, repeat: Infinity, repeatType: "reverse" } },
    }

    const getInstruction = () => {
        switch (phase) {
            case "in": return "Inhale"
            case "hold-in": return "Hold"
            case "out": return "Exhale"
            case "hold-out": return "Hold"
            default: return "Ready"
        }
    }

    const isHoldPhase = phase === 'hold-in' || phase === 'hold-out'
    const totalRounds = activePhaseData.rounds || 0
    const nextPhaseData = phases[activePhaseIndex + 1]

    return (
        <div className={cn("flex flex-col items-center justify-center min-h-[500px] w-full bg-stone-50 rounded-3xl p-8 shadow-sm border border-stone-200 relative overflow-hidden", className)}>

            {/* Background Aura */}
            <motion.div
                animate={phase}
                variants={circleVariants}
                className="absolute w-64 h-64 bg-primary/20 rounded-full blur-3xl z-0 pointer-events-none"
            />

            {/* Header: Phase Progress */}
            <div className="absolute top-8 left-0 right-0 flex justify-center z-20">
                <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-stone-100 shadow-sm flex items-center gap-4 text-sm font-medium text-stone-600">
                    <span className="text-primary">{activePhaseData.name}</span>
                    <div className="w-px h-3 bg-stone-300" />
                    <span className="font-mono text-stone-400">
                        Round {currentRound} / {totalRounds}
                    </span>
                </div>
            </div>

            {/* Mute Toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-6 right-6 text-stone-400 hover:text-primary transition-colors z-20"
                onClick={() => setIsMuted(!isMuted)}
            >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>

            {/* Main Visualizer */}
            <motion.div
                animate={phase}
                variants={circleVariants}
                className="w-48 h-48 rounded-full border-4 border-primary/30 flex items-center justify-center z-10 bg-white shadow-xl relative"
            >
                <div className="absolute inset-0 rounded-full bg-primary/10" />

                {isHoldPhase && (
                    <svg className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] rotate-[-90deg]" viewBox="0 0 100 100">
                        <circle
                            cx="50" cy="50" r="48"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-stone-300"
                        />
                        <circle
                            cx="50" cy="50" r="48"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-primary transition-all duration-75 ease-linear"
                            strokeDasharray="301.59"
                            strokeDashoffset={301.59 * (1 - progress / 100)}
                        />
                    </svg>
                )}

                <div className="text-center z-20">
                    <div className="text-3xl font-light text-primary tracking-widest uppercase">{getInstruction()}</div>
                    {isRunning && <div className="text-lg text-stone-400 font-mono mt-2">{timeLeft}s</div>}
                </div>
            </motion.div>

            {/* Controls */}
            <div className="mt-16 w-full max-w-sm space-y-6 z-10">
                <div className="flex justify-center items-center gap-6">
                    <Button
                        variant={isRunning ? "destructive" : "default"}
                        size="lg"
                        className="rounded-full w-16 h-16 shadow-lg text-xl"
                        onClick={() => setIsRunning(!isRunning)}
                    >
                        {isRunning ? <Square className="fill-current" /> : <Play className="fill-current ml-1" />}
                    </Button>
                </div>

                {/* Next Phase Preview */}
                <div className="h-12 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {isRunning && nextPhaseData && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2 text-xs text-stone-400 bg-stone-100/50 px-3 py-1.5 rounded-full"
                            >
                                <SkipForward className="w-3 h-3" />
                                <span>Up next: {nextPhaseData.name}</span>
                            </motion.div>
                        )}
                        {!isRunning && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center space-y-1"
                            >
                                <p className="font-medium text-stone-700">{activePhaseData.name}</p>
                                <p className="text-xs text-stone-400 font-mono">
                                    {activePhaseData.in}-{activePhaseData.holdIn}-{activePhaseData.out}-{activePhaseData.holdOut}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
