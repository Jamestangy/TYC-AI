import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, Award, SlidersHorizontal } from 'lucide-react';
import { FLEET } from '../data/yachtData';
import { Yacht, TimeSlotId } from '../types/yacht';
import { formatSGD } from '../utils/pricingCalculator';

interface AiRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectYachtToBook: (yacht: Yacht, prefillSlot?: TimeSlotId) => void;
}

export const AiRecommendationModal: React.FC<AiRecommendationModalProps> = ({
  isOpen,
  onClose,
  onSelectYachtToBook,
}) => {
  if (!isOpen) return null;

  const [occasion, setOccasion] = useState<string>('party');
  const [guestCount, setGuestCount] = useState<number>(12);
  const [budgetAmount, setBudgetAmount] = useState<number>(2500);
  const [priority, setPriority] = useState<string>('water_sports');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    primaryYacht: Yacht;
    alternativeYacht?: Yacht;
    matchScore: number;
    reasoning: string;
    suggestedSlot: TimeSlotId;
    suggestedItinerary: string;
    recommendedToys: string[];
  } | null>(null);

  const handleBudgetNumberChange = (val: number) => {
    if (isNaN(val)) return;
    setBudgetAmount(Math.max(500, Math.min(30000, val)));
  };

  const handleGenerateRecommendation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          guestCount,
          budgetAmount,
          priority,
        }),
      });

      const data = await res.json();
      const matched = FLEET.find((y) => y.id === data.primaryYachtId) || FLEET[0];
      const alt = FLEET.find((y) => y.id === data.alternativeYachtId) || FLEET[1];

      setResult({
        primaryYacht: matched,
        alternativeYacht: alt,
        matchScore: data.matchScore || 96,
        reasoning: data.reasoning,
        suggestedSlot: (data.suggestedSlot as TimeSlotId) || 'afternoon',
        suggestedItinerary: data.suggestedItinerary,
        recommendedToys: data.recommendedToys || ['Floating Water Mat', 'Paddleboards'],
      });
    } catch (err) {
      console.error(err);
      // Fallback
      const matched = budgetAmount >= 4500 ? FLEET[3] : budgetAmount >= 2200 ? FLEET[2] : FLEET[0];
      setResult({
        primaryYacht: matched,
        alternativeYacht: FLEET[1],
        matchScore: 95,
        reasoning: `Selected based on your ${guestCount} guests and budget target of ${formatSGD(budgetAmount)}. Excellent match for ${occasion} charters.`,
        suggestedSlot: 'afternoon',
        suggestedItinerary: 'Sentosa Cove departure to Lazarus Island Eagle Bay for swimming and watersports.',
        recommendedToys: ['Floating Water Mat', 'Stand-Up Paddleboards'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getBudgetTierLabel = (val: number) => {
    if (val < 1600) return 'Smart Luxury (Catamarans & Monohulls)';
    if (val < 3800) return 'Premium Luxe (Flybridge Motor Yachts & Luxury Cats)';
    return 'Ultra VIP (Flagship Superyacht & Mega Multideck)';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl my-8 text-neutral-900">
        {/* Header - Minimalist */}
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-900">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="font-maritime text-sm font-bold uppercase tracking-wider text-neutral-900">
                AI Vessel Matchmaker
              </div>
              <div className="text-[11px] text-neutral-500 font-light">
                Tailored Singapore Yacht Recommendation
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body or Results View */}
        <div className="p-6">
          {!result ? (
            <div className="space-y-6">
              {/* Question 1: Occasion */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2.5">
                  1. Occasion
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'party', label: 'Birthday & Celebration' },
                    { id: 'romantic', label: 'Proposal & Romance' },
                    { id: 'family', label: 'Family Day Out' },
                    { id: 'corporate', label: 'Corporate Entertaining' },
                    { id: 'fishing', label: 'Island Swim & Watersports' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setOccasion(item.id)}
                      className={`rounded-xl border p-3 text-xs text-left transition-all cursor-pointer ${
                        occasion === item.id
                          ? 'border-neutral-900 bg-neutral-900 text-white font-medium shadow-sm'
                          : 'border-neutral-200 bg-neutral-50/50 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100/50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Group Size */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    2. Estimated Guest Count
                  </label>
                  <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-md">
                    {guestCount} Guests
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={50}
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                  className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1.5 font-light">
                  <span>Intimate (2-8)</span>
                  <span>Classic (10-18)</span>
                  <span>Large Group (20-35)</span>
                  <span>Superyacht VIP (40-50)</span>
                </div>
              </div>

              {/* Question 3: Budget Tier (Slide Bar + Direct Input) */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 flex items-center gap-2">
                      <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-900" />
                      <span>3. Charter Budget (SGD)</span>
                    </label>
                    <span className="text-[11px] text-neutral-500 font-light block mt-0.5">
                      {getBudgetTierLabel(budgetAmount)}
                    </span>
                  </div>

                  {/* Direct Number Input Field */}
                  <div className="flex items-center gap-1.5 bg-white border border-neutral-300 rounded-lg px-3 py-1.5 focus-within:border-neutral-900 focus-within:ring-1 focus-within:ring-neutral-900 transition-all shadow-xs">
                    <span className="text-xs font-semibold text-neutral-500 font-mono">S$</span>
                    <input
                      type="number"
                      min={800}
                      max={25000}
                      step={50}
                      value={budgetAmount}
                      onChange={(e) => handleBudgetNumberChange(parseInt(e.target.value, 10))}
                      className="w-24 text-xs font-mono font-bold text-neutral-900 focus:outline-none bg-transparent"
                      placeholder="2500"
                    />
                    <span className="text-[10px] text-neutral-400 uppercase font-mono">SGD</span>
                  </div>
                </div>

                {/* Smooth Range Slider */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min={1000}
                    max={8000}
                    step={100}
                    value={Math.min(8000, budgetAmount)}
                    onChange={(e) => setBudgetAmount(parseInt(e.target.value, 10))}
                    className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                    <span>S$1,000</span>
                    <span>S$2,500</span>
                    <span>S$5,000</span>
                    <span>S$8,000+</span>
                  </div>
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider mr-1">Presets:</span>
                  {[1200, 1850, 2500, 3500, 5500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBudgetAmount(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-md border font-mono transition-colors cursor-pointer ${
                        budgetAmount === preset
                          ? 'border-neutral-900 bg-neutral-900 text-white font-medium'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      {formatSGD(preset)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Vibe / Priority */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2.5">
                  4. Primary Vibe & Activities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'water_sports', label: 'Water Toys & Swimming (Mats, Kayaks, SUP)' },
                    { id: 'relaxation', label: 'Sunbathing & Shaded Relaxation' },
                    { id: 'skyline_views', label: 'Marina Bay Sands Sunset Skyline' },
                    { id: 'fine_dining', label: 'BBQ Grilling & Gourmet Dining' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPriority(item.id)}
                      className={`rounded-xl border p-3 text-xs text-left transition-all cursor-pointer ${
                        priority === item.id
                          ? 'border-neutral-900 bg-neutral-900 text-white font-medium shadow-sm'
                          : 'border-neutral-200 bg-neutral-50/50 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100/50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-5">
                <button
                  type="button"
                  onClick={handleGenerateRecommendation}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Evaluating Fleet & Match Criteria...</span>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Match Ideal Yacht for {formatSGD(budgetAmount)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Result Display - Minimalist */
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-neutral-900" />
                  <span className="font-maritime text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Curated Vessel Match
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1 text-xs font-mono font-semibold text-neutral-900">
                  <span>{result.matchScore}% Match Score</span>
                </div>
              </div>

              {/* Matched Yacht Card */}
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50/40 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <img
                    src={result.primaryYacht.image}
                    alt={result.primaryYacht.name}
                    className="h-28 w-full sm:w-36 rounded-xl object-cover shrink-0 border border-neutral-200"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                      <span>{result.primaryYacht.type.replace('_', ' ')}</span>
                      <span>·</span>
                      <span>Max {result.primaryYacht.maxGuests} Guests</span>
                    </div>
                    <h3 className="font-maritime text-xl font-bold text-neutral-900 mt-1 uppercase">
                      {result.primaryYacht.name}
                    </h3>
                    <p className="text-xs text-neutral-600 font-light mt-1">
                      {result.primaryYacht.tagline}
                    </p>
                    <div className="mt-2 text-xs text-neutral-700 font-mono">
                      From {formatSGD(result.primaryYacht.rates.weekday4h)} weekday / {formatSGD(result.primaryYacht.rates.weekend4h)} weekend (4h)
                    </div>
                  </div>
                </div>

                {/* AI Rationale */}
                <div className="rounded-xl border border-neutral-200 bg-white p-3.5 text-xs">
                  <div className="text-[11px] font-semibold text-neutral-900 uppercase tracking-wider mb-1">
                    AI Concierge Match Rationale:
                  </div>
                  <p className="text-neutral-700 leading-relaxed font-light">
                    {result.reasoning}
                  </p>
                </div>

                {/* Itinerary & Timing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-neutral-200 bg-white p-3">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Recommended Timing</span>
                    <strong className="text-neutral-900 capitalize font-semibold">{result.suggestedSlot} Slot</strong>
                  </div>
                  <div className="rounded-xl border border-neutral-200 bg-white p-3">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Departure Berth</span>
                    <strong className="text-neutral-900 font-semibold">{result.primaryYacht.homeMarina}</strong>
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-3 text-xs">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Suggested Itinerary Route</span>
                  <p className="text-neutral-700 font-light leading-relaxed">{result.suggestedItinerary}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-200 pt-4">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="w-full sm:w-auto text-xs text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer text-center py-2"
                >
                  ← Modify Parameters
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectYachtToBook(result.primaryYacht, result.suggestedSlot);
                    onClose();
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
                >
                  <span>Book {result.primaryYacht.name} Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
