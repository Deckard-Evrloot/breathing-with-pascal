import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error("Supabase Environment Variables missing!", { url, key })
  } else {
    // Check for common errors
    if (!url.startsWith('https://')) console.warn("Supabase URL should start with https://", url)
    console.log("Supabase Client initializing with URL:", url)
  }

  return createBrowserClient(
    url!,
    key!
  )
}
