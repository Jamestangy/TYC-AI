import React from 'react';
import { Sparkles, Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import { TIME_SLOTS } from '../data/yachtData';
import { TimeSlotId } from '../types/yacht';

interface HeroProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedSlot: TimeSlotId;
  onSlotChange: (slot: TimeSlotId) => void;
  guestsCount: number;
  onGuestsChange: (count: number) => void;
  onSearchFleet: () => void;
  onOpenRecommend: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  selectedDate,
  onDateChange,
  selectedSlot,
  onSlotChange,
  guestsCount,
  onGuestsChange,
  onSearchFleet,
  onOpenRecommend,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200 bg-white">
      {/* Background with measured contrast */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_yacht_sentosa_1791527573386.jpg"
          alt="Luxury yacht charter in Singapore waters at Sentosa Cove"
          className="h-full w-full object-cover object-center opacity-15 filter grayscale-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-3xl">
          {/* Unboxed metadata kicker */}
          <div className="mb-4 flex items-center gap-2.5 text-xs tracking-wider text-neutral-500 font-medium uppercase">
            <span>Singapore Premier Fleet</span>
            <span aria-hidden="true">·</span>
            <span>ONE°15 Marina Sentosa Cove</span>
            <span aria-hidden="true">·</span>
            <span>Lazarus Island Anchorages</span>
          </div>

          <h1 className="font-maritime text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 uppercase text-balance leading-tight">
            Private Luxury <span className="text-neutral-600">Yacht Charters</span> in Singapore
          </h1>

          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl text-pretty font-light">
            Sail to the calm waters of Lazarus Island, St. John’s, and the Marina Bay skyline. Real-time availability, upfront pricing with no hidden charges, and complimentary water toys.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onSearchFleet}
              className="flex items-center gap-2.5 rounded-xl bg-neutral-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-neutral-800 shadow-sm cursor-pointer"
            >
              <span>Explore Fleet Availability</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenRecommend}
              className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white/90 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-800 transition-all hover:border-neutral-900 hover:text-neutral-900 cursor-pointer shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-neutral-700" />
              <span>AI Vessel Matchmaker</span>
            </button>
          </div>
        </div>

        {/* Real-Time Availability & Booking Search Strip - Minimalist Card */}
        <div className="mt-14 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Field 1: Date */}
            <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5 transition-colors focus-within:border-neutral-900 focus-within:bg-white">
              <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <Calendar className="h-3.5 w-3.5 text-neutral-700" />
                <span>Charter Date</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none"
              />
            </div>

            {/* Field 2: Time Slot */}
            <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5 transition-colors focus-within:border-neutral-900 focus-within:bg-white">
              <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <Clock className="h-3.5 w-3.5 text-neutral-700" />
                <span>Cruising Window</span>
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => onSlotChange(e.target.value as TimeSlotId)}
                className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none cursor-pointer"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot.id} value={slot.id} className="bg-white text-neutral-900">
                    {slot.label} ({slot.hours})
                  </option>
                ))}
              </select>
            </div>

            {/* Field 3: Headcount */}
            <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5 transition-colors focus-within:border-neutral-900 focus-within:bg-white">
              <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <Users className="h-3.5 w-3.5 text-neutral-700" />
                <span>Guest Count</span>
              </label>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-900">
                  {guestsCount} Guests
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onGuestsChange(Math.max(2, guestsCount - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-300 bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => onGuestsChange(Math.min(50, guestsCount + 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-300 bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={onSearchFleet}
                className="w-full rounded-xl bg-neutral-900 py-3.5 px-4 text-center text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-neutral-800 shadow-sm cursor-pointer"
              >
                Check Available Fleet
              </button>
            </div>
          </div>
        </div>

        {/* 4-column Trust KPI Strip */}
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 border-t border-neutral-200 pt-8 text-neutral-500 text-xs">
          <div>
            <span className="block font-mono text-base font-bold text-neutral-900">MPA Licensed</span>
            <span className="mt-0.5 block text-neutral-500">Commercial maritime skippers & crew</span>
          </div>
          <div>
            <span className="block font-mono text-base font-bold text-neutral-900">Zero Corkage</span>
            <span className="mt-0.5 block text-neutral-500">Bring your own wine, beers & food</span>
          </div>
          <div>
            <span className="block font-mono text-base font-bold text-neutral-900">Included Toys</span>
            <span className="mt-0.5 block text-neutral-500">Kayaks, paddleboards & water mats</span>
          </div>
          <div>
            <span className="block font-mono text-base font-bold text-neutral-900">Direct Marina</span>
            <span className="mt-0.5 block text-neutral-500">ONE°15 & Keppel Bay berths</span>
          </div>
        </div>
      </div>
    </section>
  );
};
