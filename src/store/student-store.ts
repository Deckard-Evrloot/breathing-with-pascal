import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Student {
    id: string
    name: string
    programType: 'sessions' | 'weeks'
    programLength: number
    goal: string
    startDate: string
    sessionsCompleted: number
}

interface StudentState {
    students: Student[]
    addStudent: (student: Omit<Student, 'id' | 'sessionsCompleted'>) => Student
    updateStudent: (id: string, updates: Partial<Student>) => void
    getStudentById: (id: string) => Student | undefined
}

export const useStudentStore = create<StudentState>()(
    persist(
        (set, get) => ({
            students: [
                {
                    id: 'student_tobi',
                    name: 'Tobi',
                    programType: 'weeks',
                    programLength: 12,
                    goal: 'Integrate breathwork into daily high-performance routine',
                    startDate: '2026-01-01',
                    sessionsCompleted: 2
                }
            ],
            addStudent: (studentData) => {
                const newStudent: Student = {
                    ...studentData,
                    id: `std_${Math.random().toString(36).substring(7)}`,
                    sessionsCompleted: 0
                }
                set((state) => ({
                    students: [...state.students, newStudent]
                }))
                return newStudent
            },
            updateStudent: (id, updates) => {
                set((state) => ({
                    students: state.students.map(s => s.id === id ? { ...s, ...updates } : s)
                }))
            },
            getStudentById: (id) => {
                return get().students.find(s => s.id === id)
            }
        }),
        {
            name: 'student-storage',
        }
    )
)
