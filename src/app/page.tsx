import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, MapPin, Instagram, Mail, Lock } from "lucide-react";
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

export default function Home() {
  return (
    // Scoped Styles Wrapper
    <main className={`${inter.variable} ${lora.variable} min-h-screen bg-[#F8F7F4] text-[#222222] font-sans selection:bg-[#1F3A4D] selection:text-white overflow-x-hidden`}>

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
                Reclaim your <br />
                <span className="italic font-serif text-[#78716C]">attention.</span>
              </h1>

              <h2 className="text-xl font-serif text-[#57534E] font-light leading-relaxed max-w-sm">
                Analog presence for a digital age.
              </h2>
            </div>

            {/* Action Cards Area */}
            <div className="flex flex-col gap-5 pt-2">

              {/* 1. Upcoming Retreat Card */}
              <Link href="#events" className="group">
                <div className="flex items-center gap-5 p-2 pr-6 rounded-2xl md:rounded-full bg-white border border-[#E7E5E4] hover:border-[#EDA76B]/50 hover:shadow-md transition-all duration-300 max-w-md">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 shrink-0 rounded-xl md:rounded-full overflow-hidden bg-stone-200">
                    <Image
                      src="/images/event-egypt.jpg"
                      alt="Egypt"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold tracking-widest text-[#EDA76B] uppercase block mb-0.5">Upcoming Retreat</span>
                    <h3 className="text-lg font-serif font-medium text-[#222222] truncate">Egypt Immersion</h3>
                    <div className="flex items-center gap-3 text-xs text-[#78716C] mt-0.5">
                      <span>Oct '26</span>
                      <span className="w-1 h-1 rounded-full bg-[#D6D3D1]" />
                      <span>Cairo</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="w-8 h-8 rounded-full bg-[#F8F7F4] flex items-center justify-center text-[#222222] group-hover:bg-[#1F3A4D] group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>

              {/* 2. Coaching Card */}
              <Link href="mailto:hello@pascal.com?subject=Coaching%20Inquiry" className="group block max-w-md">
                <div className="flex items-center justify-between p-5 rounded-2xl border border-[#E7E5E4] bg-[#F2F0EB]/50 hover:bg-[#F2F0EB] transition-colors">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-[#1F3A4D] uppercase block">I work with you personally</span>
                    <h3 className="text-lg font-serif font-medium text-[#57534E]">Personal 10 Week Coaching</h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A8A29E] group-hover:text-[#1F3A4D] transition-colors" />
                </div>
              </Link>

            </div>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="flex-1 relative h-[50vh] md:h-full order-1 md:order-2">
          {/* Mirroring container */}
          <div className="relative w-full h-full scale-x-[-1]">
            <Image
              src="/images/hero-pascal.jpg"
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
              We use conscious breathing to manually override the stress response.
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
          <div className="space-y-8 max-w-lg">
            <span className="text-sm font-bold tracking-widest text-[#1F3A4D] uppercase">About Your Guide</span>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">
              More than just <br /> breathing.
            </h2>
            <div className="w-12 h-0.5 bg-[#EDA76B]" />
            <p className="text-lg text-[#57534E] font-serif leading-loose">
              As your coach, Pascal doesn't just teach techniques. He holds the space necessary for you to safely navigate the transition from chaos to clarity.
            </p>
            <p className="text-lg text-[#57534E] font-serif leading-loose">
              This is deep, restorative work for a distracted age.
            </p>
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
            <p className="text-[#A8A29E] font-serif italic text-lg">Join us in the physical world.</p>
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
