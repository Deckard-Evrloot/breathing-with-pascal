"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Plus, Minus } from "lucide-react"

interface StepperProps {
    value: number
    onValueChange: (value: number) => void
    steps?: number[] // e.g. [1, 5] means buttons for +/-1 and +/-5
    min?: number
    max?: number
    label?: string
    unit?: string
    className?: string
}

export function Stepper({
    value,
    onValueChange,
    steps = [1],
    min = 0,
    max = 99,
    label,
    unit,
    className
}: StepperProps) {

    const updateValue = (delta: number) => {
        const newValue = Math.min(max, Math.max(min, value + delta))
        onValueChange(newValue)
    }

    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            {label && <span className="text-xs font-medium text-stone-500 uppercase tracking-wider text-center">{label}</span>}

            <div className="flex items-center justify-center gap-2 flex-wrap sm:flex-nowrap">
                {/* Decrement Buttons */}
                <div className="flex gap-1 shrink-0">
                    {steps.slice().reverse().map(step => (
                        <Button
                            key={`minus-${step}`}
                            variant="outline"
                            size="sm"
                            onClick={() => updateValue(-step)}
                            disabled={value <= min}
                            className="h-9 w-9 p-0 rounded-lg hover:bg-stone-100 hover:text-red-600 border-stone-200 text-stone-400 shrink-0"
                            title={`-${step}`}
                        >
                            <span className="text-xs font-medium">-{step}</span>
                        </Button>
                    ))}
                </div>

                {/* Value Display */}
                <div className="flex-1 min-w-[60px] h-9 flex items-center justify-center bg-stone-50 rounded-lg border border-stone-100 px-2 shrink-0">
                    <span className="font-mono font-medium text-stone-700">
                        {value}
                        {unit && <span className="text-stone-400 ml-0.5 text-xs">{unit}</span>}
                    </span>
                </div>

                {/* Increment Buttons */}
                <div className="flex gap-1 shrink-0">
                    {steps.map(step => (
                        <Button
                            key={`plus-${step}`}
                            variant="outline"
                            size="sm"
                            onClick={() => updateValue(step)}
                            disabled={value >= max}
                            className="h-9 w-9 p-0 rounded-lg hover:bg-stone-100 hover:text-emerald-600 border-stone-200 text-stone-400 shrink-0"
                            title={`+${step}`}
                        >
                            <span className="text-xs font-medium">+{step}</span>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}
