// ─── AI Chat & Trip Planning Types ────────────────────────────

export type PlaceTag = 'must-visit' | 'hidden-gem' | 'local-favorite' | 'budget-friendly' | 'luxury';

export interface AIPlace {
  name: string;
  description: string;
  localTip: string;       // POV guide-style tip
  bestTime: string;       // "Early morning for no crowds"
  tag: PlaceTag;
  time: string;           // e.g. "9:00 AM"
  period: 'morning' | 'afternoon' | 'evening';
  travelTimeFromPrev?: string;  // "15 min drive"
  estimatedCost: number;
  image: string;
  lat: number;
  lng: number;
}

export interface AIDayPlan {
  day: number;
  title: string;
  subtitle: string;
  theme: string;          // "Culture & Heritage", "Adventure & Nature"
  places: AIPlace[];
  dayBudget: {
    food: number;
    transport: number;
    activities: number;
    total: number;
  };
}

export interface AIBudget {
  total: number;
  hotel: number;
  food: number;
  transport: number;
  activities: number;
  perDay: number;
  perPerson: number;
  overBudget: boolean;
  budgetUsedPercent: number;
}

export interface AIHotel {
  name: string;
  area: string;
  style: 'luxury' | 'mid-range' | 'budget';
  pricePerNight: number;
  rating: number;
  image: string;
  whyRecommend: string;
}

export interface AITripData {
  id: string;
  destination: string;
  days: number;
  travelers: number;
  userBudget: number;
  preferences: string[];
  itinerary: AIDayPlan[];
  budget: AIBudget;
  hotels: AIHotel[];
  createdAt: string;
  lastModified: string;
}

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  tripUpdate?: Partial<AITripData>;    // Partial trip data to merge
  isStreaming?: boolean;
  type?: 'text' | 'trip-generated' | 'trip-modified' | 'budget-alert' | 'suggestion';
}

export interface SuggestionChip {
  text: string;
  icon?: string;
}
