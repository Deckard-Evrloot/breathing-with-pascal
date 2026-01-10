export interface MarketingData {
    user: {
        name: string
    }
    program: {
        title: string
        duration: string
        goal: string
    }
    events: {
        id: string
        date: Date
        location: string
        title: string
    }[]
}

export async function getMarketingData(slug: string): Promise<MarketingData> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // In a real app, this would fetch from Supabase 'users' table by slug, 
    // then fetch related active program/sessions.

    const isGeneric = slug === 'general' || slug === 'active'

    return {
        user: {
            name: isGeneric ? "Friend" : capitalize(slug) // Simple mock: use slug as name
        },
        program: {
            title: "Foundations of Breath",
            duration: "4 Weeks",
            goal: "Master the art of diaphragmatic breathing and reduce stress."
        },
        events: [
            {
                id: "1",
                date: new Date("2026-06-15"),
                location: "Zurich, Switzerland",
                title: "Sunset Breath Circle"
            },
            {
                id: "2",
                date: new Date("2026-06-22"),
                location: "Bern, Switzerland",
                title: "Morning Flow"
            },
            {
                id: "3",
                date: new Date("2026-07-01"),
                location: "Online",
                title: "Global Coherence"
            },
            {
                id: "4",
                date: new Date("2026-07-10"),
                location: "Lucerne, Switzerland",
                title: "Lake Retreat"
            }
        ]
    }
}

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}
