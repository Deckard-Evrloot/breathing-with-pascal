"use client"

import { useState, useEffect } from "react"
import { Timeline, TimelineSession } from "@/components/dashboard/timeline"
import { BreathingTool } from "@/components/breathing/breathing-tool"
import { HomeworkInput } from "@/components/dashboard/homework-input"
import { Button } from "@/components/ui/button"
import { Play, Pause, Mic, Wind, FileText } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { usePlayerStore } from "@/store/player-store"
import { useSessionStore } from "@/store/session-store"
import { useAssetStore } from "@/store/asset-store"
import { LogOut } from "lucide-react"

// Mock Data
const SESSIONS: TimelineSession[] = [
    { id: '1', title: 'Foundations of Breath', date: 'Jan 02', status: 'completed', description: 'Learning the 3-part breath.' },
    { id: '2', title: 'Rhythmic Coherence', date: 'Jan 09', status: 'completed', description: 'Aligning heart and breath.' },
    { id: '3', title: 'Box Breathing Mastery', date: 'Today', status: 'active', description: 'Focus and stress reduction technique.' },
    { id: '4', title: 'Ocean Sound (Ujjayi)', date: 'Jan 23', status: 'locked' },
    { id: '5', title: 'Breath Retention', date: 'Jan 30', status: 'locked' },
]

export default function StudentDashboard() {
    const [selectedSession, setSelectedSession] = useState<any>(null)
    const [isMounted, setIsMounted] = useState(false)
    const { setTrack, isPlaying, currentTrackTitle, currentTrackUrl, togglePlay } = usePlayerStore()
    const { getSessionsForStudent } = useSessionStore()
    const { assets, fetchAssets } = useAssetStore()

    useEffect(() => {
        setIsMounted(true)
        fetchAssets()
    }, [fetchAssets])

    // In dev mode, we use 'student_tobi' as the ID
    const sessions = getSessionsForStudent('student_tobi').sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const handleSessionSelect = (id: string) => {
        const session = sessions.find(s => s.id === id)
        if (session) setSelectedSession(session)
    }

    const handlePlaySession = () => {
        const audioAsset = selectedSession?.audioAssetId
            ? assets.find(a => a.id === selectedSession.audioAssetId)
            : null

        if (isPlaying && currentTrackUrl === (audioAsset?.url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3")) {
            togglePlay()
            return
        }

        setTrack(
            audioAsset?.url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            audioAsset?.title || selectedSession?.title,
            "https://placehold.co/400x400/6B705C/FFFFFF/png?text=Breathe",
            audioAsset?.duration, // Pass duration if available
            audioAsset?.indexedDbKey // Pass DB key for persistence recovery
        )
    }

    // Resolve Breathing Asset if exists
    const breathingAsset = selectedSession?.breathingPatternId
        ? assets.find(a => a.id === selectedSession.breathingPatternId)
        : undefined

    if (!isMounted) {
        return null // Prevent hydration mismatch
    }

    return (
        <div className="container mx-auto p-6 space-y-8 max-w-xl">
            <header className="flex flex-col space-y-2">
                <h1 className="text-3xl font-light text-primary tracking-tight">My Journey</h1>
                <p className="text-stone-500">Level 1 • Week 3</p>
            </header>

            <Timeline sessions={sessions as any} onSessionSelect={handleSessionSelect} />

            <Sheet open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
                <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl sm:max-w-md sm:mx-auto overflow-y-auto">
                    <SheetHeader className="pb-4 border-b border-border">
                        <SheetTitle className="text-2xl font-light">{selectedSession?.title}</SheetTitle>
                        <SheetDescription>
                            {selectedSession?.date} • {selectedSession?.status}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-6 space-y-8 pb-32 px-6">
                        {/* Multi-Asset Display Area */}
                        <div className="space-y-6">
                            {breathingAsset && (
                                <div className="space-y-4">
                                    <BreathingTool
                                        phases={breathingAsset.phases}
                                        pattern={breathingAsset.breathingPattern ? { name: "Guided Practice", ...breathingAsset.breathingPattern } : undefined}
                                    />
                                    <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 space-y-3">
                                        <div>
                                            <h4 className="font-medium text-stone-800 flex items-center gap-2">
                                                <Wind className="w-4 h-4 text-teal-600" />
                                                {breathingAsset.title || "Guided Practice"}
                                            </h4>
                                            <p className="text-xs text-stone-400 mt-0.5 ml-6">
                                                {breathingAsset.phases
                                                    ? `${breathingAsset.phases.length} Step Sequence`
                                                    : "Single Pattern"}
                                            </p>
                                        </div>

                                        {/* Pro Tip Display */}
                                        {breathingAsset.description && (
                                            <div className="bg-white/50 rounded-xl p-3 text-sm text-stone-600 leading-relaxed border border-stone-100/50">
                                                <span className="font-medium text-teal-700 block mb-1 text-xs uppercase tracking-wider">Pro Tip</span>
                                                {breathingAsset.description}
                                            </div>
                                        )}

                                        {!breathingAsset.description && (
                                            <p className="text-sm text-stone-500 pl-1">
                                                {breathingAsset.phases ? (
                                                    <span>Follow the visualizer instructions for each phase.</span>
                                                ) : (
                                                    <span>
                                                        Rhythm: <span className="font-mono">{breathingAsset.breathingPattern?.in}-{breathingAsset.breathingPattern?.holdIn}-{breathingAsset.breathingPattern?.out}-{breathingAsset.breathingPattern?.holdOut}</span>
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {selectedSession?.audioAssetId && (
                                <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100 flex flex-col items-center text-center space-y-4 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <Mic className="w-24 h-24 text-stone-900" />
                                    </div>

                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm z-10">
                                        <Play className="w-6 h-6 fill-stone-800 text-stone-800 ml-1" />
                                    </div>

                                    <div className="z-10 space-y-1">
                                        <h3 className="text-lg font-medium text-stone-800">
                                            {assets.find(a => a.id === selectedSession.audioAssetId)?.title || "Audio Guide"}
                                        </h3>
                                        <p className="text-sm text-stone-500">
                                            {(() => {
                                                const asset = assets.find(a => a.id === selectedSession.audioAssetId)
                                                if (!asset || typeof asset.duration === 'undefined') return "Audio Session"
                                                if (asset.duration < 60) return `${asset.duration} sec`
                                                return `${Math.floor(asset.duration / 60)} min`
                                            })()}
                                        </p>
                                    </div>

                                    <Button
                                        className="w-full z-10 rounded-full h-12 text-base font-normal bg-stone-900 hover:bg-stone-800 transition-all active:scale-95"
                                        onClick={handlePlaySession}
                                    >
                                        {isPlaying && currentTrackTitle === (assets.find(a => a.id === selectedSession.audioAssetId)?.title || selectedSession?.title) ? (
                                            <>
                                                <Pause className="w-4 h-4 mr-2 fill-current" />
                                                Pause Session
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4 h-4 mr-2 fill-current" />
                                                Start Session
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}

                            {selectedSession?.documentAssetId && (
                                <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100 flex flex-col items-center text-center space-y-4 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <FileText className="w-24 h-24 text-stone-900" />
                                    </div>

                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm z-10">
                                        <FileText className="w-6 h-6 text-stone-800" />
                                    </div>

                                    <div className="z-10 space-y-1">
                                        <h3 className="text-lg font-medium text-stone-800">
                                            {assets.find(a => a.id === selectedSession.documentAssetId)?.title || "Attached Material"}
                                        </h3>
                                        <p className="text-sm text-stone-500">
                                            {assets.find(a => a.id === selectedSession.documentAssetId)?.type.toUpperCase() || "DOCUMENT"}
                                        </p>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full z-10 rounded-full h-12 text-base font-normal border-stone-200 hover:bg-stone-100 transition-all active:scale-95"
                                        onClick={() => window.open(assets.find(a => a.id === selectedSession.documentAssetId)?.url, '_blank')}
                                    >
                                        View Document
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-medium text-lg text-stone-800">Session Notes</h3>
                            <p className="text-stone-600 leading-relaxed text-base">
                                {selectedSession?.description || "In this session, we explore the depths of our respiratory system..."}
                            </p>
                        </div>

                        {selectedSession && <HomeworkInput sessionId={selectedSession.id} />}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
