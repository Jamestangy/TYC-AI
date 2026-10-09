import React, { useState } from 'react';
import { X, Calculator, ArrowRight } from 'lucide-react';
import { FLEET, YACHT_ADDONS } from '../data/yachtData';
import { Yacht } from '../types/yacht';
import { isWeekendDay, formatSGD } from '../utils/pricingCalculator';

interface CalculatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectYachtToBook: (yacht: Yacht) => void;
}

export const CalculatorDrawer: React.FC<CalculatorDrawerProps> = ({
  isOpen,
  onClose,
  onSelectYachtToBook,
}) => {
  if (!isOpen) return null;

  const [selectedYachtId, setSelectedYachtId] = useState<string>(FLEET[0].id);
  const [date, setDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [durationHours, setDurationHours] = useState<number>(4);
  const [guestCount, setGuestCount] = useState<number>(10);
  const [selectedAddOns, setSelectedAddOns] = useState<{ [id: string]: number }>({});

  const yacht = FLEET.find((y) => y.id === selectedYachtId) || FLEET[0];
  const isWeekend = isWeekendDay(date);

  // Calculations
  const base4h = isWeekend ? yacht.rates.weekend4h : yacht.rates.weekday4h;
  const extraHours = Math.max(0, durationHours - 4);
  const extraHoursCost = extraHours * yacht.rates.extraHourRate;
  const baseCharterTotal = base4h + extraHoursCost;

  const extraGuestsCount = Math.max(0, guestCount - yacht.baseGuests);
  const extraGuestsCost = extraGuestsCount * yacht.rates.extraGuestRate;

  let addOnsTotal = 0;
  for (const [id, qty] of Object.entries(selectedAddOns)) {
    if (qty > 0) {
      const def = YACHT_ADDONS.find((a) => a.id === id);
      if (def) {
        const cost = def.unit === 'per_person' ? def.price * guestCount : def.price * qty;
        addOnsTotal += cost;
      }
    }
  }

  const subtotal = baseCharterTotal + extraGuestsCost + addOnsTotal;
  const gstAmount = Math.round(subtotal * 0.09);
  const grandTotal = subtotal + gstAmount;

  const handleToggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => ({
      ...prev,
      [id]: prev[id] ? 0 : 1,
    }));
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-neutral-200 bg-white shadow-2xl text-neutral-900 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-900">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-maritime text-sm font-bold text-neutral-900 uppercase">
              Charter Rate Calculator
            </h3>
            <p className="text-[10px] text-neutral-500 font-light">
              Instant Quotation Engine
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* Vessel Selector */}
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
            Select Vessel
          </label>
          <select
            value={selectedYachtId}
            onChange={(e) => {
              setSelectedYachtId(e.target.value);
              const target = FLEET.find((y) => y.id === e.target.value);
              if (target && guestCount > target.maxGuests) {
                setGuestCount(target.maxGuests);
              }
            }}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white cursor-pointer"
          >
            {FLEET.map((f) => (
              <option key={f.id} value={f.id} className="bg-white text-neutral-900">
                {f.name} ({f.type.replace('_', ' ')}) · Max {f.maxGuests} Guests
              </option>
            ))}
          </select>
        </div>

        {/* Date & Weekend Indicator */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-neutral-900 focus:outline-none"
            />
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400">Day Tier</span>
            <span className="text-xs font-bold text-neutral-900">
              {isWeekend ? 'Weekend / Peak' : 'Weekday Normal'}
            </span>
          </div>
        </div>

        {/* Duration and Guests sliders */}
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Duration (Hours)
              </span>
              <span className="font-mono text-xs font-bold text-neutral-900">
                {durationHours} Hours {durationHours > 4 ? `(+${durationHours - 4}h extra)` : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[4, 5, 6, 8].map((h) => (
                <button
                  key={h}
                  onClick={() => setDurationHours(h)}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    durationHours === h
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {h} Hours
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Guest Count (Max {yacht.maxGuests})
              </span>
              <span className="font-mono text-xs font-bold text-neutral-900">
                {guestCount} Guests
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="h-8 w-8 rounded-lg bg-white border border-neutral-300 text-neutral-900 flex items-center justify-center hover:bg-neutral-100"
              >
                -
              </button>
              <input
                type="range"
                min={1}
                max={yacht.maxGuests}
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                className="flex-1 accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
              />
              <button
                onClick={() => setGuestCount(Math.min(yacht.maxGuests, guestCount + 1))}
                className="h-8 w-8 rounded-lg bg-white border border-neutral-300 text-neutral-900 flex items-center justify-center hover:bg-neutral-100"
              >
                +
              </button>
            </div>
            <div className="text-[10px] text-neutral-500 mt-1 font-light">
              Base rate includes {yacht.baseGuests} guests. Extra guests are {formatSGD(yacht.rates.extraGuestRate)} each.
            </div>
          </div>
        </div>

        {/* Add-ons Quick Toggle */}
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
            Add-ons & Upgrades
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {YACHT_ADDONS.slice(0, 5).map((addon) => {
              const active = !!selectedAddOns[addon.id];
              return (
                <div
                  key={addon.id}
                  onClick={() => handleToggleAddOn(addon.id)}
                  className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-colors ${
                    active
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200 bg-white'
                  }`}
                >
                  <div className="text-xs">
                    <div className="font-semibold text-neutral-900">{addon.name}</div>
                    <div className="text-[10px] text-neutral-500">
                      {addon.unit === 'per_person' ? `${formatSGD(addon.price)} / pax` : `${formatSGD(addon.price)} flat`}
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${active ? 'text-neutral-900' : 'text-neutral-400'}`}>
                    {active ? 'Included' : '+ Add'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calculation Invoice Preview */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 space-y-2 text-xs">
          <div className="text-[11px] font-semibold text-neutral-900 uppercase tracking-wider mb-2">
            Itemized Calculation:
          </div>

          <div className="flex justify-between text-neutral-700">
            <span>Base 4-Hour Rate ({yacht.name})</span>
            <span className="font-mono text-neutral-900 font-medium">{formatSGD(base4h)}</span>
          </div>

          {extraHours > 0 && (
            <div className="flex justify-between text-neutral-700">
              <span>{extraHours} Extra Hours (@ {formatSGD(yacht.rates.extraHourRate)}/h)</span>
              <span className="font-mono text-neutral-900 font-medium">{formatSGD(extraHoursCost)}</span>
            </div>
          )}

          {extraGuestsCount > 0 && (
            <div className="flex justify-between text-neutral-700">
              <span>{extraGuestsCount} Extra Guests beyond base</span>
              <span className="font-mono text-neutral-900 font-medium">{formatSGD(extraGuestsCost)}</span>
            </div>
          )}

          {addOnsTotal > 0 && (
            <div className="flex justify-between text-neutral-700">
              <span>Selected Add-ons</span>
              <span className="font-mono text-neutral-900 font-medium">{formatSGD(addOnsTotal)}</span>
            </div>
          )}

          <div className="flex justify-between text-neutral-500 border-t border-neutral-200 pt-2">
            <span>Subtotal</span>
            <span className="font-mono text-neutral-800">{formatSGD(subtotal)}</span>
          </div>

          <div className="flex justify-between text-neutral-500">
            <span>Singapore 9% GST</span>
            <span className="font-mono text-neutral-800">{formatSGD(gstAmount)}</span>
          </div>

          <div className="flex justify-between text-sm font-bold text-neutral-900 border-t border-neutral-200 pt-2">
            <span className="font-maritime uppercase">Total (SGD)</span>
            <span className="font-mono text-neutral-900 text-base">{formatSGD(grandTotal)}</span>
          </div>
        </div>

        {/* Book Action */}
        <button
          onClick={() => {
            onSelectYachtToBook(yacht);
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-sm cursor-pointer"
        >
          <span>Reserve {yacht.name} at this Rate</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
