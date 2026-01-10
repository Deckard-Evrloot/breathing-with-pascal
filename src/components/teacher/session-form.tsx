/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useStudentStore } from "@/store/student-store"
import { useAssetStore } from "@/store/asset-store"
import { Session } from "@/store/session-store"
import { useEffect } from "react"
import { Lock, PlayCircle, CheckCircle2, Music, Wind, FileText, Info } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const FormSchema = z.object({
    studentId: z.string().min(1, "Please select a student."),
    title: z.string().min(2, "Title must be at least 2 characters."),
    date: z.date(),
    isHabit: z.boolean().default(false),
    unlockTime: z.string().optional(),
    audioAssetId: z.string().optional(),
    breathingPatternId: z.string().optional(),
    documentAssetId: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["locked", "active", "completed"]),
})

export type SessionFormValues = z.infer<typeof FormSchema>

interface SessionFormProps {
    initialData?: Session
    studentId?: string
    onSubmit: (data: SessionFormValues) => void
    isEditing?: boolean
    onCancel?: () => void
    onStudentChange?: (studentId: string) => void
}

export function SessionForm({ initialData, studentId, onSubmit, isEditing = false, onCancel, onStudentChange }: SessionFormProps) {
    const { students } = useStudentStore()
    const { assets } = useAssetStore()

    const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name))
    const audioGuides = assets.filter(a => a.type === 'audio')
    const breathingPatterns = assets.filter(a => a.type === 'breathing')
    const documents = assets.filter(a => a.type === 'pdf' || a.type === 'video')

    const form = useForm<SessionFormValues>({
        // @ts-expect-error - Resolver types are compatible but strict checking fails
        resolver: zodResolver(FormSchema),
        defaultValues: {
            studentId: initialData?.studentId || studentId || "",
            title: initialData?.title || "",
            date: initialData?.date ? new Date(initialData.date) : new Date(),
            isHabit: initialData?.isHabit || false,
            description: initialData?.description || "",
            status: initialData?.status || "locked",
            audioAssetId: initialData?.audioAssetId || "none",
            breathingPatternId: initialData?.breathingPatternId || "none",
            documentAssetId: initialData?.documentAssetId || "none",
        },
    })

    const selectedStudentId = useWatch({ control: form.control, name: "studentId" })
    useEffect(() => {
        if (onStudentChange && selectedStudentId) {
            onStudentChange(selectedStudentId)
        }
    }, [selectedStudentId, onStudentChange])

    useEffect(() => {
        if (initialData) {
            form.reset({
                studentId: initialData.studentId,
                title: initialData.title,
                date: new Date(initialData.date),
                isHabit: initialData.isHabit || false,
                description: initialData.description || "",
                status: initialData.status,
                audioAssetId: initialData.audioAssetId || "none",
                breathingPatternId: initialData.breathingPatternId || "none",
                documentAssetId: initialData.documentAssetId || "none",
            })
        }
    }, [initialData, form])

    const handleSubmit = (data: SessionFormValues) => {
        const processedData = {
            ...data,
            audioAssetId: data.audioAssetId === "none" ? undefined : data.audioAssetId,
            breathingPatternId: data.breathingPatternId === "none" ? undefined : data.breathingPatternId,
            documentAssetId: data.documentAssetId === "none" ? undefined : data.documentAssetId,
        }
        onSubmit(processedData as SessionFormValues)
        if (!isEditing) {
            form.reset({
                studentId: data.studentId,
                title: "",
                date: new Date(),
                isHabit: false,
                description: "",
                status: "locked",
                audioAssetId: "none",
                breathingPatternId: "none",
                documentAssetId: "none",
            })
            // Explicitly set studentId to ensure it persists in the form state
            form.setValue("studentId", data.studentId)
        }
    }

    const currentStatus = form.watch("status")

    return (
        <Form {...form}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Primary Details */}
                    <div className="space-y-6">
                        <FormField
                            control={form.control as any}
                            name="studentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-stone-500 font-normal">Target Student</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-14 rounded-2xl bg-stone-50/50 border-stone-200 hover:bg-white hover:border-primary/20 transition-all">
                                                <SelectValue placeholder="Select a student" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sortedStudents.map(student => (
                                                <SelectItem key={student.id} value={student.id}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-[10px]">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        {student.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-stone-500 font-normal">Practice Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Heart Opening Journey"
                                            className="h-12 rounded-xl bg-stone-50/50 border-stone-200 focus:bg-white transition-colors"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control as any}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-stone-500 font-normal">Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "h-12 w-full pl-3 text-left font-normal rounded-xl bg-stone-50/50 border-stone-200",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "d. MMM")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as any}
                                name="isHabit"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col justify-end">
                                        <div className="flex items-center space-x-3 h-12 px-3 border border-stone-100 rounded-xl bg-stone-50/30">
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="cursor-pointer text-sm text-stone-600 font-normal m-0">Daily Habit</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Status & Options */}
                    <div className="space-y-6">
                        <FormField
                            control={form.control as any}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-stone-500 font-normal">Visibility Status</FormLabel>
                                    <TooltipProvider>
                                        <div className="grid grid-cols-3 gap-2 bg-stone-100/80 p-1 rounded-2xl border border-stone-200">
                                            {[
                                                { id: 'locked', label: 'Locked', icon: <Lock className="w-4 h-4" /> },
                                                { id: 'active', label: 'Active', icon: <PlayCircle className="w-4 h-4" /> },
                                                { id: 'completed', label: 'Done', icon: <CheckCircle2 className="w-4 h-4" /> },
                                            ].map((opt) => (
                                                <Tooltip key={opt.id} delayDuration={300}>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            type="button"
                                                            onClick={() => field.onChange(opt.id)}
                                                            className={cn(
                                                                "flex flex-col items-center justify-center py-3.5 px-2 rounded-xl border transition-all h-12 w-full",
                                                                field.value === opt.id
                                                                    ? "bg-white shadow-sm border-stone-200 text-stone-900"
                                                                    : "border-transparent text-stone-400 hover:text-stone-600"
                                                            )}
                                                        >
                                                            {opt.icon}
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="bottom" className="text-[10px] font-medium uppercase tracking-wider">
                                                        {opt.label}
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </TooltipProvider>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-stone-500 font-normal flex items-center gap-1.5">
                                        <Info className="w-3.5 h-3.5" />
                                        Personal Note
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write a message for your student..."
                                            className="rounded-xl bg-stone-50/50 border-stone-200 min-h-[110px] focus:bg-white transition-colors"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="h-px bg-stone-100 my-4" />

                {/* Content Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control as any}
                        name="audioAssetId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-stone-500 font-normal flex items-center gap-2">
                                    <Music className="w-4 h-4" />
                                    Audio Guide
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-14 rounded-2xl bg-white border-stone-200 shadow-sm hover:border-primary/30 transition-colors">
                                            <SelectValue placeholder="Add an audio guide" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">No Audio Guide</SelectItem>
                                        {audioGuides.map(asset => (
                                            <SelectItem key={asset.id} value={asset.id}>
                                                {asset.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control as any}
                        name="breathingPatternId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-stone-500 font-normal flex items-center gap-2">
                                    <Wind className="w-4 h-4" />
                                    Breathing Sequence
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-14 rounded-2xl bg-white border-stone-200 shadow-sm hover:border-primary/30 transition-colors">
                                            <SelectValue placeholder="Add a breathing pattern" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">No Pattern</SelectItem>
                                        {breathingPatterns.map(asset => (
                                            <SelectItem key={asset.id} value={asset.id}>
                                                {asset.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-8 mt-8">
                    <FormField
                        control={form.control as any}
                        name="documentAssetId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-stone-500 font-normal flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Accompanying Material
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-14 rounded-2xl bg-white border-stone-200 shadow-sm hover:border-primary/30 transition-colors">
                                            <SelectValue placeholder="Add a PDF or Video" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">No Document/Video</SelectItem>
                                        {documents.map(asset => (
                                            <SelectItem key={asset.id} value={asset.id}>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[8px] uppercase px-1 py-0 h-4">{asset.type}</Badge>
                                                    {asset.title}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="pt-4 flex gap-4">
                    {onCancel && (
                        <Button type="button" variant="ghost" onClick={onCancel} className="h-14 px-8 rounded-2xl border border-transparent hover:border-stone-200">
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" className="flex-1 h-14 rounded-2xl gap-3 text-lg font-normal shadow-lg shadow-primary/10 transition-all hover:translate-y-[-1px] hover:shadow-xl active:translate-y-[1px]">
                        {isEditing ? "Update Session" : "Schedule Practice"}
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </div>
            </form>
        </Form>
    )
}
