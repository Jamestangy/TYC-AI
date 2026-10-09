import { Yacht, BookingState, PriceBreakdown } from '../types/yacht';
import { YACHT_ADDONS, TIME_SLOTS } from '../data/yachtData';

export function isWeekendDay(dateString: string): boolean {
  if (!dateString) return false;
  const d = new Date(dateString);
  const day = d.getDay();
  // Friday afternoon/evening, Saturday, Sunday are commonly treated as weekend rates in Singapore charters
  // For standard ISO date, 0 = Sunday, 6 = Saturday, 5 = Friday
  return day === 0 || day === 6 || day === 5;
}

export function calculateCharterPrice(
  yacht: Yacht,
  booking: {
    date: string;
    timeSlot: string;
    guestsCount: number;
    selectedAddOns: { [key: string]: number };
  }
): PriceBreakdown {
  const isWeekend = isWeekendDay(booking.date);
  const slotObj = TIME_SLOTS.find((s) => s.id === booking.timeSlot) || TIME_SLOTS[1];
  const durationHours = slotObj.durationHours;

  // Base 4h rate
  const base4hRate = isWeekend ? yacht.rates.weekend4h : yacht.rates.weekday4h;
  
  // Extra hours if duration > 4h (e.g. 8-hour fullday charter)
  const extraHours = Math.max(0, durationHours - 4);
  const extraHoursCost = extraHours * yacht.rates.extraHourRate;
  const baseCharterRate = base4hRate + extraHoursCost;

  // Extra guests calculation
  const extraGuestsCount = Math.max(0, booking.guestsCount - yacht.baseGuests);
  const extraGuestsCost = extraGuestsCount * yacht.rates.extraGuestRate;

  // Add-ons calculation
  const itemizedAddOns: { name: string; cost: number; qty: number }[] = [];
  let addOnsCost = 0;

  for (const [addOnId, qty] of Object.entries(booking.selectedAddOns)) {
    if (qty > 0) {
      const addOnDef = YACHT_ADDONS.find((a) => a.id === addOnId);
      if (addOnDef) {
        let singleItemTotal = 0;
        if (addOnDef.unit === 'per_person') {
          singleItemTotal = addOnDef.price * booking.guestsCount;
        } else {
          singleItemTotal = addOnDef.price * qty;
        }
        addOnsCost += singleItemTotal;
        itemizedAddOns.push({
          name: addOnDef.name,
          cost: singleItemTotal,
          qty,
        });
      }
    }
  }

  const subtotal = baseCharterRate + extraGuestsCost + addOnsCost;
  // Singapore Goods & Services Tax (GST) is 9%
  const gstAmount = Math.round(subtotal * 0.09);
  const totalSGD = subtotal + gstAmount;

  return {
    baseCharterRate,
    isWeekend,
    durationHours,
    extraGuests: extraGuestsCount,
    extraGuestsCost,
    addOnsCost,
    subtotal,
    gstAmount,
    totalSGD,
    itemizedAddOns,
  };
}

export function formatSGD(amount: number): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
