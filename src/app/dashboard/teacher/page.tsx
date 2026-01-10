"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MediaRecorder } from "@/components/teacher/media-recorder"
import { BreathingManager } from "@/components/teacher/breathing-manager"
import { DocumentViewer } from "@/components/teacher/document-viewer"
import { SessionManager } from "@/components/teacher/session-manager"
import { AssetLibrary } from "@/components/teacher/asset-library"
import { TeacherCalendar } from "@/components/teacher/teacher-calendar"
import { StudentManager } from "@/components/teacher/student-manager"
import { StudentDetailView } from "@/components/teacher/student-detail-view"
import { Users, Calendar, PlayCircle, Library } from "lucide-react"

export default function TeacherDashboard() {
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>("student_tobi")

    return (
        <div className="container mx-auto p-6 space-y-8 max-w-7xl">
            <header className="flex flex-col space-y-2">
                <h1 className="text-4xl font-light text-primary tracking-tight">Teacher Dashboard</h1>
                <p className="text-stone-500">Manage your students, sessions, and practice content.</p>
            </header>

            <Tabs defaultValue="students" className="space-y-8">
                <div className="sticky top-14 z-30 bg-white/80 backdrop-blur-xl py-4 -mx-6 px-6 border-b border-stone-100/50">
                    <TabsList className="bg-stone-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto justify-start">
                        <TabsTrigger value="students" className="gap-2 rounded-lg px-4 flex-1 sm:flex-none">
                            <Users className="w-4 h-4" />
                            Students
                        </TabsTrigger>
                        <TabsTrigger value="sessions" className="gap-2 rounded-lg px-4 flex-1 sm:flex-none">
                            <Calendar className="w-4 h-4" />
                            Sessions
                        </TabsTrigger>
                        <TabsTrigger value="studio" className="gap-2 rounded-lg px-4 flex-1 sm:flex-none">
                            <PlayCircle className="w-4 h-4" />
                            Studio
                        </TabsTrigger>
                        <TabsTrigger value="library" className="gap-2 rounded-lg px-4 flex-1 sm:flex-none">
                            <Library className="w-4 h-4" />
                            Library
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="students" className="animate-in fade-in-50 duration-500">
                    <div className="grid lg:grid-cols-[380px_1fr] gap-10">
                        <StudentManager onSelectStudent={setSelectedStudentId} />
                        <div className="bg-white border rounded-3xl p-8 min-h-[600px] shadow-sm">
                            {selectedStudentId ? (
                                <StudentDetailView studentId={selectedStudentId} />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center">
                                        <Users className="w-8 h-8 text-stone-200" />
                                    </div>
                                    <p>Select a student to view their journey</p>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="sessions" className="animate-in fade-in-50 duration-500">
                    <div className="grid lg:grid-cols-[400px_1fr] gap-10">
                        <SessionManager />
                        <TeacherCalendar />
                    </div>
                </TabsContent>

                <TabsContent value="studio" className="space-y-8">
                    <div className="flex flex-col gap-12">
                        <div className="space-y-4">
                            <h2 className="text-xl font-medium text-stone-800">Breath Guide Recorder</h2>
                            <MediaRecorder />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-xl font-medium text-stone-800">Guided Breathing Designer</h2>
                            <BreathingManager />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="library" className="space-y-6">
                    <header>
                        <h2 className="text-2xl font-light text-stone-800">Asset Library</h2>
                        <p className="text-stone-500 text-sm">Your collection of guides, papers, and recordings.</p>
                    </header>
                    <AssetLibrary />
                </TabsContent>
            </Tabs>
        </div>
    )
}

