"use client"

import { useEffect, useState } from "react"
import { useTheme as useNextTheme } from "next-themes"

export type AppTheme = "light" | "dark" | "system"

export function useTheme() {
    const ctx = useNextTheme()
    const { theme, resolvedTheme, setTheme, systemTheme } = ctx

    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const effective = (resolvedTheme ?? theme ?? "system") as AppTheme
    const isDark = effective === "dark" || (!mounted && theme === "dark")

    const toggleTheme = () => setTheme(isDark ? "light" : "dark")

    return {
        ...ctx,
        mounted,
        isDark,
        effectiveTheme: effective,
        toggleTheme,
        setTheme,
        systemTheme,
    }
}
