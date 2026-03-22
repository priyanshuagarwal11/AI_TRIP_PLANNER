export interface Place {
  name: string;
  description: string;
  image?: string;
}

export interface DayPlan {
  day: number;
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
  itinerary: DayPlan[];
  cost: CostBreakdown;
  hotels: Hotel[];
  activities: Activity[];
  dateSaved?: string;
}
