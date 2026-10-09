import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FleetCatalog } from './components/FleetCatalog';
import { InteractiveNauticalMap } from './components/InteractiveNauticalMap';
import { YachtDetailModal } from './components/YachtDetailModal';
import { BookingModal } from './components/BookingModal';
import { AiRecommendationModal } from './components/AiRecommendationModal';
import { ConciergeDrawer } from './components/ConciergeDrawer';
import { CalculatorDrawer } from './components/CalculatorDrawer';
import { Footer } from './components/Footer';
import { Yacht, TimeSlotId } from './types/yacht';
import { TESTIMONIALS } from './data/yachtData';
import { MessageSquare, Quote } from 'lucide-react';

export default function App() {
  const getNextSaturday = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = (6 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getNextSaturday());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotId>('afternoon');
  const [guestsCount, setGuestsCount] = useState<number>(10);

  // Modals & Drawers state
  const [detailYacht, setDetailYacht] = useState<Yacht | null>(null);
  const [bookingYacht, setBookingYacht] = useState<Yacht | null>(null);
  const [isRecommendOpen, setIsRecommendOpen] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState<boolean>(false);

  const handleSelectSection = (sectionId: string) => {
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookYachtFromRecommender = (yacht: Yacht, prefillSlot?: TimeSlotId) => {
    if (prefillSlot) {
      setSelectedSlot(prefillSlot);
    }
    setBookingYacht(yacht);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* Navigation Top Bar */}
      <Navbar
        onOpenRecommend={() => setIsRecommendOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onSelectSection={handleSelectSection}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedSlot={selectedSlot}
          onSlotChange={setSelectedSlot}
          guestsCount={guestsCount}
          onGuestsChange={setGuestsCount}
          onSearchFleet={() => handleSelectSection('fleet')}
          onOpenRecommend={() => setIsRecommendOpen(true)}
        />

        {/* Curated Fleet Catalog */}
        <FleetCatalog
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          guestsCount={guestsCount}
          onSelectYacht={(yacht) => setDetailYacht(yacht)}
          onBookYacht={(yacht) => setBookingYacht(yacht)}
        />

        {/* Interactive Nautical Map & Southern Islands Waypoints */}
        <InteractiveNauticalMap
          onSelectYachtToBook={(yacht) => setBookingYacht(yacht)}
        />

        {/* Client Testimonials Section */}
        <section className="mx-auto max-w-7xl px-6 py-20 border-t border-neutral-200 bg-white">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Verified Charter Experiences
            </div>
            <h2 className="mt-2 font-maritime text-3xl font-bold tracking-tight text-neutral-900 uppercase">
              Memories on Singapore Waters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 shadow-xs hover:border-neutral-300 transition-colors"
              >
                <div>
                  <Quote className="h-5 w-5 text-neutral-400 mb-3" />
                  <p className="text-xs text-neutral-600 leading-relaxed font-light italic">
                    "{t.text}"
                  </p>
                </div>

                <div className="mt-6 border-t border-neutral-200/80 pt-4">
                  <div className="font-semibold text-xs text-neutral-900">{t.name}</div>
                  <div className="text-[11px] text-neutral-500 font-light">{t.role}</div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-neutral-700 font-mono">
                    <span>{t.vessel}</span>
                    <span>·</span>
                    <span>{t.occasion}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onOpenRecommend={() => setIsRecommendOpen(true)}
        onSelectSection={handleSelectSection}
      />

      {/* Floating Concierge FAB Button - Minimalist */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsConciergeOpen(true)}
          className="group flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white/95 backdrop-blur-md px-4 py-3 text-xs font-semibold text-neutral-900 shadow-xl transition-all hover:bg-neutral-900 hover:text-white hover:scale-102 cursor-pointer ring-4 ring-neutral-900/5"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 group-hover:bg-neutral-800 group-hover:text-white transition-colors">
            <MessageSquare className="h-3.5 w-3.5" />
          </div>
          <span>Concierge & Live Agent</span>
        </button>
      </div>

      {/* Modals & Drawers */}
      <YachtDetailModal
        yacht={detailYacht}
        isOpen={!!detailYacht}
        onClose={() => setDetailYacht(null)}
        onBookYacht={(yacht) => {
          setDetailYacht(null);
          setBookingYacht(yacht);
        }}
      />

      <BookingModal
        yacht={bookingYacht}
        isOpen={!!bookingYacht}
        onClose={() => setBookingYacht(null)}
        initialDate={selectedDate}
        initialSlot={selectedSlot}
        initialGuests={guestsCount}
      />

      <AiRecommendationModal
        isOpen={isRecommendOpen}
        onClose={() => setIsRecommendOpen(false)}
        onSelectYachtToBook={handleBookYachtFromRecommender}
      />

      <CalculatorDrawer
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onSelectYachtToBook={(yacht) => setBookingYacht(yacht)}
      />

      <ConciergeDrawer
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        onSelectYachtToBook={(yacht) => setBookingYacht(yacht)}
      />
    </div>
  );
}
