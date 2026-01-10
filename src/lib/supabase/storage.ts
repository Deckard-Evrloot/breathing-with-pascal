import { createClient } from '@/lib/supabase/client'

export async function uploadAsset(file: File | Blob, filename: string) {
    const supabase = createClient()
    const path = `${Date.now()}_${filename}`

    const { data, error } = await supabase.storage
        .from('assets')
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) {
        console.error('Upload error:', error)
        throw error
    }

    const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(path)

    return publicUrl
}
