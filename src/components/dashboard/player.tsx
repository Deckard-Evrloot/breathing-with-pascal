"use client"

import { useEffect, useRef } from "react"
import { Play, Pause, X, ChevronUp, ChevronDown, RotateCcw, RotateCw, SkipBack, SkipForward } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePlayerStore } from "@/store/player-store"
import { getAudioBlob } from "@/lib/audio-storage"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MediaPlayer() {
    const {
        isPlaying,
        currentTrackUrl,
        currentTrackTitle,
        currentTrackImage,
        progress,
        duration,
        isExpanded,
        currentTrackDbKey,
        togglePlay,
        setProgress,
        setDuration,
        toggleExpanded,
        closePlayer,
        hasError,
        setHasError,
        setTrack
    } = usePlayerStore()

    const audioRef = useRef<HTMLAudioElement>(null)

    const objectUrlRef = useRef<string | null>(null)

    // Effect: Handle track loading and recovery
    useEffect(() => {
        const loadTrack = async () => {
            if (!audioRef.current) return

            // Cleanup previous object URL
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current)
                objectUrlRef.current = null
            }

            // Priority 1: Helper function to determine validity
            const isBlob = currentTrackUrl?.startsWith('blob:')

            // Priority 2: Try recovery from IndexedDB if we have a key
            // We do this if it's a blob (to ensure freshness) or if we have no URL
            if (currentTrackDbKey) {
                try {
                    console.log("Attempting to load audio from IndexedDB:", currentTrackDbKey)
                    const blob = await getAudioBlob(currentTrackDbKey)
                    if (blob) {
                        console.log("Audio loaded successfully from DB", blob.size)
                        const persistentUrl = URL.createObjectURL(blob)
                        objectUrlRef.current = persistentUrl
                        audioRef.current.src = persistentUrl

                        // If we are supposed to be playing, ensure we play after loading
                        // We rely on the second useEffect for play() trigger, but sometimes src change stops it
                        if (isPlaying) {
                            // Small timeout to allow buffer to prep
                            setTimeout(() => audioRef.current?.play().catch(e => console.warn("Auto-play blocked", e)), 50)
                        }
                        return
                    } else {
                        console.warn("No blob found in DB for key:", currentTrackDbKey)
                    }
                } catch (err) {
                    console.error("Failed to load from IndexedDB", err)
                    setHasError(true)
                }
            }

            // Priority 3: Use standard URL (http/https)
            // We only use currentTrackUrl if it is NOT a blob, because blobs expire on reload
            // If it is a blob and we failed DB recovery, it's likely dead text.
            if (currentTrackUrl && !isBlob) {
                console.log("Loading standard URL:", currentTrackUrl)
                audioRef.current.src = currentTrackUrl
            } else if (isBlob) {
                console.warn("Expired blob URL detected and DB recovery failed. Audio cannot play.", currentTrackUrl)
                setHasError(true)
            }
        }

        loadTrack()

        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current)
            }
        }
    }, [currentTrackUrl, currentTrackDbKey])

    // Effect: Handle playback state
    useEffect(() => {
        if (!audioRef.current) return

        if (isPlaying) {
            const playPromise = audioRef.current.play()
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Playback error", error)
                    // If audio was already playing/loading, this might be expected
                })
            }
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime)
        }
    }

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration)
        }
    }

    const handleSeek = (val: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = val[0]
            setProgress(val[0])
        }
    }

    const skipRequest = (seconds: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime += seconds
            setProgress(audioRef.current.currentTime)
        }
    }

    const formatTime = (time: number) => {
        if (typeof time !== 'number' || isNaN(time) || time === Infinity) return "0:00"
        const absoluteSeconds = Math.max(0, Math.floor(time))
        const min = Math.floor(absoluteSeconds / 60)
        const sec = absoluteSeconds % 60
        return `${min}:${sec < 10 ? '0' : ''}${sec}`
    }

    if (!currentTrackUrl) return null

    return (
        <>
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => {
                    togglePlay()
                    setProgress(0)
                }}
                onError={(e) => {
                    console.error("Audio playback error:", e)
                    setHasError(true)
                }}
                onCanPlay={() => setHasError(false)}
            />

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-50 overflow-hidden flex flex-col p-6 pt-12 md:p-12"
                    >
                        {/* Background Image Layer */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src="/images/forest-bg.jpg"
                                alt=""
                                className="w-full h-full object-cover scale-110 blur-sm brightness-[0.8]"
                            />
                            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-2xl" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="absolute top-0 left-0 flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white/70 hover:text-white hover:bg-white/10"
                                    onClick={toggleExpanded}
                                >
                                    <ChevronDown className="w-6 h-6" />
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 right-0 text-white/70 hover:text-white hover:bg-white/10"
                                onClick={closePlayer}
                            >
                                <X className="w-6 h-6" />
                            </Button>

                            <div className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-md mx-auto w-full">
                                <div className="w-64 h-64 md:w-80 md:h-80 bg-stone-200 rounded-2xl shadow-2xl overflow-hidden relative">
                                    {/* Artwork Placeholder */}
                                    <div className="absolute inset-0 bg-stone-300 flex items-center justify-center text-4xl font-light text-stone-500">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}

                                        {currentTrackImage ? <img src={currentTrackImage} alt="Cover" className="w-full h-full object-cover" /> : "♪"}
                                    </div>
                                </div>

                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-medium text-white">{currentTrackTitle}</h2>
                                    <p className="text-white/60">Breathe with Pascal</p>
                                </div>

                                <div className="w-full space-y-2">
                                    <Slider
                                        value={[progress]}
                                        max={duration || 100}
                                        step={1}
                                        onValueChange={handleSeek}
                                        className="cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-white/50 font-mono">
                                        <span>{formatTime(progress)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                    {hasError && (
                                        <div className="bg-destructive/20 text-destructive-foreground border border-destructive/50 px-3 py-2 rounded-lg text-[10px] text-center mt-2 animate-pulse">
                                            Unable to load audio. This recording may have expired after a page refresh.
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-8">
                                    <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={() => skipRequest(-15)}>
                                        <RotateCcw className="w-6 h-6" />
                                    </Button>

                                    <Button
                                        onClick={togglePlay}
                                        size="icon"
                                        className="w-16 h-16 rounded-full bg-white text-stone-900 hover:bg-stone-100"
                                    >
                                        {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                                    </Button>

                                    <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={() => skipRequest(15)}>
                                        <RotateCw className="w-6 h-6" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isExpanded && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-border p-2 md:p-3 pb-safe"
                >
                    <div
                        className="max-w-4xl mx-auto flex items-center gap-3 cursor-pointer"
                        onClick={toggleExpanded}
                    >
                        {/* Mini Art */}
                        <div className="w-12 h-12 bg-stone-200 rounded-md shrink-0 flex items-center justify-center overflow-hidden">
                            {currentTrackImage ? <img src={currentTrackImage} alt="Cover" className="w-full h-full object-cover" /> : "♪"}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="text-sm font-medium truncate">{currentTrackTitle}</h4>
                                <span className="text-[10px] font-mono text-stone-400 tabular-nums">
                                    {formatTime(progress)} / {formatTime(duration)}
                                </span>
                            </div>
                            <div className="h-1 bg-stone-100 rounded-full w-full overflow-hidden">
                                <div
                                    className="h-full bg-primary"
                                    style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                                />
                            </div>
                            {hasError && (
                                <p className="text-[10px] text-destructive mt-1">Playback Error</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-stone-600" onClick={() => skipRequest(-15)} >
                                <RotateCcw className="w-5 h-5" />
                            </Button>
                            <Button
                                size="icon"
                                className="h-10 w-10 rounded-full"
                                onClick={togglePlay}
                            >
                                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-stone-400 hover:text-stone-600 ml-1"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    closePlayer()
                                }}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    )
}
