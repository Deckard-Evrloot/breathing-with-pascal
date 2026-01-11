import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, MapPin, Instagram, Mail, Lock, BrainCircuit, Timer, Euro, Gem, Sparkles, Star } from "lucide-react";
import { Inter, Lora } from "next/font/google";

// Scoped Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

import { Parisienne } from "next/font/google";
const parisienne = Parisienne({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-parisienne",
});

export default function Home() {
  return (
    // Scoped Styles Wrapper
    <main className={`${inter.variable} ${lora.variable} ${parisienne.variable} min-h-screen bg-[#F8F7F4] text-[#222222] font-sans selection:bg-[#1F3A4D] selection:text-white overflow-x-hidden`}>

      {/* --- TOP NAV --- */}
      <nav className="absolute top-0 right-0 p-8 z-50">
        <Link
          href="/login"
          className="text-xs font-bold uppercase tracking-widest text-[#222222] border border-[#E7E5E4] bg-white/50 backdrop-blur-sm px-5 py-2 rounded-full hover:bg-white hover:border-[#D6D3D1] transition-all shadow-sm"
        >
          Login
        </Link>
      </nav>

      {/* --- SECTION 1: HERO (Split Viewport) --- */}
      <section className="relative min-h-screen flex flex-col md:flex-row overflow-hidden">

        {/* Left Column: Content */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 z-20 bg-[#F8F7F4] relative order-2 md:order-1 py-12 md:py-0">
          <div className="space-y-10 max-w-xl relative">

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[0.9]">
                Press Delete <br />
                on the <span className="italic font-serif text-[#78716C]">Noise.</span>
              </h1>

              <h2 className="text-xl font-serif text-[#57534E] font-light leading-relaxed max-w-2xl">
                Master your output in an age of constant input.
              </h2>
            </div>

            {/* Action Cards Area */}
            <div className="flex flex-col gap-6 pt-4">

              {/* 1. Manager Program (PRIMARY HERO) */}
              <div className="max-w-md space-y-3">

                <Link href="mailto:hello@pascal.com?subject=Manager%20Program" className="group block relative">
                  <div className="flex flex-col p-6 rounded-3xl border border-[#E7E5E4] bg-white shadow-lg hover:shadow-xl hover:border-[#1F3A4D]/20 transition-all duration-300 relative overflow-hidden">

                    {/* Integrated Header - Eyebrow */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#F2F0EB] flex items-center justify-center shrink-0">
                        <BrainCircuit className="w-4 h-4 text-[#1F3A4D]" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-bold tracking-widest text-[#1F3A4D] uppercase">New 2026: Manager Program</span>
                    </div>

                    <div className="space-y-3">
                      {/* Primary Title Block */}
                      <div className="font-serif text-[#222222]">
                        <h3 className="text-2xl font-bold leading-none tracking-tight">Executive 1:1 Coaching</h3>
                        <p className="text-lg font-medium leading-tight mt-1 text-[#222222]">Master your physiological stress response</p>
                      </div>

                      {/* Hook Quote - Secondary */}
                      <p className="font-sans text-sm text-[#78716C] leading-relaxed pt-1">
                        "You cannot think your way out of chronic stress."
                      </p>

                      {/* Footer */}
                      <div className="flex items-center gap-5 text-xs text-[#57534E] font-medium pt-3 border-t border-[#F2F0EB] mt-1">
                        <div className="flex items-center gap-1.5">
                          <Timer className="w-3.5 h-3.5" />
                          <span>10 Weeks</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Remote</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#1F3A4D] font-bold bg-[#F2F0EB] px-2 py-0.5 rounded">900€</span>
                        </div>
                        <div className="ml-auto w-6 h-6 rounded-full bg-[#1F3A4D] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>


              {/* 2. Upcoming Retreat Card (SECONDARY) */}
              <Link href="#events" className="group block max-w-md pl-4">
                <div className="flex items-center gap-4 p-2 pr-4 rounded-xl hover:bg-[#E7E5E4]/30 transition-all duration-300 border border-transparent hover:border-[#E7E5E4]">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-stone-200">
                    <Image
                      src="/images/event-egypt.jpg"
                      alt="Egypt"
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold tracking-widest text-[#A8A29E] uppercase block mb-0.5">Upcoming Event</span>
                    <h3 className="text-sm font-bold text-[#57534E] leading-tight">Egypt: Ancient Breath</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#78716C] mt-1">
                      <span>Oct. 2026</span>
                      <span className="w-0.5 h-3 bg-[#D6D3D1]" />
                      <span>8 Days</span>
                      <span className="w-0.5 h-3 bg-[#D6D3D1]" />
                      <span>Dahab, Egypt</span>
                      <span className="w-0.5 h-3 bg-[#D6D3D1]" />
                      <span className="text-[#1F3A4D] font-bold bg-[#F2F0EB] px-1.5 py-0.5 rounded">1200€</span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#D6D3D1] group-hover:text-[#57534E] transition-colors" />
                </div>
              </Link>

            </div>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="flex-1 relative h-[50vh] md:h-auto order-1 md:order-2 mix-blend-normal">

          {/* Mirroring container - using absolute inset to force fill */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero-final.jpg"
              alt="Pascal with lighter"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Gradient Transition Overlay */}
          <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-[#F8F7F4] via-[#F8F7F4]/80 to-transparent z-10 pointer-events-none" />

          {/* Darker atmosphere overlay */}
          <div className="absolute inset-0 bg-[#1C1917]/10 mix-blend-multiply pointer-events-none" />
        </div>
      </section>


      {/* --- SECTION 2: THE PHILOSOPHY (The Hook) --- */}
      <section className="py-32 px-6 bg-[#F2F0EB]">
        <div className="max-w-3xl mx-auto space-y-24">

          <div className="text-center space-y-6">
            <span className="text-xs font-bold tracking-[0.2em] text-[#EDA76B] uppercase">The Philosophy</span>
            <h3 className="text-4xl md:text-5xl font-serif text-[#222222]">
              I use conscious breathing to manually override the stress response.
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {/* 01 */}
            <div className="space-y-4 text-center md:text-left">
              <span className="text-6xl font-light text-[#E7E5E4] block">01</span>
              <h4 className="text-xl font-bold font-serif">The Noise</h4>
              <p className="text-[#57534E] leading-relaxed">
                The modern world keeps your nervous system in a state of constant alarm. Notifications, deadlines, and digital chatter.
              </p>
            </div>

            {/* 02 */}
            <div className="space-y-4 text-center md:text-left">
              <span className="text-6xl font-light text-[#E7E5E4] block">02</span>
              <h4 className="text-xl font-bold font-serif">The Reset</h4>
              <p className="text-[#57534E] leading-relaxed">
                Breathwork is the analog anchor. It isn’t just relaxation; it’s a physiological switch that restores balance immediately.
              </p>
            </div>

            {/* 03 */}
            <div className="space-y-4 text-center md:text-left">
              <span className="text-6xl font-light text-[#E7E5E4] block">03</span>
              <h4 className="text-xl font-bold font-serif">The Result</h4>
              <p className="text-[#57534E] leading-relaxed">
                True digital detox isn't just turning off the phone; it's having the internal calm to not need to turn it on.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* --- SECTION 3: THE COACH (Action) --- */}
      <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Left: Image */}
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 hidden md:block">
            <Image
              src="/images/session-bw.jpg"
              alt="Pascal teaching a group session"
              fill
              className="object-cover"
            />
          </div>

          {/* Right: Text */}
          <div className="space-y-6 max-w-lg">
            <span className="text-sm font-bold tracking-widest text-[#1F3A4D] uppercase">About Your Guide</span>

            <h2 className="text-4xl md:text-5xl font-serif leading-tight text-[#222222]">
              <strong className="font-bold">Hey, I am <span className={`${parisienne.className} font-normal text-5xl md:text-6xl ml-1`}>Pascal.</span></strong>
            </h2>

            <div className="w-12 h-0.5 bg-[#EDA76B]" />

            <div className="space-y-4 text-base md:text-lg text-[#57534E] font-serif leading-loose">
              <p>
                My background combines the discipline of the German Army with a Master’s in Sports Science and deep study of somatics. This unique combination led me to focus on breathwork as the most efficient tool for self-regulation.
              </p>
              <p>
                Today, I work with leaders to navigate their most demanding phases. My role is to provide the framework you need to stop reacting to external chaos and regain control of your internal state.
              </p>
            </div>

            {/* Testimonial */}
            <div className="pt-6 border-t border-[#E7E5E4] mt-4">
              <div className="flex gap-0.5 text-[#EDA76B] mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm md:text-base text-[#57534E] italic mb-4 leading-relaxed">
                “Pascal helped me understand my emotions in stressful situations and decouple it from my immediate reactions.”
              </p>

              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E7E5E4]">
                  <Image
                    src="/images/tobi-amann.jpg"
                    alt="Tobi Amann"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-xs font-bold text-[#1F3A4D] uppercase tracking-wider">
                  Tobias Amann — CEO TIKI GmbH
                </div>
              </div>
            </div>

            {/* Mobile only image */}
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-xl grayscale md:hidden mt-8">
              <Image
                src="/images/session-bw.jpg"
                alt="Pascal teaching a group session"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </section>


      {/* --- SECTION 4: UPCOMING EVENTS (Singleton State) --- */}
      <section id="events" className="py-32 px-6 bg-[#1C1917] text-[#F5F5F4]">
        <div className="max-w-5xl mx-auto space-y-16">

          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-light">The Next Immersion</h2>
            <p className="text-[#A8A29E] font-serif italic text-lg">Join me in the physical world.</p>
          </div>

          {/* Singleton Card */}
          <div className="group bg-[#292524] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-[#44403C] hover:border-[#EDA76B]/50 transition-all duration-300">

            {/* Card Image */}
            <div className="relative h-64 md:h-auto md:w-2/5 shrink-0 overflow-hidden">

              <div className="absolute inset-0 bg-[#292524] flex items-center justify-center">
                <Image
                  src="/images/event-egypt.jpg"
                  alt="Egypt Retreat"
                  fill
                  className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 grayscale-[20%]"
                />
              </div>
              <div className="absolute top-4 left-4 bg-[#EDA76B] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Open for Application
              </div>
            </div>

            {/* Card Content */}
            <div className="p-8 md:p-12 space-y-6 flex-1 flex flex-col justify-center">
              <div className="space-y-2">
                <span className="text-teal-400 text-xs font-bold tracking-[0.2em] uppercase">Upcoming Retreat</span>
                <h3 className="text-3xl font-serif text-white">Ancient Breath: The Pyramids</h3>
              </div>

              <div className="flex flex-wrap gap-6 text-sm font-medium text-[#D6D3D1] border-t border-[#44403C] pt-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#EDA76B]" />
                  <span>October 12 - 16, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#EDA76B]" />
                  <span>Cairo, Egypt</span>
                </div>

                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-[#EDA76B]" />
                  <span>1 Week</span>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-[#EDA76B]" />
                  <span>1200€</span>
                </div>
              </div>

              <p className="text-[#A8A29E] leading-relaxed font-serif">
                5 days of silence, breathwork, and historic exploration in the shadow of the Pyramids. Disconnect to reconnect. Limited to 12 participants.
              </p>

              <div className="pt-4">
                <button className="w-full md:w-auto bg-white text-[#1C1917] px-8 py-3 rounded-full font-medium hover:bg-[#E7E5E4] transition-colors">
                  Explore Details & Apply
                </button>
              </div>
            </div>

          </div>

          {/* Newsletter / Fallback */}
          <div className="text-center pt-12 border-t border-[#292524]">
            <p className="text-[#78716C] text-sm">Can't make this one? <Link href="#" className="underline hover:text-white">Join the waiting list</Link> for future dates.</p>
          </div>

        </div>
      </section>


      {/* --- SECTION 5: FOOTER --- */}
      <footer className="py-12 bg-[#F8F7F4] border-t border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">

          <div className="text-center md:text-left">
            <h5 className="font-bold text-lg tracking-tight text-[#1F3A4D]">Breathing with Pascal</h5>
            <p className="text-[#78716C] text-sm font-serif italic mt-1">Analog living in a digital world.</p>
          </div>

          <div className="flex items-center gap-8">
            <Link href="#" className="text-[#A8A29E] hover:text-[#1F3A4D] transition-colors">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="mailto:hello@pascal.com" className="text-[#A8A29E] hover:text-[#1F3A4D] transition-colors">
              <Mail className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex gap-4 items-center">
            <div className="text-xs text-[#D6D3D1]">
              &copy; {new Date().getFullYear()} Pascal.
            </div>
          </div>

        </div>
      </footer>
    </main>
  );
}
