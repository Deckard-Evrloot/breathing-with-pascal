"use client"

import { useState } from "react"
import { useAssetStore, BreathingPattern } from "@/store/asset-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Wind, Save, Plus } from "lucide-react"

export function PatternManager() {
    const { addAsset } = useAssetStore()

    const [title, setTitle] = useState("New Sequence")
    const [pattern, setPattern] = useState<BreathingPattern>({
        in: 4,
        holdIn: 4,
        out: 4,
        holdOut: 4
    })

    const handleSave = () => {
        if (!title.trim()) {
            toast.error("Please enter a title for the pattern")
            return
        }

        addAsset({
            title,
            type: 'breathing',
            breathingPattern: pattern
        })

        toast.success(`Pattern "${title}" saved to library`)
        setTitle("New Sequence")
    }

    const updateValue = (key: keyof BreathingPattern, value: number[]) => {
        setPattern(prev => ({ ...prev, [key]: value[0] }))
    }

    return (
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-8">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-xl font-light text-stone-800 flex items-center gap-2">
                        <Wind className="w-5 h-5 text-primary" />
                        Pattern Studio
                    </h3>
                    <p className="text-sm text-stone-500">Design custom breathing sequences for your library.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="pattern-title">Pattern Name</Label>
                        <Input
                            id="pattern-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Anxiety Relief, Box Breath 5"
                            className="rounded-xl border-stone-200"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                        {/* Inhale */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <Label className="text-stone-600">Inhale</Label>
                                <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-xs">{pattern.in}s</span>
                            </div>
                            <Slider
                                value={[pattern.in]}
                                min={1}
                                max={15}
                                step={1}
                                onValueChange={(v) => updateValue('in', v)}
                            />
                        </div>

                        {/* Hold In */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <Label className="text-stone-600">Hold In</Label>
                                <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-xs">{pattern.holdIn}s</span>
                            </div>
                            <Slider
                                value={[pattern.holdIn]}
                                min={0}
                                max={15}
                                step={1}
                                onValueChange={(v) => updateValue('holdIn', v)}
                            />
                        </div>

                        {/* Exhale */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <Label className="text-stone-600">Exhale</Label>
                                <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-xs">{pattern.out}s</span>
                            </div>
                            <Slider
                                value={[pattern.out]}
                                min={1}
                                max={15}
                                step={1}
                                onValueChange={(v) => updateValue('out', v)}
                            />
                        </div>

                        {/* Hold Out */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <Label className="text-stone-600">Hold Out</Label>
                                <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-xs">{pattern.holdOut}s</span>
                            </div>
                            <Slider
                                value={[pattern.holdOut]}
                                min={0}
                                max={15}
                                step={1}
                                onValueChange={(v) => updateValue('holdOut', v)}
                            />
                        </div>
                    </div>

                    <Button onClick={handleSave} className="w-full h-12 rounded-xl gap-2 text-base shadow-sm">
                        <Save className="w-4 h-4" />
                        Save to Library
                    </Button>
                </div>

                <div className="bg-stone-50 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 border border-stone-100 border-dashed">
                    <div className="text-center space-y-1">
                        <h4 className="font-medium text-stone-700">Visual Timeline</h4>
                        <p className="text-xs text-stone-400 font-mono">
                            {pattern.in}-{pattern.holdIn}-{pattern.out}-{pattern.holdOut} Sequence
                        </p>
                    </div>

                    <div className="flex gap-2 items-end h-32 w-full max-w-[200px]">
                        <div className="flex-1 bg-stone-200 rounded-t-lg transition-all duration-300" style={{ height: `${(pattern.in / 15) * 100}%` }} />
                        <div className="flex-1 bg-stone-100 rounded-t-lg border-x border-stone-200" style={{ height: `${(pattern.holdIn / 15) * 100}%` }} />
                        <div className="flex-1 bg-stone-300 rounded-t-lg transition-all duration-300" style={{ height: `${(pattern.out / 15) * 100}%` }} />
                        <div className="flex-1 bg-stone-100 rounded-t-lg border-x border-stone-200" style={{ height: `${(pattern.holdOut / 15) * 100}%` }} />
                    </div>

                    <div className="text-[10px] text-stone-400 grid grid-cols-4 w-full max-w-[200px] text-center uppercase tracking-widest font-medium">
                        <span>In</span>
                        <span>Hold</span>
                        <span>Out</span>
                        <span>Hold</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
