import { MediaPlayer } from "@/components/dashboard/player"
import { Toaster } from "@/components/ui/sonner"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 pb-24">
            <DashboardNav />
            {children}
            <MediaPlayer />
            <Toaster />
        </div>
    )
}
