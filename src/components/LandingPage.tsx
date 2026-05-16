import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Bot, MapPin, Star, ChevronDown, Sparkles, Globe, Shield, Zap, Clock, Users, TrendingUp } from 'lucide-react';
import { TripFormWizard } from './TripFormWizard';
import { useAuth } from '../context/AuthContext';

// ─── Data ───
const DESTINATIONS = [
  { name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=350&fit=crop', rating: 4.9, tag: 'Trending' },
  { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=350&fit=crop', rating: 4.8, tag: 'Popular' },
  { name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&h=350&fit=crop', rating: 4.7, tag: 'Beach' },
  { name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&h=350&fit=crop', rating: 4.8, tag: 'Luxury' },
  { name: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&h=350&fit=crop', rating: 4.7, tag: 'City' },
  { name: 'Jaipur', country: 'India', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&h=350&fit=crop', rating: 4.6, tag: 'Heritage' },
];

const TESTIMONIALS = [
  { name: 'Ananya S.', role: 'Solo Traveler', text: 'TripGenie planned my entire Japan trip in 30 seconds. The itinerary was better than what I spent 3 days researching manually.', avatar: 'A', rating: 5 },
  { name: 'Raj Mehta', role: 'Family Vacationer', text: 'We used TripGenie for our Bali family trip. Budget breakdown was spot-on and the hotel suggestions were perfect.', avatar: 'R', rating: 5 },
  { name: 'Sarah K.', role: 'Digital Nomad', text: 'I\'ve tried every trip planner out there. TripGenie is the first one that actually feels intelligent and saves real time.', avatar: 'S', rating: 5 },
];

const FAQS = [
  { q: 'How does TripGenie create itineraries?', a: 'TripGenie uses AI to analyze thousands of travel data points — attractions, reviews, routes, pricing, and seasonal trends — to build optimized day-by-day plans tailored to your preferences and budget.' },
  { q: 'Is TripGenie free to use?', a: 'Yes! You can plan unlimited trips for free. Premium features like group planning and PDF export are available to logged-in users.' },
  { q: 'Can I modify the generated itinerary?', a: 'Absolutely. You can chat with our AI agent to swap activities, change timings, add hidden gems, or adjust your budget — all in natural language.' },
  { q: 'Which destinations are supported?', a: 'TripGenie supports destinations worldwide. We have curated data for popular destinations and use AI to generate smart plans for any location on earth.' },
  { q: 'Can I plan group trips?', a: 'Yes! Our group planning feature lets you create shared itineraries, split expenses, vote on activities, and chat with your travel companions in real-time.' },
];

// ─── Animated Counter ───
const Counter = ({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const step = end / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ─── FAQ Item ───
const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="font-semibold text-gray-900 dark:text-white pr-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 pb-5' : 'max-h-0'}`}>
        <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

// ─── Main Component ───
export const LandingPage = ({ onSubmit, onOpenAuth, onAIChat }: { onSubmit: (data: any) => void, onOpenAuth: () => void, onAIChat?: () => void }) => {
  const { currentUser } = useAuth();

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">

      {/* ━━━ HERO ━━━ */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/8 dark:bg-blue-500/5 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-indigo-500/6 dark:bg-indigo-500/4 rounded-full blur-[100px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="section pt-28 pb-20 lg:pt-40 lg:pb-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 tracking-wide">AI-POWERED TRAVEL PLANNER</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-gray-900 dark:text-white">
              Plan your perfect trip{' '}
              <span className="text-gradient">in seconds</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Stop spending hours on research. TripGenie creates personalized itineraries, finds the best stays, and optimizes your budget — all powered by AI.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary px-8 py-3.5 text-base rounded-xl shadow-glow hover:shadow-glow-lg"
              >
                Start Planning <ArrowRight className="w-4 h-4" />
              </button>
              {onAIChat && (
                <button
                  onClick={onAIChat}
                  className="btn-secondary px-8 py-3.5 text-base rounded-xl"
                >
                  <Bot className="w-4 h-4" /> Chat with AI
                </button>
              )}
            </div>

            {/* Trust row */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-gray-400 dark:text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Plans in under 30 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>10,000+ destinations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ STATS BAR ━━━ */}
      <section className="border-y border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-slate-900/50">
        <div className="section py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 200, suffix: 'K+', label: 'Trips Planned' },
              { value: 150, suffix: '+', label: 'Destinations' },
              { value: 50, suffix: 'K+', label: 'Happy Travelers' },
              { value: 99, suffix: '%', label: 'Satisfaction Rate' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  <Counter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ TRIP FORM ━━━ */}
      <section id="plan" className="scroll-mt-24 py-20">
        <div className="section">
          <div className="text-center mb-12">
            <span className="badge bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 mb-4">Plan Your Trip</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-3">
              Where do you want to go?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-lg mx-auto">
              Tell us your destination, budget, and interests. We'll handle the rest.
            </p>
          </div>
          <TripFormWizard onSubmit={onSubmit} />
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section className="py-20 bg-gray-50/70 dark:bg-slate-900/40">
        <div className="section">
          <div className="text-center mb-14">
            <span className="badge bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40 mb-4">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-3">
              Three steps to your perfect trip
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { step: '01', icon: MapPin, title: 'Tell us your dream', desc: 'Enter your destination, dates, budget, and travel style. Our AI understands exactly what you need.' },
              { step: '02', icon: Sparkles, title: 'AI builds your plan', desc: 'We analyze routes, hotels, restaurants, and attractions to craft a day-by-day optimized itinerary.' },
              { step: '03', icon: TrendingUp, title: 'Refine & go', desc: 'Chat with our AI to swap activities, adjust timings, and fine-tune your plan. Then export and travel!' },
            ].map((item, i) => (
              <div key={i} className="card p-8 hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                    <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs font-bold text-gray-300 dark:text-gray-600 tracking-widest">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ POPULAR DESTINATIONS ━━━ */}
      <section className="py-20">
        <div className="section">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="badge bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 mb-4">Explore</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-3">
                Popular destinations
              </h2>
            </div>
            <button onClick={() => document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' })} className="btn-ghost text-sm">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DESTINATIONS.map((d, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden cursor-pointer" onClick={() => document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' })}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="badge bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 backdrop-blur-sm text-[11px]">{d.tag}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-bold text-white">{d.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-white/70 text-sm">{d.country}</span>
                    <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current" /> {d.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FEATURES ━━━ */}
      <section className="py-20 bg-gray-50/70 dark:bg-slate-900/40">
        <div className="section">
          <div className="text-center mb-14">
            <span className="badge bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40 mb-4">Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-3">
              Everything you need to travel smarter
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Zap, title: 'Instant Generation', desc: 'Get a complete day-by-day itinerary in under 30 seconds.', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
              { icon: MapPin, title: 'Smart Routing', desc: 'AI groups nearby places to minimize travel time between stops.', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
              { icon: TrendingUp, title: 'Budget Tracking', desc: 'Real-time cost breakdown for hotels, food, and transport.', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
              { icon: Bot, title: 'AI Chat Agent', desc: 'Modify your plan through natural conversation. Just talk.', color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30' },
              { icon: Users, title: 'Group Planning', desc: 'Plan together with friends, vote on activities, split costs.', color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/30' },
              { icon: Clock, title: 'Local Intelligence', desc: 'Hidden gems, best times to visit, and local tips for every spot.', color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/30' },
            ].map((f, i) => (
              <div key={i} className="card p-6 hover:-translate-y-0.5 transition-all duration-300">
                <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS ━━━ */}
      <section className="py-20">
        <div className="section">
          <div className="text-center mb-14">
            <span className="badge bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40 mb-4">Reviews</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-3">
              Loved by travelers worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-6 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FAQ ━━━ */}
      <section className="py-20 bg-gray-50/70 dark:bg-slate-900/40">
        <div className="section">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 mb-4">FAQ</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-3">
                Frequently asked questions
              </h2>
            </div>
            <div className="card p-6 sm:p-8">
              {FAQS.map((faq, i) => <FAQItem key={i} {...faq} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section className="py-20">
        <div className="section">
          <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-10 sm:p-16 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Ready to plan your next adventure?
              </h2>
              <p className="text-blue-100 mt-4 max-w-lg mx-auto text-lg">
                Join thousands of travelers who plan smarter with TripGenie.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' })} className="btn bg-white text-blue-700 hover:bg-blue-50 px-8 py-3.5 text-base font-bold rounded-xl shadow-elevated">
                  Start Planning — It's Free <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
