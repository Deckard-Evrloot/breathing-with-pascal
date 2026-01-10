import { create } from 'zustand'

interface PlayerState {
    isPlaying: boolean
    currentTrackUrl: string | null
    currentTrackDbKey: string | null
    currentTrackTitle: string | null
    currentTrackImage: string | null
    progress: number
    duration: number
    isExpanded: boolean
    hasError: boolean

    togglePlay: () => void
    setTrack: (url: string, title?: string, image?: string, duration?: number, dbKey?: string) => void
    setProgress: (progress: number) => void
    setDuration: (duration: number) => void
    toggleExpanded: () => void
    closePlayer: () => void
    setHasError: (hasError: boolean) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
    isPlaying: false,
    currentTrackUrl: null,
    currentTrackDbKey: null,
    currentTrackTitle: null,
    currentTrackImage: null,
    progress: 0,
    duration: 0,
    isExpanded: false,
    hasError: false,

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying, hasError: false })),

    setTrack: (url, title, image, duration, dbKey) => set({
        currentTrackUrl: url,
        currentTrackDbKey: dbKey || null,
        currentTrackTitle: title || 'Unknown Track',
        currentTrackImage: image || null,
        isPlaying: true,
        progress: 0,
        duration: duration || 0,
        hasError: false
    }),

    setProgress: (progress) => set({ progress }),
    setDuration: (duration) => set({ duration }),
    toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
    closePlayer: () => set({ currentTrackUrl: null, isPlaying: false, hasError: false }),
    setHasError: (hasError) => set({ hasError, isPlaying: false })
}))
