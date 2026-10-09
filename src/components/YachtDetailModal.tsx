import React from 'react';
import { X, Check, ArrowRight, Waves, Music } from 'lucide-react';
import { Yacht } from '../types/yacht';
import { formatSGD } from '../utils/pricingCalculator';

interface YachtDetailModalProps {
  yacht: Yacht | null;
  isOpen: boolean;
  onClose: () => void;
  onBookYacht: (yacht: Yacht) => void;
}

export const YachtDetailModal: React.FC<YachtDetailModalProps> = ({
  yacht,
  isOpen,
  onClose,
  onBookYacht,
}) => {
  if (!isOpen || !yacht) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl my-8 text-neutral-900">
        {/* Top Header */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
          <img
            src={yacht.image}
            alt={yacht.name}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-white/90 p-2 text-neutral-900 hover:bg-white transition-colors cursor-pointer shadow-sm"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-300">
              <span>{yacht.type.replace('_', ' ')}</span>
              <span>·</span>
              <span>{yacht.lengthFt} ft ({yacht.specs.beamWidthMeters}m beam)</span>
            </div>
            <h2 className="font-maritime text-2xl sm:text-3xl font-bold text-white uppercase mt-1">
              {yacht.name}
            </h2>
            <p className="text-xs text-neutral-200 font-light mt-1">
              {yacht.tagline}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-center">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Max Capacity</span>
              <span className="font-mono text-sm font-bold text-neutral-900">{yacht.maxGuests} Guests</span>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-center">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Home Berth</span>
              <span className="text-xs font-bold text-neutral-900 truncate block">{yacht.homeMarina.split(',')[0]}</span>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-center">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Cabins & Baths</span>
              <span className="font-mono text-sm font-bold text-neutral-900">{yacht.cabins} Cab / {yacht.bathrooms} Bath</span>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-center">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Crew Onboard</span>
              <span className="font-mono text-sm font-bold text-neutral-900">{yacht.crewCount} Crew + Capt</span>
            </div>
          </div>

          {/* Narrative */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              Vessel Overview & Experience
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              {yacht.description}
            </p>
          </div>

          {/* Features and Water Toys */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Check className="h-4 w-4" />
                <span>Vessel Amenities</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-600 font-light">
                {yacht.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-neutral-900">·</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Waves className="h-4 w-4" />
                <span>Included Water Toys</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-600 font-light">
                {yacht.includedWaterToys.map((toy, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-neutral-900">·</span>
                    <span>{toy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sound & Audio */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 flex items-center gap-3">
            <Music className="h-5 w-5 text-neutral-900 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-neutral-900 block">Acoustics & Entertainment</span>
              <span className="text-neutral-500 font-light">{yacht.soundSystem}</span>
            </div>
          </div>

          {/* Rates Table */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Standard Rates (4-Hour Charter)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-neutral-400 block">Weekday (Mon-Thu)</span>
                <span className="font-mono font-bold text-neutral-900">{formatSGD(yacht.rates.weekday4h)}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Weekend (Fri-Sun)</span>
                <span className="font-mono font-bold text-neutral-900">{formatSGD(yacht.rates.weekend4h)}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Extra Guest Fee</span>
                <span className="font-mono text-neutral-900">{formatSGD(yacht.rates.extraGuestRate)} / pax</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Extra Hour Extension</span>
                <span className="font-mono text-neutral-900">{formatSGD(yacht.rates.extraHourRate)} / hr</span>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-neutral-400 font-light">
              * Rates in SGD and subject to 9% GST. Zero corkage fee applies for personal food and drinks.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-6 py-4">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Base 4h Charter</span>
            <div className="font-mono text-base font-bold text-neutral-900">
              From {formatSGD(yacht.rates.weekday4h)}
            </div>
          </div>

          <button
            onClick={() => {
              onBookYacht(yacht);
              onClose();
            }}
            className="flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
          >
            <span>Proceed to Reservation</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
