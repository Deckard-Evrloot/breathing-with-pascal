"use client"

import { useState } from "react"
import { Check, Paperclip, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface HomeworkInputProps {
    sessionId: string
    initialComplete?: boolean
}

export function HomeworkInput({ sessionId, initialComplete = false }: HomeworkInputProps) {
    const [complete, setComplete] = useState(initialComplete)
    const [text, setText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hasFile, setHasFile] = useState(false)

    const handleToggle = async (checked: boolean) => {
        // Optimistic Logic
        setComplete(checked)
        if (checked) {
            toast.success("Practice recorded")
            // Fire and forget sync to DB
        }
    }

    const handleSubmitText = async () => {
        if (!text) return
        setIsSubmitting(true)
        // Mock API
        await new Promise(r => setTimeout(r, 1000))
        toast.success("Reflection saved")
        setIsSubmitting(false)
    }

    return (
        <div className="bg-stone-50 rounded-xl p-6 border border-stone-200 mt-6 space-y-6">
            <div className="flex items-center justify-between">
                <h4 className="font-medium text-stone-800">Your Practice</h4>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={`complete-${sessionId}`}
                        checked={complete}
                        onCheckedChange={handleToggle}
                        className="w-6 h-6 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor={`complete-${sessionId}`} className="text-sm font-medium cursor-pointer">Mark Complete</Label>
                </div>
            </div>

            <div className="space-y-3">
                <Label>Journal & Reflection</Label>
                <Textarea
                    placeholder="How did this session feel?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="bg-white border-stone-200 min-h-[100px]"
                />
                <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm" className="text-stone-600 gap-2">
                        <Paperclip className="w-4 h-4" />
                        {hasFile ? "File Attached" : "Attach File"}
                    </Button>

                    <Button size="sm" onClick={handleSubmitText} disabled={isSubmitting || !text}>
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Note"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
