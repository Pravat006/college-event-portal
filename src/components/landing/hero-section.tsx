"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AnimatedBgGlow from "./animated-bg"

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4">

            {/* Optional Glow Effect - Uncomment if needed */}
            {/* <AnimatedBgGlow /> */}

            <div className="pointer-events-none fixed top-0 left-[58%] -translate-x-1/2 z-0 flex items-start justify-center mt-[-130px]">
                <div className="relative flex items-center justify-center">
                    <div
                        className="w-[520px] h-[260px] rounded-b-full opacity-100"
                        style={{
                            background:
                                "radial-gradient(60% 100% at 50% 70%, rgba(135,230,75,0.6), rgba(135,230,75,0.35) 45%, rgba(135,230,75,0.15) 70%)",
                            boxShadow:
                                "0 40px 120px rgba(135,230,75,0.25), 0 10px 40px rgba(135,230,75,0.15)",
                            filter: "blur(18px) saturate(120%)",
                        }}
                    />
                </div>
            </div>

            {/* Floating Sticker SVGs */}
            {/* Running Person - Top Left */}
            <div className="absolute top-20 left-10 sm:left-20 animate-bounce-slow z-5 opacity-80">
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="20" r="8" fill="#87e64b" />
                    <path d="M28 30 L28 50 L35 65" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                    <path d="M28 50 L20 60" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                    <path d="M28 35 L40 40" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                    <path d="M28 35 L18 38" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                    <path d="M35 65 L40 80" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                </svg>
            </div>

            {/* Student with Laptop - Top Right */}
            <div className="absolute top-32 right-10 sm:right-32 animate-float z-5 opacity-80">
                <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="25" r="10" fill="#87e64b" />
                    <path d="M50 38 L50 60" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                    <path d="M50 45 L35 55 L35 65 L65 65 L65 55 Z" fill="#87e64b" opacity="0.7" />
                    <rect x="38" y="58" width="24" height="3" fill="#333" />
                    <path d="M50 60 L45 75" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                    <path d="M50 60 L55 75" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                </svg>
            </div>

            {/* Dancing Person - Bottom Left */}
            <div className="absolute bottom-32 left-16 sm:left-40 animate-pulse-slow z-5 opacity-80">
                <svg width="85" height="85" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="45" cy="20" r="9" fill="#87e64b" />
                    <path d="M45 32 L45 55" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                    <path d="M45 40 L30 35" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                    <path d="M45 40 L60 45" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                    <path d="M45 55 L35 75" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                    <path d="M45 55 L55 70" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                </svg>
            </div>

            {/* Singing Person - Bottom Right */}
            <div className="absolute bottom-40 right-20 sm:right-48 animate-bounce-slow z-5 opacity-80">
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="22" r="8" fill="#87e64b" />
                    <ellipse cx="48" cy="22" rx="3" ry="4" fill="#333" /> {/* Mouth open */}
                    <path d="M50 32 L50 58" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                    <path d="M50 42 L38 38" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                    <path d="M50 42 L62 38" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                    <path d="M50 58 L42 78" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                    <path d="M50 58 L58 78" stroke="#87e64b" strokeWidth="4" strokeLinecap="round" />
                    {/* Microphone */}
                    <circle cx="62" cy="38" r="3" fill="#333" />
                    <line x1="62" y1="41" x2="62" y2="48" stroke="#333" strokeWidth="2" />
                </svg>
            </div>

            {/* Music Notes - Floating around */}
            <div className="absolute top-1/4 right-1/4 animate-float-delayed z-5 opacity-60">
                <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 35 L15 15 L20 13 L20 33 C20 36 18 38 15 38 C12 38 10 36 10 33 C10 30 12 28 15 28" fill="#87e64b" />
                    <circle cx="15" cy="33" r="3" fill="#87e64b" />
                </svg>
            </div>

            <div className="absolute top-1/3 left-1/4 animate-float z-5 opacity-60">
                <svg width="35" height="35" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 35 L15 15 L20 13 L20 33 C20 36 18 38 15 38 C12 38 10 36 10 33 C10 30 12 28 15 28" fill="#87e64b" />
                    <circle cx="15" cy="33" r="3" fill="#87e64b" />
                </svg>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-xtradex leading-tight">
                    <span className="text-foreground">Bring Your College Fest to Life — </span>
                    <span className="text-[#87e64b] dark:text-[#87e64b]">
                        Smarter, Louder, and Seamlessly Organized
                    </span>
                    <span className="text-foreground">.</span>
                </h1>

                {/* Subheadline */}
                <p className="text-base sm:text-lg md:text-xl  max-w-3xl mx-auto leading-relaxed px-4 font-made-avenue">
                    From registrations to stage schedules, manage every detail of your cultural fest in one place.
                    Engage participants, automate tasks, and let your team focus on the celebration — not the chaos.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link href="/sign-up">
                        <Button size="lg" className="text-base sm:text-lg px-8 py-6">
                            Get Started Free
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button size="lg" className="text-base sm:text-lg px-8 py-6">
                            Learn More
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                <button
                    className="animate-bounce focus:outline-none hover:opacity-70 transition-opacity"
                    aria-label="Scroll Down"
                    onClick={() => {
                        const nextSection = document.querySelector("#next-section");
                        if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
                    }}
                >
                    <ChevronRight className="w-6 h-6 rotate-90 text-muted-foreground" />
                </button>
            </div>
        </section>
    )
}
