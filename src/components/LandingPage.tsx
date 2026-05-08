import React, { useState } from 'react';
import { ArrowRight, Map, Bot, Edit3, Globe, Sparkles, User, LogOut, Send } from 'lucide-react';
import { TripFormWizard } from './TripFormWizard';
import { useAuth } from '../context/AuthContext';

export const LandingPage = ({ onSubmit, onOpenAuth, onAIChat }: { onSubmit: (data: any) => void, onOpenAuth: () => void, onAIChat?: () => void }) => {
  const { currentUser, logout } = useAuth();
  const [activeCapability, setActiveCapability] = useState(2);

  return (
    <div className="bg-gray-50 dark:bg-[#0B1120] min-h-screen text-gray-400 dark:text-slate-600 dark:text-slate-300 font-sans overflow-hidden">
      


      {/* 1. Hero Section */}
      <section className="relative pt-40 pb-16 lg:pt-56 lg:pb-24 px-4 container mx-auto text-center flex flex-col items-center">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 backdrop-blur-md px-4 py-1.5 rounded-md mb-8 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span className="text-xs font-mono tracking-widest text-gray-400 dark:text-slate-600 dark:text-slate-300 uppercase">AI-POWERED TRIP PLANNER</span>
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white leading-[1.1] max-w-5xl font-serif">
          Your <span className="inline-block italic bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">intelligent</span> <br />
          travel companion
        </h1>

        <p className="mt-8 text-lg md:text-xl text-gray-500 dark:text-slate-500 dark:text-slate-400 max-w-2xl text-center leading-relaxed">
          WanderMind uses AI to craft hyper-personalized trip itineraries — from weekend getaways to month-long adventures — in seconds.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full relative z-10">
          <button 
            onClick={() => document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-slate-900 font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-transform hover:-translate-y-1"
          >
            + Build Your Itinerary
          </button>
          {onAIChat && (
            <button 
              onClick={onAIChat}
              className="px-8 py-4 border border-slate-600 hover:border-yellow-500 text-gray-400 dark:text-slate-600 dark:text-slate-300 hover:text-yellow-500 font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
            >
              <Bot className="w-4 h-4" />
              Chat with AI Agent
            </button>
          )}
        </div>
      </section>

      {/* THE TRIP FORM DIRECTLY ON THE HOMEPAGE */}
      <section id="plan" className="relative z-20 px-4 mb-32 max-w-4xl mx-auto scroll-m-24">
        <div className="dark">
            <TripFormWizard onSubmit={onSubmit} />
        </div>
      </section>

      {/* 2. Process Section */}
      <section id="how-it-works" className="py-24 px-4 lg:px-12 xl:px-24 mx-auto max-w-[1400px]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-[1px] bg-blue-600"></div>
          <span className="text-xs font-mono tracking-widest text-blue-500">PROCESS</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-white mb-20 tracking-tight">
          How <span className="italic text-yellow-500">WanderMind</span> works
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 border border-gray-200 dark:border-slate-800 rounded-sm overflow-hidden bg-slate-900/40">
          <div className="p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-slate-800 hover:bg-slate-800/40 transition-colors">
            <div className="text-6xl font-black text-[#1e293b] mb-8 font-serif leading-none tracking-tight">01</div>
            <Map className="w-6 h-6 text-gray-400 dark:text-slate-600 dark:text-slate-300 mb-6" />
            <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-4 font-bold tracking-wide">Tell us your vision</h3>
            <p className="text-[#94a3b8] leading-relaxed text-[15px]">
              Enter destination, travel dates, budget, and preferences. Our AI understands natural language — just talk to it.
            </p>
          </div>
          <div className="p-8 md:p-10 border-b md:border-b-0 lg:border-r border-gray-200 dark:border-slate-800 hover:bg-slate-800/40 transition-colors">
            <div className="text-6xl font-black text-[#1e293b] mb-8 font-serif leading-none tracking-tight">02</div>
            <Bot className="w-6 h-6 text-gray-400 dark:text-slate-600 dark:text-slate-300 mb-6" />
            <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-4 font-bold tracking-wide">AI builds your plan</h3>
            <p className="text-[#94a3b8] leading-relaxed text-[15px]">
              The model analyzes routes, hotels, restaurants, and attractions to build a perfectly timed itinerary.
            </p>
          </div>
          <div className="p-8 md:p-10 border-r border-gray-200 dark:border-slate-800 border-b lg:border-b-0 hover:bg-slate-800/40 transition-colors">
            <div className="text-6xl font-black text-[#1e293b] mb-8 font-serif leading-none tracking-tight">03</div>
            <Edit3 className="w-6 h-6 text-gray-400 dark:text-slate-600 dark:text-slate-300 mb-6" />
            <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-4 font-bold tracking-wide">Refine & export</h3>
            <p className="text-[#94a3b8] leading-relaxed text-[15px]">
              Chat to adjust any detail. Swap activities, change timings, add hidden gems — then export as PDF.
            </p>
          </div>
          <div className="p-8 md:p-10 hover:bg-slate-800/40 transition-colors">
            <div className="text-6xl font-black text-[#1e293b] mb-8 font-serif leading-none tracking-tight">04</div>
            <Globe className="w-6 h-6 text-gray-400 dark:text-slate-600 dark:text-slate-300 mb-6" />
            <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-4 font-bold tracking-wide">Travel smarter</h3>
            <p className="text-[#94a3b8] leading-relaxed text-[15px]">
              Get real-time updates, weather alerts, and local tips surfaced through the app as you travel.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Capabilities Section */}
      <section id="capabilities" className="py-24 px-4 lg:px-12 xl:px-24 mx-auto max-w-[1400px]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-[1px] bg-blue-600"></div>
          <span className="text-xs font-mono tracking-widest text-blue-500">CAPABILITIES</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-white mb-20 tracking-tight">
          Built for <span className="italic text-yellow-500">real</span> travelers
        </h2>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="flex flex-col w-full">
            {[ 
              { num: '01', type: 'Smart Routing', title: 'Optimized day-by-day routes', desc: 'Our AI groups nearby places and creates realistic schedules to minimize travel time.' },
              { num: '02', type: 'Budget AI', title: 'Real-time budget tracking', desc: 'Instantly calculate hotel, food, and transport costs. Get alerts if you exceed your budget.' },
              { num: '03', type: 'Conversational UX', title: 'Natural language planning', desc: 'Say "Replace the museum with a cooking class" or "Add a beach day on Day 3" — WanderMind understands and updates instantly.' },
              { num: '04', type: 'Local Intelligence', title: 'Off-the-beaten-path gems', desc: 'Discover hidden cafes, uncrowded viewpoints, and local secrets tagged exclusively for you.' }
            ].map((cap, i) => {
              const isActive = activeCapability === i;
              return (
                <div 
                  key={i} 
                  onMouseEnter={() => setActiveCapability(i)}
                  className={`py-8 px-6 lg:px-8 border-t border-gray-200 dark:border-slate-800 transition-all cursor-pointer ${isActive ? 'border-l-[3px] border-l-yellow-500 bg-slate-900/30' : 'opacity-60 hover:opacity-100 hover:bg-slate-900/10 border-l-[3px] border-l-transparent'}`}
                >
                  <div className="flex items-center gap-4 font-mono text-[11px] font-bold tracking-widest mb-4">
                    <span className={isActive ? 'text-gray-500 dark:text-slate-500 dark:text-slate-400' : 'text-gray-500 dark:text-slate-500'}>{cap.num}</span>
                    <span className="text-gray-400 dark:text-slate-600">—</span>
                    <span className={isActive ? 'text-gray-500 dark:text-slate-500 dark:text-slate-400' : 'text-gray-500 dark:text-slate-500 dark:text-slate-400'}>{cap.type}</span>
                  </div>
                  <h3 className="text-2xl font-serif text-gray-900 dark:text-white font-bold">{cap.title}</h3>
                  {isActive && cap.desc && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="text-[#94a3b8] text-[15px] leading-relaxed max-w-md">{cap.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="border-t border-gray-200 dark:border-slate-800"></div>
          </div>

          <div className="bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-slate-800 rounded-2xl relative flex flex-col min-h-[450px] overflow-hidden lg:ml-8 shadow-2xl">
            {/* Header */}
            <div className="bg-white dark:bg-[#0a1628] border-b border-gray-200 dark:border-slate-800/60 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm">WanderMind AI</div>
                  <div className="text-[10px] text-emerald-400 font-mono tracking-wider">● ONLINE</div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-6 flex flex-col justify-end space-y-4 bg-gradient-to-b from-[#0f172a] to-[#0a1628]/80 z-10 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-gray-900 dark:text-white" />
                </div>
                <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-slate-800/50 border border-slate-700/30 text-slate-200 rounded-bl-md shadow-lg backdrop-blur-sm">
                  Hi! I'm your AI travel agent. Where would you like to go? I can plan your route, optimize your budget, and find hidden gems! ✨
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap ml-11">
                {['5 days in Japan', 'Budget trip to Goa', 'Paris honeymoon'].map((s, i) => (
                  <button key={i} onClick={onAIChat} className="px-3 py-1.5 bg-slate-800/40 hover:bg-slate-800/80 border border-gray-200 dark:border-slate-700/50 rounded-xl text-xs text-gray-400 dark:text-slate-600 dark:text-slate-300 font-medium transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-800/60 bg-white dark:bg-[#0a1628]/90 z-10">
              <div 
                onClick={onAIChat}
                className="flex items-center gap-2 bg-slate-800/40 border border-slate-700/40 hover:border-yellow-500/40 rounded-xl py-2 px-3 cursor-text transition-colors group"
              >
                <div className="flex-1 text-sm text-gray-500 dark:text-slate-500 py-1 px-1">
                  Type your dream trip here...
                </div>
                <button className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 dark:text-white rounded-lg transition-transform group-hover:scale-105">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Preview Section */}
      <section className="py-24 px-4 lg:px-12 xl:px-24 mx-auto max-w-[1400px]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-[1px] bg-blue-600"></div>
          <span className="text-xs font-mono tracking-widest text-blue-500">LIVE PREVIEW</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-white mb-6 tracking-tight">
          See it in <span className="italic text-yellow-500">action</span>
        </h2>
        <p className="text-[17px] text-[#94a3b8] max-w-2xl mb-16 font-medium">
          A glimpse of what WanderMind generates — from a simple prompt to a full itinerary.
        </p>

        <div className="rounded-sm border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-[#0B1120] overflow-hidden shadow-2xl relative">
          {/* Header OS style */}
          <div className="bg-gray-50 dark:bg-[#0B1120] border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center gap-4">
            <div className="flex gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="font-mono text-xs text-gray-500 dark:text-slate-500 flex-1 pl-4 tracking-wider">
              wandermind.app — Itinerary Generator
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            {/* Left Chat Frame */}
            <div className="p-8 lg:p-12 space-y-10 bg-gray-50 dark:bg-[#0f172a]/50">
              
              <div className="flex flex-col items-end w-full space-y-2">
                <div className="bg-[#1e293b] p-6 rounded-sm text-[15px] text-gray-400 dark:text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-slate-800/80 shadow-md max-w-[95%] leading-relaxed font-sans">
                  Plan a 3-day trip to Jaipur for 2 people. Budget ₹15,000. We love forts, local food, and sunsets. Avoid crowded tourist spots.
                </div>
              </div>
              
              <div className="flex flex-col items-start w-full space-y-2">
                <div className="bg-transparent border border-[#334155] p-6 rounded-sm max-w-[95%] relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="font-mono text-[11px] font-bold text-yellow-500 tracking-widest">WanderMind</span>
                  </div>
                  <p className="text-[15px] text-[#cbd5e1] leading-relaxed">
                    Perfect! Jaipur in 3 days on ₹15,000 — I've built a route that hits the grand forts at golden hour, skips tourist lunch traps, and ends each evening at a rooftop with a view. Here's your plan <ArrowRight className="inline w-4 h-4 text-gray-500 dark:text-slate-500 ml-1" />
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end w-full space-y-2 pt-6">
                <div className="bg-[#1e293b] p-6 rounded-sm text-[15px] text-gray-400 dark:text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-slate-800/80 shadow-md max-w-[95%] leading-relaxed font-sans">
                  Can you swap Day 2 afternoon with a local bazaar instead?
                </div>
              </div>

               <div className="flex flex-col items-start w-full space-y-2">
                <div className="bg-transparent border border-[#334155] p-6 rounded-sm max-w-[95%] relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="font-mono text-[11px] font-bold text-yellow-500 tracking-widest">WanderMind</span>
                  </div>
                  <p className="text-[15px] text-[#cbd5e1] leading-relaxed">
                    Done! I've replaced the Amber Fort afternoon with Johari Bazaar and Bapu Bazaar — perfect for local textiles and street food. You'll save about ₹800 too.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Itinerary Frame */}
            <div className="p-8 lg:p-12 space-y-8 bg-gray-50 dark:bg-[#0B1120]">
              <div className="font-mono text-[11px] font-bold tracking-widest text-[#60a5fa] flex items-center gap-3 mb-10">
                <span className="text-blue-500">+</span> GENERATED ITINERARY
              </div>
              
              {[
                { 
                  day: 'DAY 01', 
                  title: 'THE PINK CITY AWAKENS', 
                  items: ['7:30 AM · Nahargarh Fort sunrise', '10:00 AM · City Palace (off-peak entry)', '1:00 PM · Laxmi Misthan Bhandar thali', '4:00 PM · Hawa Mahal golden hour'] 
                },
                { 
                  day: 'DAY 02', 
                  title: 'BAZAARS & BATTLEMENTS', 
                  items: ['8:00 AM · Amber Fort (early access)', '12:30 PM · Johari Bazaar & Bapu Bazaar', '5:00 PM · Rooftop café, Old City'] 
                },
                { 
                  day: 'DAY 03', 
                  title: 'HIDDEN JAIPUR', 
                  items: ['9:00 AM · Galta Ji Temple', '1:00 PM · Local thali experience', '4:00 PM · Jal Mahal lake walk'] 
                }
              ].map((day, i) => (
                <div key={i} className="border border-[#1e293b] p-6 lg:p-8 hover:bg-gray-50 dark:bg-[#0f172a] transition-colors rounded-sm">
                  <h4 className="font-mono text-xs tracking-[0.15em] font-bold text-yellow-500 mb-6 flex items-center gap-3">
                    {day.day} <span className="text-gray-400 dark:text-slate-600 font-sans font-light">—</span> {day.title}
                  </h4>
                  <ul className="space-y-4">
                    {day.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-4 text-[15px] text-[#94a3b8] font-sans">
                        <ArrowRight className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* 5. Minimal WanderFooter */}
      <footer className="border-t border-gray-200 dark:border-slate-800/80 bg-gray-50 dark:bg-[#0B1120] py-12 text-center text-gray-500 dark:text-slate-500 font-mono text-xs tracking-widest">
        WANDERMIND © {new Date().getFullYear()} — INTELLIGENT ROUTING
      </footer>
    </div>
  );
};
