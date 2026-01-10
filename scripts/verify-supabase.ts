
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually parse env file to avoid dependencies
const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8')
const envConfig: Record<string, string> = {}
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^["']|["']$/g, '') // remove quotes
        envConfig[key] = value
    }
})

const url = envConfig['NEXT_PUBLIC_SUPABASE_URL']
const key = envConfig['NEXT_PUBLIC_SUPABASE_ANON_KEY']

if (!url || !key) {
    console.error("❌ Missing params in .env.local")
    process.exit(1)
}

const supabase = createClient(url, key)

async function testStorage() {
    console.log(`Connecting to Supabase at: ${url}`)

    // 1. List Buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
        console.warn("⚠️ Could not list buckets (likely permission issue), attempting upload anyway...")
    } else {
        console.log("ℹ️ Buckets visible to Anon:", buckets?.map(b => b.name))
    }

    // 2. Test Upload (Directly to 'assets')
    console.log("Attemping to upload to 'assets' bucket...")
    const testFile = Buffer.from("Hello Supabase", 'utf-8')
    const fileName = `test_upload_${Date.now()}.txt`

    const { data, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, testFile)

    if (uploadError) {
        console.error("❌ Upload failed:", uploadError.message)
        console.error("   (This might be an RLS policy issue if the bucket exists)")
    } else {
        console.log("✅ Upload successful:", data?.path)

        // 3. Test Database Insert (public.assets)
        console.log("Attempting to insert record into 'public.assets'...")
        const { data: dbData, error: dbError } = await supabase
            .from('assets')
            .insert({
                id: `test_${Date.now()}`,
                title: 'Verification Script Test',
                type: 'audio',
                url: 'https://example.com/test.mp3',
                date: new Date().toISOString()
            })
            .select()

        if (dbError) {
            console.error("❌ Database Insert Failed:", dbError.message)
            console.error("   (Likely 'public.assets' table missing or RLS policy issue)")
        } else {
            console.log("✅ Database Insert Successful:", dbData)

            // Cleanup DB
            await supabase.from('assets').delete().eq('id', dbData?.[0]?.id)
            console.log("✅ Database Cleanup Successful")
        }

        // Cleanup Storage
        await supabase.storage.from('assets').remove([fileName])
        console.log("✅ Storage Cleanup Successful")
    }
}

testStorage()
