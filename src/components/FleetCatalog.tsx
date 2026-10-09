import React, { useState } from 'react';
import { Users, Check, ArrowRight, Eye } from 'lucide-react';
import { FLEET } from '../data/yachtData';
import { Yacht, TimeSlotId } from '../types/yacht';
import { isWeekendDay, formatSGD } from '../utils/pricingCalculator';

interface FleetCatalogProps {
  selectedDate: string;
  selectedSlot: TimeSlotId;
  guestsCount: number;
  onSelectYacht: (yacht: Yacht) => void;
  onBookYacht: (yacht: Yacht) => void;
}

export const FleetCatalog: React.FC<FleetCatalogProps> = ({
  selectedDate,
  selectedSlot,
  guestsCount,
  onSelectYacht,
  onBookYacht,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showWithGst, setShowWithGst] = useState<boolean>(true);

  const isWeekend = isWeekendDay(selectedDate);

  const filteredFleet = FLEET.filter((yacht) => {
    if (activeCategory === 'all') return true;
    return yacht.type === activeCategory;
  });

  return (
    <section id="fleet" className="mx-auto max-w-7xl px-6 py-20 bg-neutral-50/50">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-neutral-200 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 tracking-wider uppercase">
            <span>Curated Fleet</span>
            <span aria-hidden="true">·</span>
            <span>Singapore Premier Vessels</span>
          </div>
          <h2 className="mt-2 font-maritime text-3xl font-bold tracking-tight text-neutral-900 uppercase">
            Vessels Available for Charter
          </h2>
          <p className="mt-2 text-sm text-neutral-600 max-w-xl font-light">
            Every vessel is fully crewed, commercially insured, and inspected by the Maritime and Port Authority of Singapore.
          </p>
        </div>

        {/* GST & Price Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500 font-medium">Display with 9% GST:</span>
          <button
            type="button"
            onClick={() => setShowWithGst(!showWithGst)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              showWithGst ? 'bg-neutral-900' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showWithGst ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-100 p-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All ({FLEET.length})
          </button>
          <button
            onClick={() => setActiveCategory('catamaran')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === 'catamaran'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Catamarans
          </button>
          <button
            onClick={() => setActiveCategory('motor_yacht')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === 'motor_yacht'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Motor Yachts
          </button>
          <button
            onClick={() => setActiveCategory('superyacht')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === 'superyacht'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Superyachts
          </button>
          <button
            onClick={() => setActiveCategory('sailing_yacht')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === 'sailing_yacht'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Sailing Yachts
          </button>
        </div>

        {/* Date rate flag */}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span>Rate Tier:</span>
          <span className="font-semibold text-neutral-800 uppercase tracking-wider">
            {isWeekend ? 'Weekend / Peak' : 'Weekday Standard'}
          </span>
        </div>
      </div>

      {/* Fleet Cards Grid (3 columns on desktop) */}
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredFleet.map((yacht) => {
          const baseRate = isWeekend ? yacht.rates.weekend4h : yacht.rates.weekday4h;
          const displayRate = showWithGst ? Math.round(baseRate * 1.09) : baseRate;
          const isCapacityExceeded = guestsCount > yacht.maxGuests;

          return (
            <div
              key={yacht.id}
              className={`group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 bg-white ${
                isCapacityExceeded
                  ? 'border-neutral-200 opacity-60'
                  : 'border-neutral-200 hover:border-neutral-400 hover:shadow-xl'
              }`}
            >
              {/* Image Container with aspect ratio */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                <img
                  src={yacht.image}
                  alt={yacht.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />
                
                {/* Home Marina Tag */}
                <div className="absolute top-3 left-3 rounded-md bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-neutral-800 border border-neutral-200/80 shadow-xs">
                  {yacht.homeMarina}
                </div>

                {/* Capacity Flag */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-neutral-900/80 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white">
                  <Users className="h-3.5 w-3.5 text-neutral-300" />
                  <span>Max {yacht.maxGuests} Guests</span>
                  <span className="text-neutral-400 font-normal">({yacht.baseGuests} incl.)</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-6">
                {/* Type & Length Kicker */}
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 font-mono">
                  <span>{yacht.type.replace('_', ' ')}</span>
                  <span aria-hidden="true">·</span>
                  <span>{yacht.lengthFt} ft</span>
                </div>

                {/* Yacht Title */}
                <h3 className="mt-1 font-maritime text-xl font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors uppercase">
                  {yacht.name}
                </h3>

                <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed font-light">
                  {yacht.tagline}
                </p>

                {/* Inclusions summary */}
                <div className="mt-4 border-t border-neutral-100 pt-3">
                  <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-2">
                    Standard Inclusions:
                  </div>
                  <ul className="space-y-1 text-xs text-neutral-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-neutral-900 shrink-0" />
                      <span>Captain & Crew + Fuel</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-neutral-900 shrink-0" />
                      <span className="truncate">{yacht.includedWaterToys[0] || 'Water Toys & Kayaks'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-neutral-900 shrink-0" />
                      <span>Gas BBQ Grill & Ice Chiller</span>
                    </li>
                  </ul>
                </div>

                {/* Price and Action Bar */}
                <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-neutral-400">
                      4-Hour Charter Base
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-xl font-bold text-neutral-900 tabular-nums">
                        {formatSGD(displayRate)}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-light">
                        {showWithGst ? 'nett' : '+9% GST'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectYacht(yacht)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700 hover:text-neutral-900 hover:border-neutral-400 transition-colors cursor-pointer"
                      title="View specifications"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onBookYacht(yacht)}
                      disabled={isCapacityExceeded}
                      className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        isCapacityExceeded
                          ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                          : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-xs'
                      }`}
                    >
                      <span>{isCapacityExceeded ? 'Max Pax Reached' : 'Reserve'}</span>
                      {!isCapacityExceeded && <ArrowRight className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {isCapacityExceeded && (
                  <p className="mt-2 text-[11px] text-rose-600">
                    Group size ({guestsCount} pax) exceeds legal limit ({yacht.maxGuests} max).
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
