import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Do not run Supabase code to protect pages in this helper, 
    // check for auth in specific routes or the main middleware wrapper
    // refreshing the session here is key.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // DEV MODE BYPASS
    const devCookie = request.cookies.get('dev_mode_user')
    if (devCookie) {
        // If dev cookie exists, allow access to protected routes

        // Block students from teacher dashboard
        if (devCookie.value === 'student' && request.nextUrl.pathname.startsWith('/dashboard/teacher')) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard/student'
            return NextResponse.redirect(url)
        }

        return supabaseResponse
    }

    // 1. Protect Dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 2. Protect Other routes if needed in future
    // Was: Protect Onboarding route, Enforce Onboarding, Skip Onboarding if done
    // These have been removed per user request.

    return supabaseResponse
}
