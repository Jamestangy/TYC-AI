import React from 'react';
import { Anchor, Sparkles, Compass, Calculator, MessageSquare } from 'lucide-react';

interface NavbarProps {
  onOpenRecommend: () => void;
  onOpenCalculator: () => void;
  onOpenConcierge: () => void;
  onSelectSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRecommend,
  onOpenCalculator,
  onOpenConcierge,
  onSelectSection,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => onSelectSection('hero')}
          className="group flex items-center gap-3 text-left transition-opacity hover:opacity-90 cursor-pointer"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-900">
            <Anchor className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-maritime text-base font-bold tracking-wider text-neutral-900 uppercase">
              The Yacht Club
            </span>
            <span className="text-[10px] tracking-widest text-neutral-500 uppercase font-mono">
              Singapore · ONE°15 Marina
            </span>
          </div>
        </button>

        {/* Zone 2: Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider font-medium text-neutral-600">
          <button
            onClick={() => onSelectSection('fleet')}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Curated Fleet
          </button>
          <button
            onClick={() => onSelectSection('nautical-map')}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="h-3.5 w-3.5 text-neutral-500" />
            <span>Nautical Map</span>
          </button>
          <button
            onClick={onOpenRecommend}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-neutral-900 font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5 text-neutral-700" />
            <span>AI Matchmaker</span>
          </button>
          <button
            onClick={onOpenCalculator}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Calculator className="h-3.5 w-3.5 text-neutral-500" />
            <span>Rate Calculator</span>
          </button>
          <button
            onClick={() => onSelectSection('charter-guide')}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Itineraries & FAQ
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenConcierge}
            className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-neutral-800 cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Charter Concierge</span>
          </button>
        </div>
      </div>
    </header>
  );
};
