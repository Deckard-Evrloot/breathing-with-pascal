"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Mic, Square, Save, RotateCcw, Loader2, Pause, Play, Settings, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAssetStore } from "@/store/asset-store"
import { saveAudioBlob } from "@/lib/audio-storage"

export function MediaRecorder() {
    const [status, setStatus] = useState<"idle" | "recording" | "paused" | "stopped">("idle")
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("")
    const [duration, setDuration] = useState(0)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const animationRef = useRef<number>(0)
    const chunksRef = useRef<Blob[]>([])
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const streamRef = useRef<MediaStream | null>(null)

    // Load available audio devices
    useEffect(() => {
        const getDevices = async () => {
            try {
                // Request permission first to get device names
                await navigator.mediaDevices.getUserMedia({ audio: true })
                const allDevices = await navigator.mediaDevices.enumerateDevices()
                const audioInputs = allDevices.filter(d => d.kind === 'audioinput')
                setDevices(audioInputs)
                if (audioInputs.length > 0) {
                    setSelectedDeviceId(audioInputs[0].deviceId)
                }
            } catch (err) {
                console.error("Error listing devices:", err)
            }
        }
        getDevices()
    }, [])

    // Recording timer
    useEffect(() => {
        if (status === "recording") {
            timerRef.current = setInterval(() => {
                setDuration(d => d + 1)
            }, 1000)
        } else {
            if (timerRef.current) clearInterval(timerRef.current)
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [status])

    // Cleanup URLs
    useEffect(() => {
        return () => {
            if (audioUrl) URL.revokeObjectURL(audioUrl)
        }
    }, [audioUrl])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const startRecording = async () => {
        try {
            const constraints = {
                audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true
            }
            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            streamRef.current = stream

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mediaRecorder = new (window as any).MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            chunksRef.current = []

            const audioContext = new AudioContext()
            const source = audioContext.createMediaStreamSource(stream)
            const analyser = audioContext.createAnalyser()
            analyser.fftSize = 256
            source.connect(analyser)
            analyserRef.current = analyser

            mediaRecorder.ondataavailable = (e: BlobEvent) => {
                if (e.data.size > 0) chunksRef.current.push(e.data)
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
                setAudioBlob(blob)
                setAudioUrl(URL.createObjectURL(blob))
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop())
                }
                setStatus("stopped")
            }

            mediaRecorder.start()
            setStatus("recording")
            setDuration(0)
            drawVisualizer()
        } catch (err) {
            console.error("Error accessing microphone:", err)
            toast.error("Could not access microphone. Please check permissions.")
        }
    }

    const pauseRecording = () => {
        if (mediaRecorderRef.current && status === "recording") {
            mediaRecorderRef.current.pause()
            setStatus("paused")
        }
    }

    const resumeRecording = () => {
        if (mediaRecorderRef.current && status === "paused") {
            mediaRecorderRef.current.resume()
            setStatus("recording")
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && (status === "recording" || status === "paused")) {
            mediaRecorderRef.current.stop()
            cancelAnimationFrame(animationRef.current)
        }
    }

    const resetRecording = () => {
        setAudioBlob(null)
        setAudioUrl(null)
        setDuration(0)
        setStatus("idle")
        chunksRef.current = []
    }

    const drawVisualizer = useCallback(() => {
        const canvas = canvasRef.current
        const analyser = analyserRef.current
        if (!canvas || !analyser) return

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw)
            analyser.getByteFrequencyData(dataArray)

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const barWidth = (canvas.width / bufferLength) * 2.5
            let barHeight
            let x = 0

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2

                // Gradient for visualizer
                const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0)
                if (status === "paused") {
                    gradient.addColorStop(0, '#A8A29E')
                    gradient.addColorStop(1, '#D6D3D1')
                } else {
                    gradient.addColorStop(0, '#6B705C')
                    gradient.addColorStop(1, '#A5A58D')
                }

                ctx.fillStyle = gradient
                ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight)

                x += barWidth
            }
        }

        draw()
    }, [status])

    const [recordingName, setRecordingName] = useState("")
    const { addAsset } = useAssetStore()

    // ... existing UseEffects...

    const saveRecording = async () => {
        if (!audioBlob) return
        setIsUploading(true)

        try {
            const assetId = Math.random().toString(36).substring(7)
            const dbKey = `audio_${assetId}`
            const filename = `recording_${assetId}.webm`

            // 1. Save to IndexedDB (Local Cache & Offline support)
            await saveAudioBlob(dbKey, audioBlob)

            // 2. Upload to Supabase Storage (Cloud Persistence)
            // We use the new helper function
            const { uploadAsset } = await import('@/lib/supabase/storage')
            const publicUrl = await uploadAsset(audioBlob, filename)

            // 3. Save Metadata to DB (via Store)
            await addAsset({
                title: recordingName || `New Recording ${new Date().toLocaleTimeString()}`,
                type: 'audio',
                url: publicUrl, // Cloud URL
                duration: duration,
                indexedDbKey: dbKey // Keep local key for potential caching
            })

            toast.success("Recording saved to cloud!")
            resetRecording()
            setRecordingName("")
        } catch (error: any) {
            console.error("Save failed", error)

            // Helpful Error Messaging for Deployment Debugging
            if (error?.message?.includes("security policy")) {
                toast.error("Upload failed: Database Policy Error. Did you run the SQL script?")
            } else if (error?.status === 0 || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
                toast.error("Upload failed: Network or Config error. Check your .env setup!")
            } else {
                toast.error(`Failed to upload: ${error?.message || "Unknown error"}`)
            }
        } finally {
            setIsUploading(false)
        }
    }

    const truncateString = (str: string, num: number) => {
        if (str.length <= num) return str
        return str.slice(0, num) + "..."
    }

    return (
        <div className="p-6 border border-stone-200 rounded-2xl bg-white shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium text-stone-800">Breath Guide Recorder</h3>
                    <div className="flex items-center gap-2">
                        {status === "recording" && (
                            <Badge variant="destructive" className="animate-pulse gap-1">
                                <Circle className="w-2 h-2 fill-current" />
                                Live
                            </Badge>
                        )}
                        {status === "paused" && <Badge variant="secondary">Paused</Badge>}
                        <span className="text-2xl font-mono text-stone-600">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                <div className="w-full sm:w-64">
                    <Select
                        value={selectedDeviceId}
                        onValueChange={setSelectedDeviceId}
                        disabled={status !== "idle"}
                    >
                        <SelectTrigger className="text-xs h-9 w-full bg-stone-50 border-stone-200">
                            <div className="flex items-center gap-2 truncate">
                                <Settings className="w-3 h-3 text-stone-400 shrink-0" />
                                <SelectValue placeholder="Input Device" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="max-w-[calc(100vw-2rem)] sm:max-w-64">
                            {devices.length > 0 ? (
                                devices.map(device => (
                                    <SelectItem key={device.deviceId} value={device.deviceId} className="text-xs">
                                        {truncateString(device.label || `Microphone ${device.deviceId.slice(0, 5)}`, 30)}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="default" disabled>No microphones found</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-stone-50 h-32 rounded-xl overflow-hidden relative border border-stone-100 flex items-end">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={128}
                    className="w-full h-24 opacity-80"
                />
                {(status === "idle" || status === "stopped") && !audioBlob && (
                    <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-sm gap-2">
                        <Mic className="w-4 h-4" />
                        Ready to start guide
                    </div>
                )}
                {status === "stopped" && audioUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                        <audio src={audioUrl} controls className="h-10 w-[80%] max-w-sm" />
                    </div>
                )}
            </div>

            <div className="flex gap-4 items-center justify-between">
                <div className="flex gap-3">
                    {status === "idle" && (
                        <Button onClick={startRecording} className="rounded-full px-6 gap-2">
                            <Mic className="w-4 h-4" />
                            Start Recording
                        </Button>
                    )}

                    {status === "recording" && (
                        <>
                            <Button onClick={pauseRecording} variant="outline" className="rounded-full pr-4 gap-2">
                                <Pause className="w-4 h-4" />
                                Pause
                            </Button>
                            <Button onClick={stopRecording} variant="destructive" className="rounded-full px-6 gap-2">
                                <Square className="w-4 h-4 fill-current" />
                                Stop
                            </Button>
                        </>
                    )}

                    {status === "paused" && (
                        <>
                            <Button onClick={resumeRecording} variant="outline" className="rounded-full px-6 gap-2 bg-accent/10 border-accent/20 text-accent hover:bg-accent/20">
                                <Play className="w-4 h-4 fill-current" />
                                Resume
                            </Button>
                            <Button onClick={stopRecording} variant="destructive" className="rounded-full px-6 gap-2">
                                <Square className="w-4 h-4 fill-current" />
                                Stop
                            </Button>
                        </>
                    )}

                    {status === "stopped" && (
                        <Button variant="outline" onClick={resetRecording} className="rounded-full gap-2">
                            <RotateCcw className="w-4 h-4" />
                            Discard & Retry
                        </Button>
                    )}
                </div>

                {audioBlob && status === "stopped" && (
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            placeholder="Recording Name"
                            className="h-10 px-3 rounded-full border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-stone-50"
                            value={recordingName}
                            onChange={(e) => setRecordingName(e.target.value)}
                        />
                        <Button onClick={saveRecording} disabled={isUploading} className="rounded-full px-6 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save to Library
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

