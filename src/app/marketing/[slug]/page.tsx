import Image from "next/image"
import { notFound } from "next/navigation"
import { GreetingWidget } from "@/components/marketing/greeting-widget"
import { ProgramCard } from "@/components/marketing/program-card"
import { EventTicker } from "@/components/marketing/event-ticker"
import { getMarketingData } from "@/lib/data"

interface PageProps {
    params: Promise<{
        slug: string
    }>
}

export default async function MarketingPage({ params }: PageProps) {
    const { slug } = await params
    const data = await getMarketingData(slug)

    if (!data) {
        notFound()
    }

    return (
        <main className="min-h-screen font-sans bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative h-svh w-full flex flex-col items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0 select-none">
                    <Image
                        src="/hero-bg.png"
                        alt="Breathing Landscape"
                        fill
                        className="object-cover"
                        priority
                        quality={90}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 bg-gradient-to-b from-black/10 via-black/20 to-black/40" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center space-y-8">
                    <GreetingWidget name={data.user.name} />

                    <div className="w-full flex justify-center">
                        <ProgramCard
                            title={data.program.title}
                            duration={data.program.duration}
                            goal={data.program.goal}
                        />
                    </div>
                </div>

                {/* Scroll Indicator (Optional, aesthetic) */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                        <div className="w-1 h-2 bg-white/50 rounded-full" />
                    </div>
                </div>
            </section>

            {/* Event Ticker */}
            <EventTicker events={data.events} />

            {/* Additional Content Section (Placeholder for Long-from content) */}
            <section className="py-20 px-4 max-w-3xl mx-auto text-center space-y-12">
                <h2 className="text-3xl md:text-4xl font-light text-primary tracking-tight">The Practice</h2>
                <p className="text-lg text-stone-600 leading-relaxed">
                    Breathwork is not just a technique; it is a return to your essence.
                    Through rhythmic breathing, we unlock the nervous system, release tension,
                    and find clarity in the present moment.
                </p>
                <div className="h-px w-20 bg-stone-300 mx-auto" />
            </section>
        </main>
    )
}
