export type VesselType = 'catamaran' | 'motor_yacht' | 'superyacht' | 'sailing_yacht';

export type TimeSlotId = 'morning' | 'afternoon' | 'sunset' | 'fullday';

export interface TimeSlot {
  id: TimeSlotId;
  label: string;
  hours: string;
  durationHours: number;
  description: string;
  isPopular?: boolean;
}

export interface YachtAddOn {
  id: string;
  name: string;
  category: 'water_toy' | 'fnb' | 'entertainment' | 'route';
  price: number;
  unit: 'flat' | 'per_person' | 'per_hour';
  description: string;
  iconName: string;
}

export interface Yacht {
  id: string;
  name: string;
  type: VesselType;
  tagline: string;
  lengthFt: number;
  maxGuests: number;
  baseGuests: number;
  cabins: number;
  bathrooms: number;
  crewCount: number;
  homeMarina: string;
  rates: {
    weekday4h: number;
    weekend4h: number;
    extraGuestRate: number;
    extraHourRate: number;
  };
  image: string;
  secondaryImages?: string[];
  features: string[];
  includedWaterToys: string[];
  soundSystem: string;
  description: string;
  bestFor: string[];
  specs: {
    cruisingSpeedKnots: number;
    beamWidthMeters: number;
    yearBuilt: number;
    airConditioned: boolean;
    bbqGrill: boolean;
  };
}

export interface NauticalWaypoint {
  id: string;
  name: string;
  category: 'marina' | 'anchorage' | 'landmark' | 'marine_park';
  coordinates: { x: number; y: number }; // Percentage 0-100 on map
  realCoord: { lat: number; lng: number };
  description: string;
  highlight: string;
  recommendedFor: string;
}

export interface BookingState {
  yachtId: string;
  date: string;
  timeSlot: TimeSlotId;
  guestsCount: number;
  selectedAddOns: { [addOnId: string]: number }; // addOnId -> quantity
  occasion: string;
  chartererName: string;
  chartererEmail: string;
  chartererPhone: string;
  specialRequests: string;
  paymentMethod: 'paynow' | 'credit_card' | 'bank_transfer';
}

export interface PriceBreakdown {
  baseCharterRate: number;
  isWeekend: boolean;
  durationHours: number;
  extraGuests: number;
  extraGuestsCost: number;
  addOnsCost: number;
  subtotal: number;
  gstAmount: number; // 9% Singapore GST
  totalSGD: number;
  itemizedAddOns: { name: string; cost: number; qty: number }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'agent' | 'system';
  agentName?: string;
  text: string;
  timestamp: string;
  suggestedYachtId?: string;
  actionPrompt?: string;
}

export interface RecommendationCriteria {
  occasion: 'party' | 'romantic' | 'family' | 'corporate' | 'fishing';
  guestCount: number;
  budgetAmount: number;
  budgetRange?: 'standard' | 'premium' | 'ultra_luxury';
  priority: 'water_sports' | 'relaxation' | 'fine_dining' | 'skyline_views';
}

export interface AiRecommendationResult {
  primaryYacht: Yacht;
  alternativeYacht?: Yacht;
  matchScore: number;
  reasoning: string;
  suggestedSlot: TimeSlotId;
  suggestedItinerary: string;
  recommendedToys: string[];
  estimatedTotalSGD: number;
}
