"use client"

import { useState } from "react"
import { useStudentStore, Student } from "@/store/student-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, User, Target, Calendar, ChevronRight } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface StudentManagerProps {
    onSelectStudent: (id: string) => void
}

export function StudentManager({ onSelectStudent }: StudentManagerProps) {
    const { students, addStudent } = useStudentStore()
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newName, setNewName] = useState("")
    const [newGoal, setNewGoal] = useState("")
    const [programType, setProgramType] = useState<'sessions' | 'weeks'>("weeks")
    const [programLength, setProgramLength] = useState("10")

    const handleAddStudent = () => {
        if (!newName || !newGoal) {
            toast.error("Please fill in name and goal")
            return
        }

        addStudent({
            name: newName,
            goal: newGoal,
            programType: programType,
            programLength: parseInt(programLength),
            startDate: new Date().toISOString().split('T')[0],
        })

        toast.success(`Student ${newName} created!`)
        setIsAddOpen(false)
        setNewName("")
        setNewGoal("")
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-medium text-stone-800">Your Students</h2>
                    <p className="text-sm text-stone-500">Manage and track your breathwork students.</p>
                </div>
                <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <SheetTrigger asChild>
                        <Button className="rounded-full gap-2 px-6 h-11 bg-stone-900 hover:bg-stone-800 text-white shadow-lg shadow-stone-200">
                            <Plus className="w-4 h-4" />
                            Add Student
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-md border-l border-stone-100 p-0 flex flex-col">
                        <SheetHeader className="p-8 border-b border-stone-50 bg-stone-50/50">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                                <Plus className="w-6 h-6" />
                            </div>
                            <SheetTitle className="text-2xl font-medium text-stone-900">New Student Profile</SheetTitle>
                            <SheetDescription className="text-stone-500">
                                Create a managed account and define their breathwork journey.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Personal Info */}
                            <div className="space-y-4">
                                <Label className="text-xs uppercase tracking-wider text-stone-400 font-semibold px-1">Basic Information</Label>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                placeholder="Full Name"
                                                className="pl-10 h-12 bg-stone-50 border-stone-200 focus:bg-white transition-all rounded-xl"
                                                value={newName}
                                                onChange={e => setNewName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                placeholder="Primary Goal (e.g. Anxiety relief)"
                                                className="pl-10 h-12 bg-stone-50 border-stone-200 focus:bg-white transition-all rounded-xl"
                                                value={newGoal}
                                                onChange={e => setNewGoal(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Journey Setup */}
                            <div className="space-y-4">
                                <Label className="text-xs uppercase tracking-wider text-stone-400 font-semibold px-1 text-stone-400">Program Journey</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400 pointer-events-none" />
                                            <Select value={programType} onValueChange={(v: 'sessions' | 'weeks') => setProgramType(v)}>
                                                <SelectTrigger className="h-12 pl-10 bg-stone-50 border-stone-200 rounded-xl text-xs">
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-stone-100 shadow-xl">
                                                    <SelectItem value="sessions" className="text-xs">Sessions</SelectItem>
                                                    <SelectItem value="weeks" className="text-xs">Weeks</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Input
                                            type="number"
                                            placeholder="Length"
                                            className="h-12 bg-stone-50 border-stone-200 focus:bg-white transition-all rounded-xl text-xs"
                                            value={programLength}
                                            onChange={e => setProgramLength(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-stone-400 px-1 italic">
                                    The program will be structured over {programLength} {programType}.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 bg-stone-50/30 border-t border-stone-100">
                            <Button
                                className="w-full h-12 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium"
                                onClick={handleAddStudent}
                            >
                                Create Profile
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex flex-col gap-4">
                {students.map(student => (
                    <Card
                        key={student.id}
                        className="group border border-stone-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer rounded-2xl bg-white overflow-hidden"
                        onClick={() => onSelectStudent(student.id)}
                    >
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-500 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5 min-w-0">
                                        <h3 className="text-base font-medium text-stone-800 group-hover:text-stone-900 transition-colors truncate">{student.name}</h3>
                                        <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                                            <Calendar className="w-3 h-3" />
                                            <span>Joined {new Date(student.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-primary transition-colors shrink-0" />
                            </div>

                            <div className="mt-4 pt-4 border-t border-stone-50 space-y-3">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-stone-400">Goal</span>
                                    <span className="font-medium text-stone-700 truncate max-w-[150px]">{student.goal}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-stone-400">Program</span>
                                    <Badge variant="secondary" className="text-[9px] font-medium bg-stone-900/5 text-stone-600 border-none px-2 h-5">
                                        {student.programLength} {student.programType}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-4 p-5 border-2 border-dashed border-stone-100 rounded-2xl hover:border-primary/20 hover:bg-stone-50/50 transition-all group"
                >
                    <div className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-300 group-hover:text-primary group-hover:border-primary/20 transition-all shrink-0">
                        <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-stone-400 group-hover:text-stone-600 transition-colors">Add New Student</span>
                </button>
            </div>
        </div>
    )
}
