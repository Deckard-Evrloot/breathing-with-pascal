"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { useSessionStore, Session } from "@/store/session-store"
import { format, isSameDay, parseISO } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wind, Users, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

function Badge({ children, variant = 'outline', className }: { children: React.ReactNode, variant?: 'outline' | 'secondary', className?: string }) {
    return (
        <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-medium border",
            variant === 'secondary' ? "bg-stone-100 border-stone-200 text-stone-600" : "border-stone-200 text-stone-500",
            className
        )}>
            {children}
        </span>
    )
}

export function TeacherCalendar() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const { sessions } = useSessionStore()

    // Get sessions for selected day
    const selectedSessions = sessions.filter(s => {
        if (!date) return false
        const sessionDate = parseISO(s.date)
        return isSameDay(sessionDate, date)
    })

    // Dates with sessions for calendar indicators
    const sessionDates = sessions.map(s => parseISO(s.date))

    return (
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
            <Card className="border-border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <Wind className="w-5 h-5 text-primary" />
                        Schedule
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border-none p-3 pointer-events-auto"
                        modifiers={{
                            hasSession: sessionDates
                        }}
                        modifiersStyles={{
                            hasSession: {
                                fontWeight: 'bold',
                                color: 'var(--primary)',
                                textDecoration: 'underline decoration-2 underline-offset-4 decoration-accent/50'
                            }
                        }}
                    />
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
                    {date ? format(date, "MMMM do") : "Select a day"}
                </h3>

                <ScrollArea className="h-[320px] pr-4">
                    <div className="space-y-3">
                        {selectedSessions.length > 0 ? (
                            selectedSessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="p-4 rounded-xl bg-white border border-border shadow-sm hover:border-accent/30 transition-colors group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-stone-800 leading-tight">{session.title}</h4>
                                        <Badge variant={session.status === 'completed' ? 'secondary' : 'outline'} className="text-[10px] uppercase">
                                            {session.status}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center text-xs text-stone-500 gap-1.5">
                                            <Users className="w-3 h-3" />
                                            <span>{session.studentId === 'student_tobi' ? 'Tobi' : 'Unknown Student'}</span>
                                        </div>
                                        {session.isHabit && (
                                            <div className="flex items-center text-xs text-accent gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                <span>{session.unlockTime || 'Daily'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-center py-8 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                                <p className="text-sm text-stone-400">No sessions scheduled</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
