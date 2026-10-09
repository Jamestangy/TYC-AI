import React, { useState } from 'react';
import { X, Check, Users, Calendar, Clock, ArrowRight, ArrowLeft, QrCode, CreditCard, ShieldCheck } from 'lucide-react';
import { Yacht, TimeSlotId, BookingState, PriceBreakdown } from '../types/yacht';
import { TIME_SLOTS, YACHT_ADDONS } from '../data/yachtData';
import { calculateCharterPrice, formatSGD } from '../utils/pricingCalculator';

interface BookingModalProps {
  yacht: Yacht | null;
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  initialSlot?: TimeSlotId;
  initialGuests?: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  yacht,
  isOpen,
  onClose,
  initialDate,
  initialSlot,
  initialGuests,
}) => {
  if (!isOpen || !yacht) return null;

  const [step, setStep] = useState<number>(1);
  const [booking, setBooking] = useState<BookingState>({
    yachtId: yacht.id,
    date: initialDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    timeSlot: initialSlot || 'afternoon',
    guestsCount: Math.min(yacht.maxGuests, Math.max(2, initialGuests || yacht.baseGuests)),
    selectedAddOns: {},
    occasion: 'Birthday Celebration',
    chartererName: '',
    chartererEmail: '',
    chartererPhone: '',
    specialRequests: '',
    paymentMethod: 'paynow',
  });

  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');

  const priceBreakdown: PriceBreakdown = calculateCharterPrice(yacht, {
    date: booking.date,
    timeSlot: booking.timeSlot,
    guestsCount: booking.guestsCount,
    selectedAddOns: booking.selectedAddOns,
  });

  const handleAddOnQtyChange = (addOnId: string, delta: number) => {
    const current = booking.selectedAddOns[addOnId] || 0;
    const next = Math.max(0, current + delta);
    setBooking({
      ...booking,
      selectedAddOns: {
        ...booking.selectedAddOns,
        [addOnId]: next,
      },
    });
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = `TYC-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(randomCode);
    setBookingConfirmed(true);
  };

  const selectedSlotObj = TIME_SLOTS.find((s) => s.id === booking.timeSlot) || TIME_SLOTS[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl my-8 text-neutral-900">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={yacht.image}
              alt={yacht.name}
              className="h-10 w-10 rounded-lg object-cover border border-neutral-200"
            />
            <div>
              <div className="font-maritime text-sm font-bold text-neutral-900 uppercase">
                Reserve {yacht.name}
              </div>
              <div className="text-[11px] text-neutral-500 font-light">
                {yacht.homeMarina} · Max {yacht.maxGuests} Guests
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

        {/* Multi-Step Progress Indicator */}
        {!bookingConfirmed && (
          <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/40 px-6 py-3 text-xs">
            <div className={`flex items-center gap-2 font-semibold ${step >= 1 ? 'text-neutral-900' : 'text-neutral-400'}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${step >= 1 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'}`}>1</span>
              <span>Schedule & Guests</span>
            </div>
            <div className={`h-px w-8 ${step >= 2 ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
            <div className={`flex items-center gap-2 font-semibold ${step >= 2 ? 'text-neutral-900' : 'text-neutral-400'}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${step >= 2 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'}`}>2</span>
              <span>Toys & BBQ</span>
            </div>
            <div className={`h-px w-8 ${step >= 3 ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
            <div className={`flex items-center gap-2 font-semibold ${step >= 3 ? 'text-neutral-900' : 'text-neutral-400'}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${step >= 3 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'}`}>3</span>
              <span>Manifest Info</span>
            </div>
            <div className={`h-px w-8 ${step >= 4 ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
            <div className={`flex items-center gap-2 font-semibold ${step >= 4 ? 'text-neutral-900' : 'text-neutral-400'}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${step >= 4 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'}`}>4</span>
              <span>Payment & Review</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          {bookingConfirmed ? (
            /* Confirmation Pass View */
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white">
                <Check className="h-7 w-7" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                  Charter Confirmed & Berthing Reserved
                </span>
                <h3 className="mt-1 font-maritime text-2xl font-bold text-neutral-900 uppercase">
                  Welcome Aboard, {booking.chartererName || 'Guest'}
                </h3>
                <p className="mt-2 text-xs text-neutral-600 max-w-md mx-auto leading-relaxed font-light">
                  Your private charter reservation has been confirmed. Boarding details dispatched to <strong className="text-neutral-900">{booking.chartererEmail || 'your email'}</strong>.
                </p>
              </div>

              {/* Digital Boarding Pass Card */}
              <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 text-left shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <span className="font-maritime text-xs font-bold text-neutral-900 uppercase">The Yacht Club Singapore</span>
                  <span className="font-mono text-xs font-bold text-neutral-900">{bookingRef}</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Vessel</span>
                    <strong className="text-neutral-900 font-medium">{yacht.name}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Departure Berth</span>
                    <strong className="text-neutral-900 font-medium">{yacht.homeMarina}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Date & Slot</span>
                    <strong className="text-neutral-900 font-medium">{booking.date} ({selectedSlotObj.hours})</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Headcount</span>
                    <strong className="text-neutral-900 font-medium">{booking.guestsCount} Guests</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Total (SGD)</span>
                    <strong className="text-neutral-900 font-bold font-mono text-sm">{formatSGD(priceBreakdown.totalSGD)} (incl. GST)</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Payment Method</span>
                    <strong className="text-neutral-800 font-medium uppercase">{booking.paymentMethod}</strong>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-neutral-200 bg-white p-3 text-[11px] text-neutral-600">
                  <strong className="text-neutral-900 block mb-0.5">Boarding Protocol:</strong>
                  Please arrive at ONE°15 Marina Security Gate 15 minutes prior to departure. The Captain will meet you at the lobby with the manifest.
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="rounded-xl bg-neutral-900 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Multi-Step Wizard */
            <div>
              {/* Step 1: Schedule & Guests */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-maritime text-lg font-bold text-neutral-900 uppercase">
                      Select Charter Date & Time Window
                    </h3>
                    <p className="text-xs text-neutral-500 font-light">
                      Weekend dates (Fri-Sun) apply peak charter rates across Singapore marinas.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-neutral-700" />
                        <span>Date of Charter</span>
                      </label>
                      <input
                        type="date"
                        value={booking.date}
                        onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-neutral-700" />
                        <span>Total Guests (Max {yacht.maxGuests})</span>
                      </label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-neutral-900">
                          {booking.guestsCount} Guests
                          {booking.guestsCount > yacht.baseGuests && (
                            <span className="text-xs text-neutral-500 font-normal ml-2">
                              (+{booking.guestsCount - yacht.baseGuests} beyond base)
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setBooking({ ...booking, guestsCount: Math.max(1, booking.guestsCount - 1) })}
                            className="h-8 w-8 rounded-lg border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => setBooking({ ...booking, guestsCount: Math.min(yacht.maxGuests, booking.guestsCount + 1) })}
                            className="h-8 w-8 rounded-lg border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Slots Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Cruising Window
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = booking.timeSlot === slot.id;
                        return (
                          <div
                            key={slot.id}
                            onClick={() => setBooking({ ...booking, timeSlot: slot.id })}
                            className={`rounded-xl border p-4 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-neutral-900 bg-neutral-50 shadow-xs ring-1 ring-neutral-900'
                                : 'border-neutral-200 bg-white hover:border-neutral-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs text-neutral-900 uppercase">{slot.label}</span>
                              <span className="font-mono text-xs font-bold text-neutral-900">{slot.hours}</span>
                            </div>
                            <p className="mt-1.5 text-[11px] text-neutral-500 leading-relaxed font-light">
                              {slot.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Navigation */}
                  <div className="flex items-center justify-between border-t border-neutral-200 pt-5">
                    <div>
                      <span className="text-[11px] text-neutral-400">Current Base Rate:</span>
                      <div className="font-mono text-base font-bold text-neutral-900">
                        {formatSGD(priceBreakdown.baseCharterRate + priceBreakdown.extraGuestsCost)}
                        <span className="text-xs text-neutral-500 font-normal"> (excl. 9% GST)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <span>Proceed to Add-ons</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Curated Add-ons & Catering */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-maritime text-lg font-bold text-neutral-900 uppercase">
                      Curated Water Toys, Catering & Styling
                    </h3>
                    <p className="text-xs text-neutral-500 font-light">
                      Elevate your voyage with chef BBQ grilling, free-flow chilled beers, Seabob scooters, and sunset skyline extensions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                    {YACHT_ADDONS.map((addon) => {
                      const qty = booking.selectedAddOns[addon.id] || 0;
                      const priceLabel =
                        addon.unit === 'per_person'
                          ? `${formatSGD(addon.price)} / pax`
                          : `${formatSGD(addon.price)} flat`;

                      return (
                        <div
                          key={addon.id}
                          className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
                            qty > 0
                              ? 'border-neutral-900 bg-neutral-50'
                              : 'border-neutral-200 bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-xs text-neutral-900">{addon.name}</h4>
                              <span className="font-mono text-xs font-bold text-neutral-900 shrink-0">
                                {priceLabel}
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] text-neutral-500 leading-relaxed font-light">
                              {addon.description}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-2">
                            <span className="text-[11px] text-neutral-400">
                              {addon.unit === 'per_person' ? 'Apply to all guests' : 'Quantity'}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleAddOnQtyChange(addon.id, -1)}
                                className="h-7 w-7 rounded-md border border-neutral-300 bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-100"
                              >
                                -
                              </button>
                              <span className="font-mono text-xs font-bold text-neutral-900 px-1">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAddOnQtyChange(addon.id, 1)}
                                className="h-7 w-7 rounded-md border border-neutral-300 bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-100"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between border-t border-neutral-200 pt-5">
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </button>

                    <div className="text-right">
                      <span className="text-[11px] text-neutral-400">Add-ons Subtotal:</span>
                      <div className="font-mono text-sm font-bold text-neutral-900">
                        {formatSGD(priceBreakdown.addOnsCost)}
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(3)}
                      className="flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <span>Next: Manifest Info</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Charterer Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-maritime text-lg font-bold text-neutral-900 uppercase">
                      Charterer Manifest Details
                    </h3>
                    <p className="text-xs text-neutral-500 font-light">
                      Required for official MPA manifest registration and marina security gate entry.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Full Name (Lead Charterer) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. James Tan"
                        value={booking.chartererName}
                        onChange={(e) => setBooking({ ...booking, chartererName: e.target.value })}
                        required
                        className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Contact Mobile / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        placeholder="+65 9123 4567"
                        value={booking.chartererPhone}
                        onChange={(e) => setBooking({ ...booking, chartererPhone: e.target.value })}
                        required
                        className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Email Address (For Confirmation & Pass) *
                      </label>
                      <input
                        type="email"
                        placeholder="james.tan@example.sg"
                        value={booking.chartererEmail}
                        onChange={(e) => setBooking({ ...booking, chartererEmail: e.target.value })}
                        required
                        className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Charter Occasion
                      </label>
                      <select
                        value={booking.occasion}
                        onChange={(e) => setBooking({ ...booking, occasion: e.target.value })}
                        className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none cursor-pointer"
                      >
                        <option value="Birthday Celebration">Birthday Celebration</option>
                        <option value="Romantic Proposal / Anniversary">Romantic Proposal / Anniversary</option>
                        <option value="Corporate Client Networking">Corporate Client Networking</option>
                        <option value="Family Day Out">Family Day Out</option>
                        <option value="Bachelor / Bachelorette Party">Bachelor / Bachelorette Party</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Special Requests / Dietary / Music Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Please chill our white wine upon arrival; celebrate birthday with cake delivery."
                      value={booking.specialRequests}
                      onChange={(e) => setBooking({ ...booking, specialRequests: e.target.value })}
                      className="w-full bg-transparent text-xs text-neutral-800 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between border-t border-neutral-200 pt-5">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </button>

                    <button
                      onClick={() => setStep(4)}
                      disabled={!booking.chartererName || !booking.chartererEmail}
                      className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                        !booking.chartererName || !booking.chartererEmail
                          ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                          : 'bg-neutral-900 text-white hover:bg-neutral-800'
                      }`}
                    >
                      <span>Review Quotation</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Review Itemized Price & Secure Payment */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-maritime text-lg font-bold text-neutral-900 uppercase">
                      Transparent Price Breakdown & Confirmation
                    </h3>
                    <p className="text-xs text-neutral-500 font-light">
                      Official quotation under Singapore Maritime Regulations with itemized 9% GST.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 space-y-3">
                    <div className="flex justify-between text-xs text-neutral-700 border-b border-neutral-200 pb-2">
                      <span>
                        Base 4h Charter ({yacht.name} · {priceBreakdown.isWeekend ? 'Weekend' : 'Weekday'})
                      </span>
                      <span className="font-mono font-medium text-neutral-900">
                        {formatSGD(priceBreakdown.baseCharterRate)}
                      </span>
                    </div>

                    {priceBreakdown.extraGuests > 0 && (
                      <div className="flex justify-between text-xs text-neutral-700 border-b border-neutral-200 pb-2">
                        <span>
                          {priceBreakdown.extraGuests} Extra Guests beyond base inclusion (@ {formatSGD(yacht.rates.extraGuestRate)}/pax)
                        </span>
                        <span className="font-mono font-medium text-neutral-900">
                          {formatSGD(priceBreakdown.extraGuestsCost)}
                        </span>
                      </div>
                    )}

                    {priceBreakdown.itemizedAddOns.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-neutral-700 border-b border-neutral-200 pb-2">
                        <span>{item.name} {item.qty > 1 ? `(x${item.qty})` : ''}</span>
                        <span className="font-mono font-medium text-neutral-900">
                          {formatSGD(item.cost)}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between text-xs text-neutral-500 pt-1">
                      <span>Subtotal (Before Tax)</span>
                      <span className="font-mono text-neutral-800">{formatSGD(priceBreakdown.subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Singapore Goods & Services Tax (GST 9%)</span>
                      <span className="font-mono text-neutral-800">{formatSGD(priceBreakdown.gstAmount)}</span>
                    </div>

                    <div className="flex justify-between text-base font-bold text-neutral-900 border-t border-neutral-200 pt-3">
                      <span className="font-maritime uppercase">Total Amount Payable (SGD)</span>
                      <span className="font-mono text-neutral-900 text-lg">{formatSGD(priceBreakdown.totalSGD)}</span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Select Payment Guarantee
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div
                        onClick={() => setBooking({ ...booking, paymentMethod: 'paynow' })}
                        className={`rounded-xl border p-3.5 cursor-pointer flex items-center gap-3 transition-colors ${
                          booking.paymentMethod === 'paynow'
                            ? 'border-neutral-900 bg-neutral-50'
                            : 'border-neutral-200 bg-white'
                        }`}
                      >
                        <QrCode className="h-5 w-5 text-neutral-900 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-neutral-900">PayNow (UEN / QR)</div>
                          <div className="text-[10px] text-neutral-500">Instant SG clearing</div>
                        </div>
                      </div>

                      <div
                        onClick={() => setBooking({ ...booking, paymentMethod: 'credit_card' })}
                        className={`rounded-xl border p-3.5 cursor-pointer flex items-center gap-3 transition-colors ${
                          booking.paymentMethod === 'credit_card'
                            ? 'border-neutral-900 bg-neutral-50'
                            : 'border-neutral-200 bg-white'
                        }`}
                      >
                        <CreditCard className="h-5 w-5 text-neutral-900 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-neutral-900">Credit Card</div>
                          <div className="text-[10px] text-neutral-500">Visa, Mastercard, Amex</div>
                        </div>
                      </div>

                      <div
                        onClick={() => setBooking({ ...booking, paymentMethod: 'bank_transfer' })}
                        className={`rounded-xl border p-3.5 cursor-pointer flex items-center gap-3 transition-colors ${
                          booking.paymentMethod === 'bank_transfer'
                            ? 'border-neutral-900 bg-neutral-50'
                            : 'border-neutral-200 bg-white'
                        }`}
                      >
                        <ShieldCheck className="h-5 w-5 text-neutral-900 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-neutral-900">Corporate Wire</div>
                          <div className="text-[10px] text-neutral-500">DBS / OCBC Invoicing</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between border-t border-neutral-200 pt-5">
                    <button
                      onClick={() => setStep(3)}
                      className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </button>

                    <button
                      onClick={handleConfirmBooking}
                      className="flex items-center gap-2 rounded-xl bg-neutral-900 px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-sm transition-all cursor-pointer"
                    >
                      <span>Secure Charter Booking ({formatSGD(priceBreakdown.totalSGD)})</span>
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
