"use client"

import { MapPin } from "lucide-react"

interface Event {
    id: string
    date: Date
    location: string
    title: string
}

interface EventTickerProps {
    events: Event[]
}

export function EventTicker({ events }: EventTickerProps) {
    if (!events.length) return null

    return (
        <div className="w-full bg-stone-100/50 border-b border-stone-200 py-6 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <h3 className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-4 px-2">Upcoming Circles</h3>

                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="snap-start shrink-0 w-64 bg-white rounded-xl p-4 border border-stone-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex flex-col items-center justify-center w-14 h-14 bg-stone-100 rounded-lg shrink-0 border border-stone-200">
                                <span className="text-xs font-bold text-stone-500 uppercase">
                                    {event.date.toLocaleString('default', { month: 'short' })}
                                </span>
                                <span className="text-xl font-light text-primary">
                                    {event.date.getDate()}
                                </span>
                            </div>

                            <div className="min-w-0">
                                <h4 className="text-sm font-medium text-stone-800 truncate">{event.title}</h4>
                                <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate">{event.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
