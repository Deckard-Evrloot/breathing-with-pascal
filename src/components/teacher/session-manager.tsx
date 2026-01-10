"use client"

import { useState } from "react"
import { useStudentStore } from "@/store/student-store"
import { useSessionStore, Session } from "@/store/session-store"
import { SessionForm, SessionFormValues } from "./session-form"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { toast } from "sonner"
import {
    Calendar,
    Lock,
    Unlock,
    CheckCircle2,
    MoreVertical,
    Edit,
    Trash2,
    PlayCircle,
    Mic,
    Wind,
    FileText
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function SessionManager() {
    const { students } = useStudentStore()
    const {
        getSessionsForStudent,
        addSession,
        updateSession,
        unlockAllSessions,
        deleteSession
    } = useSessionStore()

    // Sort students by name for better UX
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name))

    const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
    const [selectedStudentId, setSelectedStudentId] = useState<string>("")

    const existingSessions = selectedStudentId ? getSessionsForStudent(selectedStudentId) : []
    const editingSession = editingSessionId ? existingSessions.find(s => s.id === editingSessionId) : undefined

    const handleSubmit = (data: SessionFormValues) => {
        if (editingSessionId) {
            updateSession(editingSessionId, {
                studentId: data.studentId,
                title: data.title,
                date: format(data.date, "yyyy-MM-dd"),
                status: data.status,
                description: data.description,
                isHabit: data.isHabit,
                unlockTime: data.unlockTime,
                audioAssetId: data.audioAssetId,
                breathingPatternId: data.breathingPatternId
            })
            toast.info("Session updated successfully")
            setEditingSessionId(null)
        } else {
            addSession({
                studentId: data.studentId,
                title: data.title,
                date: format(data.date, "yyyy-MM-dd"),
                status: data.status,
                description: data.description,
                isHabit: data.isHabit,
                unlockTime: data.unlockTime,
                audioAssetId: data.audioAssetId,
                breathingPatternId: data.breathingPatternId
            })
            const studentName = students.find(s => s.id === data.studentId)?.name
            toast.success(`Session "${data.title}" created for ${studentName}`)

            // Keep the same student selected for the next assignment as per user request
            setSelectedStudentId(data.studentId)
        }
    }

    const startEditing = (session: Session) => {
        setEditingSessionId(session.id)
        setSelectedStudentId(session.studentId)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = (sessionId: string) => {
        if (confirm("Are you sure you want to delete this session?")) {
            deleteSession(sessionId)
            toast.success("Session deleted")
        }
    }

    const handleUnlockAll = () => {
        if (selectedStudentId) {
            unlockAllSessions(selectedStudentId)
            toast.success("All sessions for this student have been unlocked!")
        }
    }

    return (
        <div className="space-y-8">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <header className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-xl font-light text-stone-800">
                            {editingSessionId ? "Edit Session" : "Assign Session"}
                        </h3>
                        <p className="text-sm text-stone-500">
                            {editingSessionId ? "Update existing session details." : "Schedule a new practice for your student."}
                        </p>
                    </div>
                    {editingSessionId && (
                        <Button variant="ghost" size="sm" onClick={() => setEditingSessionId(null)}>
                            Cancel Edit
                        </Button>
                    )}
                </header>

                <SessionForm
                    initialData={editingSession}
                    onSubmit={handleSubmit}
                    isEditing={!!editingSessionId}
                    onCancel={() => setEditingSessionId(null)}
                    studentId={selectedStudentId}
                    onStudentChange={setSelectedStudentId}
                />
            </div>

            {selectedStudentId && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-medium text-stone-800">
                            Scheduled Sessions
                            <span className="ml-2 text-sm font-normal text-stone-400">
                                ({existingSessions.length})
                            </span>
                        </h3>
                        {existingSessions.some(s => s.status === 'locked') && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleUnlockAll}
                                className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 shadow-sm transition-all hover:scale-105 active:scale-95"
                            >
                                <Unlock className="w-4 h-4 mr-2" />
                                Unlock All Sessions
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {existingSessions.length === 0 ? (
                            <div className="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                                <p className="text-stone-500">No sessions scheduled heavily yet.</p>
                            </div>
                        ) : (
                            existingSessions
                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                .map((session) => (
                                    <div
                                        key={session.id}
                                        className={cn(
                                            "group flex items-center justify-between p-4 bg-white rounded-xl border transition-all hover:shadow-sm",
                                            editingSessionId === session.id ? "ring-2 ring-stone-900 border-transparent" : "border-stone-100"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center",
                                                session.status === 'completed' ? "bg-green-100 text-green-700" :
                                                    session.status === 'active' ? "bg-stone-100 text-stone-700" :
                                                        "bg-stone-50 text-stone-400"
                                            )}>
                                                {session.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                                                    session.status === 'active' ? <PlayCircle className="w-5 h-5" /> :
                                                        <Lock className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-stone-800">{session.title}</h4>
                                                <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                                                    <span className="flex items-center">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {format(new Date(session.date), "MMM d, yyyy")}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 mx-1">
                                                        {session.audioAssetId && (
                                                            <div className="w-4 h-4 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100" title="Audio Guide">
                                                                <Mic className="w-2 h-2 text-amber-600" />
                                                            </div>
                                                        )}
                                                        {session.breathingPatternId && (
                                                            <div className="w-4 h-4 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100" title="Breathing Exercise">
                                                                <Wind className="w-2 h-2 text-teal-600" />
                                                            </div>
                                                        )}
                                                        {session.documentAssetId && (
                                                            <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100" title="Document/Material">
                                                                <FileText className="w-2 h-2 text-indigo-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {session.isHabit && (
                                                        <span className="bg-stone-100 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide">
                                                            Habit
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => updateSession(session.id, {
                                                            status: session.status === 'locked' ? 'active' : 'locked'
                                                        })}
                                                        className={cn(
                                                            "px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide transition-colors border",
                                                            session.status === 'locked'
                                                                ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                                                : session.status === 'completed'
                                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                                    : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                                        )}
                                                    >
                                                        {session.status}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-stone-600">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => startEditing(session)}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                                    onClick={() => handleDelete(session.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
