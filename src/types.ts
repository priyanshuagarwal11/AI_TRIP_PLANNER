export interface Place {
  name: string;
  description: string;
  image?: string;
  lat: number;
  lng: number;
  time?: string;
  period?: 'morning' | 'afternoon' | 'evening';
}

export interface DayPlan {
  day: number;
  title?: string;
  subtitle?: string;
  places: Place[];
}

export interface CostBreakdown {
  total: number;
  hotel: number;
  travel: number;
  food: number;
}

export interface Hotel {
  name: string;
  price: number;
  rating: number;
  image?: string;
}

export interface Activity {
  name: string;
  description: string;
  type: string;
}

export interface TripData {
  id: string;
  destination: string;
  days: number;
  budget: number;
  startDate?: string;
  itinerary: DayPlan[];
  cost: CostBreakdown;
  hotels: Hotel[];
  activities: Activity[];
  dateSaved?: string;
}
