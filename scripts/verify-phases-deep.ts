
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually parse env file
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

async function testPhases() {
    console.log("Testing 'phases' column insertion...")

    const testPhases = [
        { name: "Phase 1", in: 4, holdIn: 4, out: 4, holdOut: 4, rounds: 2 },
        { name: "Phase 2", in: 2, holdIn: 0, out: 2, holdOut: 0, rounds: 4 }
    ]

    const { data, error } = await supabase
        .from('assets')
        .insert({
            id: `test_phases_${Date.now()}`,
            title: 'Phase Test Asset',
            type: 'breathing', // Assuming 'breathing' type
            url: 'https://example.com/dummy_phase_test.mp3',
            phases: testPhases,
            date: new Date().toISOString()
        })
        .select()

    if (error) {
        console.error("❌ Failed:", error.message)
        process.exit(1)
    } else {
        console.log("✅ Success:", JSON.stringify(data[0].phases, null, 2))

        // Validation
        if (Array.isArray(data[0].phases) && data[0].phases.length === 2) {
            console.log("✅ Phases data integrity verified.")
        } else {
            console.error("❌ Phases data mismatch.")
        }

        // Cleanup
        await supabase.from('assets').delete().eq('id', data[0].id)
        console.log("✅ Cleanup done.")
    }
}

testPhases()
