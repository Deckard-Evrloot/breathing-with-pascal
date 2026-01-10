export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    full_name: string | null
                    role: 'teacher' | 'student' | null
                    slug: string | null
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    role?: 'teacher' | 'student' | null
                    slug?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    role?: 'teacher' | 'student' | null
                    slug?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
            }
            sessions: {
                Row: {
                    id: string
                    student_id: string | null
                    teacher_id: string | null
                    start_time: string
                    is_habit: boolean | null
                    status: 'locked' | 'active' | 'completed' | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    student_id?: string | null
                    teacher_id?: string | null
                    start_time: string
                    is_habit?: boolean | null
                    status?: 'locked' | 'active' | 'completed' | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string | null
                    teacher_id?: string | null
                    start_time?: string
                    is_habit?: boolean | null
                    status?: 'locked' | 'active' | 'completed' | null
                    notes?: string | null
                    created_at?: string
                }
            }
            session_content: {
                Row: {
                    id: string
                    session_id: string | null
                    asset_url: string | null
                    asset_type: 'audio' | 'pdf' | 'video' | null
                    title: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    session_id?: string | null
                    asset_url?: string | null
                    asset_type?: 'audio' | 'pdf' | 'video' | null
                    title?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    session_id?: string | null
                    asset_url?: string | null
                    asset_type?: 'audio' | 'pdf' | 'video' | null
                    title?: string | null
                    created_at?: string
                }
            }
            homework: {
                Row: {
                    id: string
                    session_id: string | null
                    prompt: string
                    response_text: string | null
                    response_file_url: string | null
                    is_complete: boolean | null
                    completed_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    session_id?: string | null
                    prompt: string
                    response_text?: string | null
                    response_file_url?: string | null
                    is_complete?: boolean | null
                    completed_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    session_id?: string | null
                    prompt?: string
                    response_text?: string | null
                    response_file_url?: string | null
                    is_complete?: boolean | null
                    completed_at?: string | null
                    created_at?: string
                }
            }
            breath_routines: {
                Row: {
                    id: string
                    name: string | null
                    sequence_json: Json | null
                    created_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name?: string | null
                    sequence_json?: Json | null
                    created_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string | null
                    sequence_json?: Json | null
                    created_by?: string | null
                    created_at?: string
                }
            }
        }
    }
}
