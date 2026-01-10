import { BreathingTool } from "@/components/breathing/breathing-tool"

export default function BreathingPage() {
    return (
        <div className="min-h-screen bg-stone-50 pb-20 p-6 flex flex-col items-center">
            <div className="max-w-md w-full space-y-8">
                <header className="text-center space-y-2">
                    <h1 className="text-2xl font-light text-primary">Guided Breathing</h1>
                    <p className="text-stone-500">Center your mind and body.</p>
                </header>

                <BreathingTool />

                <div className="prose prose-stone prose-sm mx-auto text-center">
                    <p>
                        Use this tool daily to regulate your nervous system.
                        Start with Box Breathing for focus, or 4-7-8 for sleep/relaxation.
                    </p>
                </div>
            </div>
        </div>
    )
}
