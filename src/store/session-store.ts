import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Session {
    id: string
    studentId: string
    title: string
    date: string // ISO string or simple date string
    status: 'locked' | 'active' | 'completed'
    description?: string
    isHabit?: boolean
    unlockTime?: string
    audioAssetId?: string
    breathingPatternId?: string
    documentAssetId?: string
}

interface SessionState {
    sessions: Session[]
    addSession: (session: Omit<Session, 'id'>) => void
    updateSession: (id: string, updates: Partial<Session>) => void
    unlockAllSessions: (studentId: string) => void
    deleteSession: (id: string) => void
    getSessionsForStudent: (studentId: string) => Session[]
}

export const useSessionStore = create<SessionState>()(
    persist(
        (set, get) => ({
            sessions: [
                { id: '1', studentId: 'student_tobi', title: 'Foundations of Breath', date: '2026-01-02', status: 'completed', description: 'Learning the 3-part breath.' },
                { id: '2', studentId: 'student_tobi', title: 'Rhythmic Coherence', date: '2026-01-09', status: 'completed', description: 'Aligning heart and breath.' },
                { id: '3', studentId: 'student_tobi', title: 'Box Breathing Mastery', date: '2026-01-16', status: 'active', description: 'Focus and stress reduction technique.' },
                { id: '4', studentId: 'student_tobi', title: 'Ocean Sound (Ujjayi)', date: '2026-01-23', status: 'locked' },
                { id: '5', studentId: 'student_tobi', title: 'Breath Retention', date: '2026-01-30', status: 'locked' },
            ],
            addSession: (sessionData) => {
                const newSession: Session = {
                    ...sessionData,
                    id: Math.random().toString(36).substring(7),
                }
                set((state) => ({
                    sessions: [...state.sessions, newSession]
                }))
            },
            updateSession: (id, updates) => {
                set((state) => ({
                    sessions: state.sessions.map(session =>
                        session.id === id ? { ...session, ...updates } : session
                    )
                }))
            },
            unlockAllSessions: (studentId) => {
                set((state) => ({
                    sessions: state.sessions.map(session =>
                        session.studentId === studentId
                            ? { ...session, status: 'active' }
                            : session
                    )
                }))
            },
            deleteSession: (id) => {
                set((state) => ({
                    sessions: state.sessions.filter(s => s.id !== id)
                }))
            },
            getSessionsForStudent: (studentId) => {
                const sessions = get().sessions.filter(s => s.studentId === studentId)
                return sessions
            }
        }),
        {
            name: 'session-storage',
        }
    )
)
