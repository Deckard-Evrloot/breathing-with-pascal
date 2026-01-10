import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export interface BreathingPattern {
    in: number
    holdIn: number
    out: number
    holdOut: number
    rounds?: number
}

export interface BreathingPhase extends BreathingPattern {
    name: string
}

export interface Asset {
    id: string
    title: string
    type: 'audio' | 'pdf' | 'video' | 'breathing'
    url?: string
    breathingPattern?: BreathingPattern // Legacy / Single
    phases?: BreathingPhase[] // Multi-step
    description?: string
    date: string
    duration?: number
    indexedDbKey?: string
}

interface AssetState {
    assets: Asset[]
    isLoading: boolean
    fetchAssets: () => Promise<void>
    addAsset: (asset: Omit<Asset, 'id' | 'date'>) => Promise<void>
    updateAsset: (id: string, updates: Partial<Omit<Asset, 'id' | 'date'>>) => Promise<void>
    removeAsset: (id: string) => Promise<void>
}

export const useAssetStore = create<AssetState>((set, get) => ({
    assets: [],
    isLoading: false,

    fetchAssets: async () => {
        set({ isLoading: true })
        const supabase = createClient()

        try {
            const { data, error } = await supabase
                .from('assets')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            if (data) {
                // Map DB snake_case to camelCase if needed, or ensuring types match
                const mappedAssets: Asset[] = data.map(item => ({
                    id: item.id,
                    title: item.title,
                    type: item.type as any,
                    url: item.url,
                    breathingPattern: item.breathing_pattern,
                    phases: item.phases, // Map phases from DB
                    date: item.date || item.created_at,
                    duration: item.duration,
                    indexedDbKey: item.indexed_db_key
                }))
                set({ assets: mappedAssets })
            }
        } catch (error) {
            console.error('Error fetching assets:', error)
            // Fallback to empty or toast error
        } finally {
            set({ isLoading: false })
        }
    },

    addAsset: async (assetData) => {
        const supabase = createClient()
        const newId = Math.random().toString(36).substring(7)
        const date = new Date().toISOString().split('T')[0]

        // Optimistic update
        const tempAsset: Asset = { ...assetData, id: newId, date }
        set(state => ({ assets: [tempAsset, ...state.assets] }))

        try {
            const { error } = await supabase
                .from('assets')
                .insert({
                    id: newId,
                    title: assetData.title,
                    type: assetData.type,
                    url: assetData.url,
                    duration: assetData.duration,
                    indexed_db_key: assetData.indexedDbKey,
                    breathing_pattern: assetData.breathingPattern, // Legacy single pattern
                    phases: assetData.phases, // New multi-step phases
                    date: date
                })

            if (error) throw error
        } catch (error) {
            console.error('Error saving asset to DB:', error)
            toast.error('Failed to save asset to cloud')
            // Rollback
            set(state => ({ assets: state.assets.filter(a => a.id !== newId) }))
        }
    },

    updateAsset: async (id: string, updates: Partial<Omit<Asset, 'id' | 'date'>>) => {
        const supabase = createClient()

        // Optimistic update
        const previousAssets = get().assets
        set(state => ({
            assets: state.assets.map(a => a.id === id ? { ...a, ...updates } : a)
        }))

        try {
            const dbUpdates: any = {}
            if (updates.title) dbUpdates.title = updates.title

            const { error } = await supabase
                .from('assets')
                .update(dbUpdates)
                .eq('id', id)

            if (error) throw error
        } catch (error) {
            console.error('Error updating asset:', error)
            toast.error('Failed to update asset')
            set({ assets: previousAssets })
        }
    },

    removeAsset: async (id) => {
        const supabase = createClient()

        // Optimistic update
        const previousAssets = get().assets
        set(state => ({ assets: state.assets.filter(a => a.id !== id) }))

        try {
            const { error } = await supabase
                .from('assets')
                .delete()
                .eq('id', id)

            if (error) throw error
        } catch (error) {
            console.error('Error deleting asset:', error)
            toast.error('Failed to delete asset')
            set({ assets: previousAssets })
        }
    }
}))
