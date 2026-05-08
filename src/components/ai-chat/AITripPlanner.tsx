import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, MapPin, Clock, IndianRupee, Star, Compass, Tag, ChevronDown, ArrowLeft, AlertTriangle, Mic, Loader2 } from 'lucide-react';
import { sendChatMessage, extractTripJSON, extractConversation, isApiKeySet } from '../../lib/gemini';
import type { AITripData, AIDayPlan, ChatMessage, SuggestionChip } from '../../types/chat';
import { useAuth } from '../../context/AuthContext';
import { saveTripToDB } from '../../lib/firestore';
import { TripMap } from '../TripMap';

const SUGGESTIONS: SuggestionChip[] = [
  { text: 'Plan a 5-day trip to Japan' },
  { text: 'Budget trip to Goa for 4 friends' },
  { text: '3-day Jaipur heritage tour ₹10,000' },
  { text: 'Romantic Paris getaway, 7 days' },
  { text: 'Adventure trip to Bali, budget ₹50k' },
];

const TAG_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  'must-visit': { bg: 'bg-blue-500/15', text: 'text-blue-400', label: '⭐ Must Visit' },
  'hidden-gem': { bg: 'bg-purple-500/15', text: 'text-purple-400', label: '💎 Hidden Gem' },
  'local-favorite': { bg: 'bg-amber-500/15', text: 'text-amber-400', label: '❤️ Local Favorite' },
  'budget-friendly': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: '💰 Budget Friendly' },
  'luxury': { bg: 'bg-rose-500/15', text: 'text-rose-400', label: '✨ Luxury' },
};

function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

export const AITripPlanner: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState<AITripData | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [showPanel, setShowPanel] = useState(true);
  const [viewMode, setViewMode] = useState<'itinerary' | 'map'>('itinerary');
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiReady = isApiKeySet();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg: ChatMessage = {
      id: generateId(), role: 'user', content: msg,
      timestamp: new Date().toISOString(), type: 'text',
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (!apiReady) {
      // Fallback demo response with mock data
      setTimeout(() => {
        const isHindi = /[अ-ह]/i.test(msg) || msg.toLowerCase().includes('hindi');
        const lowerMsg = msg.toLowerCase().trim();
        
        // Handle simple greetings without generating a trip
        if (['hello', 'hi', 'hey', 'hii', 'yo', 'namaste', 'नमस्ते'].includes(lowerMsg)) {
          const greetingReply: ChatMessage = {
            id: generateId(), role: 'assistant',
            content: isHindi 
              ? "नमस्ते यात्री 👋\nआप कहाँ जाना चाहेंगे? ✈️" 
              : "Hey traveler 👋\nWhere would you like to go? ✈️",
            timestamp: new Date().toISOString(), type: 'text',
          };
          setMessages(prev => [...prev, greetingReply]);
          setLoading(false);
          return;
        }

        // Handle goodbyes
        if (['bye', 'goodbye', 'alvida', 'बाय', 'अलविदा'].includes(lowerMsg)) {
          const byeReply: ChatMessage = {
            id: generateId(), role: 'assistant',
            content: isHindi 
              ? "अलविदा 👋\nआपके अगले रोमांच पर मिलते हैं ✈️" 
              : "Goodbye 👋\nSee you on your next adventure ✈️",
            timestamp: new Date().toISOString(), type: 'text',
          };
          setMessages(prev => [...prev, byeReply]);
          setLoading(false);
          return;
        }

        // Handle thanks
        if (['thanks', 'thank you', 'shukriya', 'dhanyawad', 'धन्यवाद', 'शुक्रिया'].includes(lowerMsg)) {
          const thanksReply: ChatMessage = {
            id: generateId(), role: 'assistant',
            content: isHindi 
              ? "आपका स्वागत है 🌍" 
              : "You're welcome 🌍",
            timestamp: new Date().toISOString(), type: 'text',
          };
          setMessages(prev => [...prev, thanksReply]);
          setLoading(false);
          return;
        }

        // Handle generic questions in demo mode
        const isQuestion = lowerMsg.includes('?') || lowerMsg.includes('which') || lowerMsg.includes('how') || lowerMsg.includes('vs') || lowerMsg.includes('compare');
        if (isQuestion) {
          const answerReply: ChatMessage = {
            id: generateId(), role: 'assistant',
            content: isHindi 
              ? "यह एक बेहतरीन सवाल है! दोनों जगहों का अपना एक अलग आकर्षण है। आप अपनी प्राथमिकताओं के आधार पर कोई भी चुन सकते हैं।" 
              : "That's a great question! Both have their own unique charm depending on what kind of experience you are looking for.",
            timestamp: new Date().toISOString(), type: 'text',
          };
          setMessages(prev => [...prev, answerReply]);
          setLoading(false);
          return;
        }

        const destinationName = msg || (isHindi ? "गोवा" : "Goa");
        const demoTripJSON = {
          destination: isHindi ? `${destinationName}, भारत` : `${destinationName}, India`,
          days: 3,
          travelers: 2,
          preferences: ["beach", "budget"],
          itinerary: [
            {
              day: 1,
              title: isHindi ? `Arrival & Exploration in ${destinationName}` : `Arrival & Exploration in ${destinationName}`,
              subtitle: isHindi ? "Experience the lively vibe" : "Experience the lively vibe",
              theme: "explore",
              places: [
                {
                  name: isHindi ? "Local Attraction" : "Local Attraction",
                  description: isHindi ? "A popular spot known for its unique culture." : "A popular spot known for its unique culture.",
                  tag: "must-visit",
                  timeToSpend: "2-3 hours",
                  bestTime: "10:00 AM",
                  localTip: isHindi ? "भीड़ से बचने के लिए सुबह जल्दी जाएं!" : "Go early in the morning to avoid the heavy crowd!",
                  travelTimeFromPrev: "N/A",
                  estimatedCost: 1500,
                  image: "",
                  lat: 40.7128,
                  lng: -74.0060
                }
              ],
              dayBudget: { food: 1000, transport: 500, activities: 1500, total: 3000 }
            }
          ],
          budget: {
            total: 12000, hotel: 4000, food: 3000, transport: 2000, activities: 3000,
            perDay: 4000, perPerson: 6000, overBudget: false, budgetUsedPercent: 60
          },
          hotels: [
            {
              name: isHindi ? "द सी व्यू रिसॉर्ट" : "The Sea View Resort",
              area: destinationName,
              style: "mid-range",
              pricePerNight: 2000,
              rating: 4.2,
              image: "",
              whyRecommend: isHindi ? "समुद्र तट के शानदार दृश्य और उचित मूल्य।" : "Great views and reasonable prices."
            }
          ]
        };

        const updated: AITripData = {
          id: generateId(),
          ...demoTripJSON,
          userBudget: 20000,
          itinerary: demoTripJSON.itinerary as any,
          hotels: demoTripJSON.hotels as any,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        };

        setTripData(updated);
        setActiveDay(0);
        setShowPanel(true);

        if (currentUser) {
          saveTripToDB(currentUser.uid, updated);
        }

        const isModification = tripData !== null;
        
        let content = '';
        if (isHindi) {
          content = isModification 
            ? `बढ़िया! 🌊 आपकी यात्रा में ये बदलाव जोड़ दिए गए हैं... यहाँ आपका अपडेटेड प्लान है 👇`
            : `शानदार चुनाव! 🌴 ${destinationName} एक बहुत ही बेहतरीन जगह है।\n\nयहाँ आपके लिए एक स्मार्ट 3-दिन का प्लान है 👇\n\n**पहला दिन:** एक्सप्लोर करें\n**दूसरा दिन:** संस्कृति\n**तीसरा दिन:** प्रकृति`;
        } else {
          content = isModification
            ? `Nice! 🌊 Adding those updates to your trip... Here is the new plan 👇`
            : `Awesome choice! 🌴 ${destinationName} is a beautiful place to visit.\n\nHere's a smart 3-day plan for you 👇\n\n**Day 1:** City Exploration\n**Day 2:** Culture & History\n**Day 3:** Nature & Relax`;
        }

        const demoReply: ChatMessage = {
          id: generateId(), role: 'assistant',
          content,
          timestamp: new Date().toISOString(), 
          type: isModification ? 'trip-modified' : 'trip-generated',
          tripUpdate: demoTripJSON as any
        };
        setMessages(prev => [...prev, demoReply]);
        setLoading(false);
      }, 1500);
      return;
    }

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      
      let finalMsg = msg;
      const lowerMsg = msg.toLowerCase().trim();
      const isGreetingOrCasual = ['hello', 'hi', 'hey', 'hii', 'yo', 'namaste', 'नमस्ते', 'bye', 'goodbye', 'alvida', 'बाय', 'अलविदा', 'thanks', 'thank you', 'shukriya', 'dhanyawad', 'धन्यवाद', 'शुक्रिया'].includes(lowerMsg);
      
      if (!isGreetingOrCasual) {
        const previousPlanSummary = tripData ? JSON.stringify({
          destination: tripData.destination,
          days: tripData.days,
          itinerary: tripData.itinerary.map(d => ({
            day: d.day,
            title: d.title,
            places: d.places.map(p => p.name)
          }))
        }) : "None";

        finalMsg = `You are an intelligent travel assistant.

You must first understand the user's intent and respond accordingly.

User Input:
"${msg}"

Existing Itinerary (if any):
${previousPlanSummary}

Instructions:

1. Detect intent:
- If user is asking to plan, modify, or extend a trip → treat as TRIP REQUEST
- If user is asking a general question (e.g., "which is better", "vs", "compare") → treat as QUESTION

2. If TRIP REQUEST:
- Create or update the itinerary
- Use the existing itinerary if provided
- If a new destination is added, extend the plan (do NOT replace)
- Keep all destinations included (e.g., Agra + Delhi)
- Return a clear day-wise plan

3. If QUESTION:
- Give a direct, short answer
- Do NOT generate itinerary
- Do NOT say "trip updated"

4. Strict Rules:
- Never mix both responses
- Never default to any random location (like Goa)
- Stay relevant to user input only
- Remember: ONLY output JSON if it is a TRIP REQUEST.

Output format:
- If trip request → Both conversational text AND the updated JSON block
- If question → Short paragraph answer ONLY, NO JSON.`;
      }

      history.push({ role: 'user', content: finalMsg });

      const response = await sendChatMessage(history);
      const conversationText = extractConversation(response);
      const tripJSON = extractTripJSON(response);

      if (tripJSON) {
        const updated: AITripData = {
          id: tripData?.id || generateId(),
          destination: tripJSON.destination || tripData?.destination || '',
          days: tripJSON.days || tripData?.days || 1,
          travelers: tripJSON.travelers || tripData?.travelers || 1,
          userBudget: tripData?.userBudget || 0,
          preferences: tripJSON.preferences || tripData?.preferences || [],
          itinerary: (tripJSON.itinerary || tripData?.itinerary || []) as AIDayPlan[],
          budget: {
            total: 0, hotel: 0, food: 0, transport: 0, activities: 0,
            perDay: 0, perPerson: 0, overBudget: false, budgetUsedPercent: 0,
            ...(tripData?.budget || {}),
            ...(tripJSON.budget || {}),
          },
          hotels: (tripJSON.hotels || tripData?.hotels || []) as AITripData['hotels'],
          createdAt: tripData?.createdAt || new Date().toISOString(),
          lastModified: new Date().toISOString(),
        };
        setTripData(updated);
        setActiveDay(0);
        setShowPanel(true);

        if (currentUser) {
          saveTripToDB(currentUser.uid, updated);
        }
      }

      const assistantMsg: ChatMessage = {
        id: generateId(), role: 'assistant', content: conversationText,
        timestamp: new Date().toISOString(),
        type: tripJSON ? (tripData ? 'trip-modified' : 'trip-generated') : 'text',
        tripUpdate: tripJSON || undefined,
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Budget alert
      if (tripJSON?.budget?.overBudget) {
        const alertMsg: ChatMessage = {
          id: generateId(), role: 'assistant',
          content: '⚠️ **Budget Alert:** This plan exceeds your budget! I can suggest cheaper alternatives — just ask me to "make it more budget-friendly".',
          timestamp: new Date().toISOString(), type: 'budget-alert',
        };
        setMessages(prev => [...prev, alertMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: generateId(), role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}. Please try again.`,
        timestamp: new Date().toISOString(), type: 'text',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const currentDay = tripData?.itinerary?.[activeDay];

  return (
    <div className="h-screen bg-gray-50 dark:bg-[#060d1b] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-gray-200 dark:border-slate-800/60 bg-white/90 dark:bg-[#0a1628]/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-lg text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-900 dark:text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white text-sm">WanderMind AI</span>
              <span className="text-[10px] text-emerald-400 ml-2 font-mono">● Online</span>
            </div>
          </div>
        </div>
        {tripData && (
          <button onClick={() => setShowPanel(!showPanel)} className="lg:hidden px-3 py-1.5 bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
            {showPanel ? 'Chat' : 'Trip'}
          </button>
        )}
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0">
        {/* LEFT: Chat Panel */}
        <div className={`flex flex-col ${tripData && showPanel ? 'hidden lg:flex lg:w-[45%]' : 'w-full'} border-r border-gray-200 dark:border-slate-800/40`}>
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 custom-scrollbar space-y-4">
            {/* Welcome */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-500/20 flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white mb-2">
                  Your AI Travel Agent
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
                  Tell me where you want to go. I'll plan the route, track the budget, find hidden gems, and show you real images — all through conversation.
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} onClick={() => handleSend(s.text)}
                      className="px-4 py-2 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/40 hover:border-slate-600 rounded-xl text-xs text-slate-600 dark:text-slate-300 font-medium transition-all">
                      {s.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-gray-900 dark:text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-gray-900 dark:text-white rounded-br-md'
                    : msg.type === 'budget-alert'
                      ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-bl-md'
                      : 'bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/30 text-slate-200 rounded-bl-md'
                }`}>
                  {msg.type === 'budget-alert' && <AlertTriangle className="w-4 h-4 text-amber-400 inline mr-1.5" />}
                  {msg.type === 'trip-generated' && (
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono font-bold tracking-wider mb-2">
                      <Compass className="w-3 h-3" /> TRIP GENERATED
                    </div>
                  )}
                  {msg.type === 'trip-modified' && (
                    <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-mono font-bold tracking-wider mb-2">
                      <Sparkles className="w-3 h-3" /> TRIP UPDATED
                    </div>
                  )}
                  <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 dark:text-white">$1</strong>')
                      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-400 underline">$1</a>')
                      .replace(/`(.*?)`/g, '<code class="bg-gray-50 dark:bg-white dark:bg-slate-900/50 px-1.5 py-0.5 rounded text-xs text-emerald-400">$1</code>')
                  }} />
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-gray-900 dark:text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/30 rounded-2xl rounded-bl-md px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Planning your trip...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 lg:px-6 py-4 border-t border-gray-200 dark:border-slate-800/40 bg-[#0a1628]/50 shrink-0">
            <div className="flex items-center gap-2 relative">
              <input ref={inputRef} type="text" placeholder="Plan a trip, modify itinerary, ask anything..."
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-slate-800/40 border border-slate-700/40 focus:border-yellow-500/40 rounded-xl py-3 pl-4 pr-12 text-gray-900 dark:text-white placeholder-slate-500 outline-none text-sm transition-all" />
              
              <button 
                onClick={toggleListening}
                className={`absolute right-16 p-2 rounded-lg transition-colors ${isListening ? 'text-red-400 bg-red-500/10 animate-pulse' : 'text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-slate-700/50'}`}
              >
                <Mic className="w-4 h-4" />
              </button>

              <button onClick={() => handleSend()} disabled={!input.trim() || loading}
                className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 disabled:opacity-30 text-gray-900 dark:text-white rounded-xl transition-all ml-1">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Trip Panel */}
        {tripData && showPanel && (
          <div className={`flex-1 overflow-y-auto custom-scrollbar bg-[#070e1c] ${!showPanel ? 'hidden' : ''}`}>
            <div className="p-4 lg:p-6 space-y-6">
              {/* Trip Header */}
              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/5 border border-blue-500/15 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-yellow-500" />
                  <span className="font-mono text-[10px] font-bold text-slate-500 tracking-wider">DESTINATION</span>
                </div>
                <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white">{tripData.destination}</h2>
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>{tripData.days} days</span>
                  <span className="text-slate-700">·</span>
                  <span>{tripData.travelers} traveler{tripData.travelers > 1 ? 's' : ''}</span>
                  {tripData.preferences?.length > 0 && <>
                    <span className="text-slate-700">·</span>
                    <span>{tripData.preferences.join(', ')}</span>
                  </>}
                </div>
              </div>

              {/* Budget Cards */}
              {tripData.budget && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'TOTAL', value: tripData.budget.total, color: 'text-blue-400', icon: IndianRupee },
                    { label: 'HOTEL', value: tripData.budget.hotel, color: 'text-purple-400', icon: Star },
                    { label: 'FOOD', value: tripData.budget.food, color: 'text-orange-400', icon: Tag },
                    { label: 'TRAVEL', value: tripData.budget.transport, color: 'text-emerald-400', icon: Compass },
                  ].map(b => (
                    <div key={b.label} className="bg-white dark:bg-slate-800/20 border border-gray-100 dark:border-slate-700/20 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <b.icon className={`w-3 h-3 ${b.color}`} />
                        <span className="font-mono text-[9px] font-bold text-slate-500 tracking-wider">{b.label}</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">₹{(b.value || 0).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              )}

              {tripData.budget?.overBudget && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-xs text-red-300">Budget exceeded! Ask me to optimize costs.</span>
                </div>
              )}

              {/* Day Selector */}
              {tripData.itinerary?.length > 0 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {tripData.itinerary.map((day, i) => (
                    <button key={i} onClick={() => setActiveDay(i)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        activeDay === i
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-white dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700/30 hover:border-slate-600'
                      }`}>
                      Day {day.day}
                    </button>
                  ))}
                </div>
              )}

              {/* Active Day */}
              {currentDay && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{currentDay.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentDay.subtitle}</p>
                    {currentDay.theme && (
                      <span className="inline-block mt-2 text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded tracking-wider">
                        {currentDay.theme.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Places */}
                  {currentDay.places?.map((place, pi) => {
                    const tagStyle = TAG_STYLES[place.tag] || TAG_STYLES['must-visit'];
                    return (
                      <div key={pi} className="bg-white dark:bg-slate-800/20 border border-gray-100 dark:border-slate-700/20 rounded-xl overflow-hidden hover:border-slate-600/40 transition-colors group">
                        {place.image && (
                          <div className="relative h-36 overflow-hidden">
                            <img src={place.image} alt={place.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            <div className="absolute top-2 left-2">
                              <span className={`${tagStyle.bg} ${tagStyle.text} text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm`}>
                                {tagStyle.label}
                              </span>
                            </div>
                            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
                              <Clock className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                              <span className="text-[10px] text-gray-900 dark:text-white font-bold">{place.time}</span>
                            </div>
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{place.name}</h4>
                            {place.estimatedCost > 0 && (
                              <span className="text-xs font-mono text-emerald-400 shrink-0">₹{place.estimatedCost.toLocaleString('en-IN')}</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{place.description}</p>
                          {place.localTip && (
                            <div className="mt-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg px-3 py-2">
                              <span className="text-[10px] font-mono font-bold text-yellow-500 tracking-wider">💡 LOCAL TIP</span>
                              <p className="text-xs text-yellow-200/80 mt-0.5">{place.localTip}</p>
                            </div>
                          )}
                          {place.travelTimeFromPrev && pi > 0 && (
                            <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                              <Compass className="w-3 h-3" /> {place.travelTimeFromPrev} from previous
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Day Budget */}
                  {currentDay.dayBudget && (
                    <div className="bg-slate-800/15 border border-gray-100 dark:border-slate-700/20 rounded-xl p-4">
                      <span className="font-mono text-[10px] font-bold text-slate-500 tracking-wider">DAY {currentDay.day} COST</span>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>🍕 ₹{(currentDay.dayBudget.food || 0).toLocaleString('en-IN')}</span>
                        <span>🚕 ₹{(currentDay.dayBudget.transport || 0).toLocaleString('en-IN')}</span>
                        <span>🎯 ₹{(currentDay.dayBudget.activities || 0).toLocaleString('en-IN')}</span>
                        <span className="text-gray-900 dark:text-white font-bold ml-auto">Total: ₹{(currentDay.dayBudget.total || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Hotels */}
              {tripData.hotels?.length > 0 && (
                <div>
                  <h4 className="font-mono text-[10px] font-bold text-slate-500 tracking-wider mb-3">RECOMMENDED HOTELS</h4>
                  <div className="space-y-2">
                    {tripData.hotels.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white dark:bg-slate-800/20 border border-gray-100 dark:border-slate-700/20 rounded-xl p-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-700/30 flex items-center justify-center text-lg shrink-0">🏨</div>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-gray-900 dark:text-white text-sm block truncate">{h.name}</span>
                          <span className="text-[10px] text-slate-500">{h.area} · {h.style} · ⭐ {h.rating}</span>
                        </div>
                        <span className="font-mono text-sm font-bold text-emerald-400 shrink-0">₹{h.pricePerNight?.toLocaleString('en-IN')}/n</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modification suggestions */}
              {tripData.itinerary?.length > 0 && (
                <div>
                  <h4 className="font-mono text-[10px] font-bold text-slate-500 tracking-wider mb-3">TRY SAYING</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Add more hidden gems',
                      'Make it budget-friendly',
                      'Replace Day 2 with beaches',
                      'Add local food spots',
                      'Show luxury options',
                    ].map((s, i) => (
                      <button key={i} onClick={() => { setInput(s); setShowPanel(false); }}
                        className="px-3 py-1.5 bg-white dark:bg-slate-800/30 hover:bg-gray-100 dark:hover:bg-slate-800/50 border border-gray-200 dark:border-slate-700/30 rounded-lg text-[11px] text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-all">
                        "{s}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty state right panel */}
        {!tripData && (
          <div className="hidden lg:flex flex-1 items-center justify-center bg-[#070e1c] border-l border-gray-200 dark:border-slate-800/40">
            <div className="text-center px-8">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800/20 border border-gray-100 dark:border-slate-700/20 flex items-center justify-center mx-auto mb-6">
                <Compass className="w-12 h-12 text-slate-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-500 mb-2">Your trip will appear here</h3>
              <p className="text-sm text-slate-600 max-w-xs">
                Start a conversation with WanderMind AI to generate your personalized itinerary.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
