"use client"

import { motion } from "framer-motion"

interface GreetingWidgetProps {
    name: string
}

export function GreetingWidget({ name }: GreetingWidgetProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
        >
            <h1 className="text-4xl md:text-6xl font-light tracking-wide text-white drop-shadow-md">
                Namaste, <span className="font-medium">{name}</span>
            </h1>
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="h-[1px] w-24 bg-white/50 mx-auto mt-6"
            />
        </motion.div>
    )
}
