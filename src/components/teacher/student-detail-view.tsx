"use client"

import { useState } from "react"
import { useStudentStore } from "@/store/student-store"
import { useSessionStore, Session } from "@/store/session-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Calendar, CheckCircle, Clock, Pencil, Mic, Wind, FileText } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { SessionForm, SessionFormValues } from "./session-form"
import { toast } from "sonner"

interface StudentDetailViewProps {
    studentId: string
}

export function StudentDetailView({ studentId }: StudentDetailViewProps) {
    const student = useStudentStore(state => state.students.find(s => s.id === studentId))
    const { sessions, updateSession } = useSessionStore()
    const studentSessions = sessions.filter(s => s.studentId === studentId)

    // State for the edit dialog
    const [editingSession, setEditingSession] = useState<Session | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    if (!student) return (
        <div className="h-full flex items-center justify-center text-stone-400 border border-dashed rounded-2xl">
            Select a student to view details
        </div>
    )

    const completedSessions = studentSessions.filter(s => s.status === 'completed').length
    const progressPercent = Math.min(100, Math.round((completedSessions / student.programLength) * 100))

    const handleUpdateActiveSession = (data: SessionFormValues) => {
        if (editingSession) {
            updateSession(editingSession.id, {
                studentId: data.studentId,
                title: data.title,
                date: format(data.date, "yyyy-MM-dd"), // Ensure date is formatted simply
                status: data.status,
                description: data.description,
                isHabit: data.isHabit,
                unlockTime: data.unlockTime,
                audioAssetId: data.audioAssetId,
                breathingPatternId: data.breathingPatternId
            })
            toast.success("Session updated successfully")
            setIsEditDialogOpen(false)
            setEditingSession(null)
        }
    }

    const openEditDialog = (session: Session) => {
        setEditingSession(session)
        setIsEditDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <header className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-light text-stone-800">{student.name}</h2>
                    <Badge variant="outline" className="text-xs">
                        Start Date: {student.startDate}
                    </Badge>
                </div>
                <div className="flex items-center gap-2 text-stone-500 text-sm">
                    <Target className="w-4 h-4" />
                    <span>Goal: {student.goal}</span>
                </div>
            </header>

            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-stone-50 border-none shadow-none">
                    <CardContent className="p-4 space-y-2">
                        <p className="text-xs text-stone-500 uppercase tracking-wider">Progress</p>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-light text-primary">{completedSessions}</span>
                            <span className="text-stone-400 mb-1">/ {student.programLength} {student.programType}</span>
                        </div>
                        <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-stone-50 border-none shadow-none">
                    <CardContent className="p-4 space-y-2">
                        <p className="text-xs text-stone-500 uppercase tracking-wider">Next Milestone</p>
                        <div className="flex items-center gap-2 mt-2">
                            <CheckCircle className="w-5 h-5 text-stone-300" />
                            <span className="text-sm text-stone-600">Finish Week 3 Guide</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-medium text-stone-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Session History
                </h3>
                <ScrollArea className="h-[300px] border rounded-xl bg-white">
                    <div className="p-4 space-y-3">
                        {studentSessions.length === 0 ? (
                            <p className="text-center text-stone-400 py-8 text-sm">No sessions scheduled yet</p>
                        ) : (
                            studentSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(session => (
                                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border border-stone-100 hover:bg-stone-50 transition-colors group">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium text-stone-800">{session.title}</p>
                                        <p className="text-xs text-stone-500">{format(new Date(session.date), 'MMM dd, yyyy')}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 mr-1">
                                            {session.audioAssetId && (
                                                <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100" title="Audio Guide">
                                                    <Mic className="w-2.5 h-2.5 text-amber-600" />
                                                </div>
                                            )}
                                            {session.breathingPatternId && (
                                                <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100" title="Breathing Exercise">
                                                    <Wind className="w-2.5 h-2.5 text-teal-600" />
                                                </div>
                                            )}
                                            {session.documentAssetId && (
                                                <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100" title="Document/Material">
                                                    <FileText className="w-2.5 h-2.5 text-indigo-600" />
                                                </div>
                                            )}
                                        </div>
                                        <Badge
                                            variant={session.status === 'completed' ? 'secondary' : 'outline'}
                                            className="text-[10px] capitalize"
                                        >
                                            {session.status}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8 opacity-50 hover:opacity-100 transition-opacity"
                                            onClick={() => openEditDialog(session)}
                                        >
                                            <Pencil className="w-3 h-3 text-stone-400" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Edit Session</DialogTitle>
                            <DialogDescription>
                                Make changes to this session&apos;s details and assignments.
                            </DialogDescription>
                        </DialogHeader>
                        {editingSession && (
                            <SessionForm
                                initialData={editingSession}
                                studentId={studentId}
                                isEditing={true}
                                onSubmit={handleUpdateActiveSession}
                                onCancel={() => setIsEditDialogOpen(false)}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
