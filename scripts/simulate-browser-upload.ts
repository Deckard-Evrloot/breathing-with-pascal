
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// 1. Setup Env (Manual parse)
const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8')
const envConfig: Record<string, string> = {}
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^["']|["']$/g, '')
        envConfig[key] = value
    }
})

const url = envConfig['NEXT_PUBLIC_SUPABASE_URL']
const key = envConfig['NEXT_PUBLIC_SUPABASE_ANON_KEY']

if (!url || !key) {
    console.error("❌ Missing params")
    process.exit(1)
}

const supabase = createClient(url, key)

async function simulateBrowserFlow() {
    console.log("🚀 STARTING SIMULATION: Browser Record & Save Flow")

    // Step A: Upload File (Storage)
    const mockBlob = Buffer.from("Audio Content Simulated", 'utf-8')
    const filename = `simulation_${Date.now()}.webm`
    const path = `${Date.now()}_${filename}`

    console.log(`1️⃣  Step 1: Uploading ${filename} to Storage...`)
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(path, mockBlob, { cacheControl: '3600', upsert: false })

    if (uploadError) {
        console.error("❌ Step 1 FAILED (Storage):", uploadError.message)
        return
    }
    console.log("✅ Step 1 SUCCESS. Path:", uploadData.path)

    const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(path)
    console.log("   Public URL generated:", publicUrl)

    // Step B: Save Metadata (Database)
    // This replicates the `addAsset` logic in asset-store.ts
    console.log("2️⃣  Step 2: Saving Metadata to 'assets' table...")

    // Note: We use the exact keys expected by the table
    const dbPayload = {
        id: Math.random().toString(36).substring(7),
        title: 'Browser Simulation Test',
        type: 'audio',
        url: publicUrl,
        duration: 120, // Mock duration
        indexed_db_key: `audio_sim_${Date.now()}`, // Optional
        date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    }

    const { data: dbData, error: dbError } = await supabase
        .from('assets')
        .insert(dbPayload)
        .select()

    if (dbError) {
        console.error("❌ Step 2 FAILED (Database):", dbError.message)
        console.error("   Reason: The PostgREST API rejected the insert.")
        if (dbError.message.includes("schema cache")) {
            console.error("   DIAGNOSIS: Schema Cache is STALE. 'Reload Schema Cache' has NOT worked yet.")
        } else if (dbError.message.includes("violates row-level security")) {
            console.error("   DIAGNOSIS: RLS Policies are missing or blocking public writes.")
        }
    } else {
        console.log("✅ Step 2 SUCCESS. Record saved to DB:", dbData[0].id)

        // Cleanup
        console.log("🧹 Cleaning up test artifacts...")
        await supabase.from('assets').delete().eq('id', dbData[0].id)
        await supabase.storage.from('assets').remove([path])
        console.log("✨ Test Cycle Complete: SYSTEM IS WORKING")
    }
}

simulateBrowserFlow()
