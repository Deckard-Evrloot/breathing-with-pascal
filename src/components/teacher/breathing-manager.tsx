"use client"

import { useState } from "react"
import { useAssetStore, BreathingPhase } from "@/store/asset-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Wind, Save, Plus, Trash2, Clock, Info, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Stepper } from "@/components/ui/stepper"

export function BreathingManager() {
    const { addAsset } = useAssetStore()

    const [exerciseTitle, setExerciseTitle] = useState("")
    const [description, setDescription] = useState("") // "Pro Tip"
    const [phases, setPhases] = useState<BreathingPhase[]>([
        { name: "Focus", rounds: 10, in: 4, holdIn: 4, out: 4, holdOut: 4 }
    ])
    const [expandedPhaseIndex, setExpandedPhaseIndex] = useState<number | null>(0)

    const handleSave = () => {
        if (!exerciseTitle.trim()) {
            toast.error("Please enter a title for the exercise")
            return
        }

        addAsset({
            title: exerciseTitle,
            type: 'breathing',
            phases: phases,
            duration: totalDuration,
            url: '',
            description: description
        })

        toast.success(`Exercise "${exerciseTitle}" saved to library`)
        setExerciseTitle("")
        setDescription("")
        setPhases([{ name: "Focus", rounds: 10, in: 4, holdIn: 4, out: 4, holdOut: 4 }])
        setExpandedPhaseIndex(0)
    }

    const addPhase = () => {
        if (phases.length >= 8) {
            toast.error("Maximum 8 phases allowed")
            return
        }
        const newPhase = { name: "Next Phase", rounds: 10, in: 4, holdIn: 0, out: 4, holdOut: 0 }
        setPhases([...phases, newPhase])
        setExpandedPhaseIndex(phases.length) // Open the new phase
    }

    const removePhase = (index: number) => {
        if (phases.length === 1) return
        const newPhases = phases.filter((_, i) => i !== index)
        setPhases(newPhases)
        if (expandedPhaseIndex === index) setExpandedPhaseIndex(null)
    }

    const updatePhase = (index: number, updates: Partial<BreathingPhase>) => {
        const newPhases = [...phases]
        newPhases[index] = { ...newPhases[index], ...updates }
        setPhases(newPhases)
    }

    const togglePhase = (index: number) => {
        setExpandedPhaseIndex(expandedPhaseIndex === index ? null : index)
    }

    const totalDuration = phases.reduce((acc, p) => acc + ((p.in + p.holdIn + p.out + p.holdOut) * (p.rounds || 1)), 0)

    return (
        <div className="bg-white border rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6">
                <div className="space-y-1">
                    <h3 className="text-2xl font-light text-stone-800 flex items-center gap-2">
                        <Wind className="w-6 h-6 text-teal-600" />
                        Breathing Studio
                    </h3>
                    <p className="text-sm text-stone-500">Create custom breathing sequences.</p>
                </div>
                <div className="flex items-center gap-3 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
                    <Clock className="w-4 h-4 text-stone-400" />
                    <span className="text-sm font-medium text-stone-600">
                        {Math.floor(totalDuration / 60)}m {totalDuration % 60}s total
                    </span>
                </div>
            </header>

            <div className="space-y-8 max-w-5xl mx-auto">
                {/* Meta Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Exercise Name</Label>
                        <Input
                            id="title"
                            value={exerciseTitle}
                            onChange={(e) => setExerciseTitle(e.target.value)}
                            placeholder="e.g. Morning Awakening"
                            className="bg-stone-50 border-stone-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="desc">Pro Tip / Instructions</Label>
                        <Textarea
                            id="desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Explain the benefits or give instructions..."
                            className="bg-stone-50 border-stone-200 h-[42px] min-h-[42px] py-2 resize-none focus:min-h-[80px] transition-all"
                        />
                    </div>
                </div>

                {/* Phases List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-base text-stone-700">Sequence</Label>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={addPhase}
                            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Phase
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {phases.map((phase, index) => {
                            const isExpanded = expandedPhaseIndex === index
                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "border rounded-2xl transition-all duration-300 overflow-hidden",
                                        isExpanded ? "bg-white border-stone-300 shadow-md ring-1 ring-stone-100" : "bg-white border-stone-200 hover:border-stone-300"
                                    )}
                                >
                                    {/* Phase Header */}
                                    <div
                                        onClick={() => togglePhase(index)}
                                        className="flex items-center gap-4 p-4 cursor-pointer select-none"
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors",
                                            isExpanded ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-500"
                                        )}>
                                            {index + 1}
                                        </div>

                                        <div className="flex-1 grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_auto] gap-4 items-center">
                                            {/* Name Input - Always visible but specific width */}
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <Input
                                                    value={phase.name}
                                                    onChange={(e) => updatePhase(index, { name: e.target.value })}
                                                    className="border-transparent bg-transparent hover:bg-stone-50 px-2 -ml-2 font-medium text-stone-800 focus:bg-white focus:border-stone-200 transition-colors w-full md:w-64"
                                                    placeholder="Phase Name"
                                                />
                                            </div>

                                            {/* Summary (Desktop) */}
                                            <div className="hidden md:block text-xs text-stone-400 font-mono">
                                                {phase.in}-{phase.holdIn}-{phase.out}-{phase.holdOut} • {phase.rounds}x
                                            </div>

                                            {/* Expand Icon */}
                                            <div className="text-stone-400">
                                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Editor */}
                                    {isExpanded && (
                                        <div className="px-4 pb-6 pt-2 border-t border-stone-100 bg-stone-50/30 space-y-8 animate-in slide-in-from-top-2 fade-in duration-300">

                                            {/* Rounds Control */}
                                            <div className="flex justify-center py-2">
                                                <Stepper
                                                    label="Rounds"
                                                    value={phase.rounds || 1}
                                                    onValueChange={(v) => updatePhase(index, { rounds: v })}
                                                    steps={[1, 3]}
                                                    min={1}
                                                    max={50}
                                                    className="w-full max-w-[200px]"
                                                />
                                            </div>

                                            {/* Rhythm Controls */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Stepper
                                                    label="Inhale"
                                                    value={phase.in}
                                                    onValueChange={(v) => updatePhase(index, { in: v })}
                                                    steps={[1, 2, 5]}
                                                    min={1} max={60}
                                                    unit="s"
                                                    className="w-full justify-self-center"
                                                />
                                                <Stepper
                                                    label="Hold (Full)"
                                                    value={phase.holdIn}
                                                    onValueChange={(v) => updatePhase(index, { holdIn: v })}
                                                    steps={[1, 2, 5]}
                                                    min={0} max={60}
                                                    unit="s"
                                                    className="w-full justify-self-center"
                                                />
                                                <Stepper
                                                    label="Exhale"
                                                    value={phase.out}
                                                    onValueChange={(v) => updatePhase(index, { out: v })}
                                                    steps={[1, 2, 5]}
                                                    min={1} max={60}
                                                    unit="s"
                                                    className="w-full justify-self-center"
                                                />
                                                <Stepper
                                                    label="Hold (Empty)"
                                                    value={phase.holdOut}
                                                    onValueChange={(v) => updatePhase(index, { holdOut: v })}
                                                    steps={[1, 2, 5]}
                                                    min={0} max={60}
                                                    unit="s"
                                                    className="w-full justify-self-center"
                                                />
                                            </div>

                                            {/* Visual Preview Bar */}
                                            <div className="pt-4 flex flex-col items-center gap-2">
                                                <div className="flex w-full max-w-md h-2 rounded-full overflow-hidden bg-stone-200">
                                                    <div style={{ flex: phase.in }} className="bg-emerald-400" />
                                                    <div style={{ flex: phase.holdIn }} className="bg-stone-400" />
                                                    <div style={{ flex: phase.out }} className="bg-blue-400" />
                                                    <div style={{ flex: phase.holdOut }} className="bg-stone-400" />
                                                </div>
                                                <div className="text-[10px] text-stone-400 font-mono uppercase tracking-widest">
                                                    Pattern Visualization
                                                </div>
                                            </div>

                                            {/* Delete Phase */}
                                            <div className="flex justify-end pt-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removePhase(index)}
                                                    disabled={phases.length === 1}
                                                    className="text-stone-400 hover:text-red-500 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Remove Phase
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button onClick={handleSave} className="w-full md:w-auto px-8 h-12 rounded-full font-medium shadow-sm hover:shadow-md transition-all">
                        <Save className="w-4 h-4 mr-2" />
                        Save Exercise
                    </Button>
                </div>
            </div>
        </div>
    )
}
