import React from 'react';
import { Anchor, Phone, Mail, MapPin, Compass } from 'lucide-react';

interface FooterProps {
  onOpenConcierge: () => void;
  onOpenRecommend: () => void;
  onSelectSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenConcierge,
  onOpenRecommend,
  onSelectSection,
}) => {
  return (
    <footer id="charter-guide" className="border-t border-neutral-200 bg-white text-neutral-600">
      {/* FAQ & Charter Guide Highlights */}
      <div className="mx-auto max-w-7xl px-6 py-16 border-b border-neutral-200">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Singapore Maritime Guide
          </div>
          <h3 className="mt-2 font-maritime text-2xl font-bold text-neutral-900 uppercase">
            Frequently Asked Charter Questions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5">
            <h4 className="font-semibold text-neutral-900 text-sm mb-2">Can we bring our own alcohol and food?</h4>
            <p className="text-neutral-600 font-light leading-relaxed">
              Yes. The Yacht Club Singapore operates a zero-corkage policy across our entire fleet. You are welcome to bring personal champagne, wines, beers, and party platters. Large cooler boxes with ice are provided complimentary on every charter.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5">
            <h4 className="font-semibold text-neutral-900 text-sm mb-2">What is the inclement weather policy?</h4>
            <p className="text-neutral-600 font-light leading-relaxed">
              Tropical Singapore weather frequently brings passing showers. If persistent heavy rain or thunderstorms are declared unsafe by the Captain, your charter can be delayed up to 1 hour or rescheduled within 6 months at zero fee.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5">
            <h4 className="font-semibold text-neutral-900 text-sm mb-2">Do children and infants count toward headcount?</h4>
            <p className="text-neutral-600 font-light leading-relaxed">
              Under Maritime and Port Authority of Singapore (MPA) safety regulations, every human soul aboard—including toddlers, infants, and hired entertainers—counts as one passenger toward maximum vessel capacity.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1: Wordmark & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-900">
                <Anchor className="h-4 w-4" />
              </div>
              <span className="font-maritime text-base font-bold text-neutral-900 uppercase tracking-wider">
                The Yacht Club
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Singapore's premier private yacht charter specialist. Sailing out of ONE°15 Marina Sentosa Cove and Marina at Keppel Bay to Lazarus Island and the Southern Archipelago.
            </p>
            <div className="text-[11px] text-neutral-500 font-mono">
              UEN: 201628491K · MPA Licensed
            </div>
          </div>

          {/* Col 2: Marinas & Anchorages */}
          <div>
            <h4 className="font-semibold text-neutral-900 text-xs uppercase tracking-wider mb-3">
              Marina Locations
            </h4>
            <ul className="space-y-2 text-xs font-light text-neutral-600">
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-neutral-900 shrink-0 mt-0.5" />
                <span>ONE°15 Marina, 11 Cove Drive, Sentosa Cove, Singapore 098497</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-neutral-900 shrink-0 mt-0.5" />
                <span>Marina at Keppel Bay, 2 Keppel Bay Vista, Singapore 098382</span>
              </li>
              <li className="flex items-start gap-2">
                <Compass className="h-3.5 w-3.5 text-neutral-900 shrink-0 mt-0.5" />
                <span>Primary Anchorage: Eagle Bay, Lazarus Island</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="font-semibold text-neutral-900 text-xs uppercase tracking-wider mb-3">
              Explore Fleet
            </h4>
            <ul className="space-y-2 text-xs font-light text-neutral-600">
              <li>
                <button
                  onClick={() => onSelectSection('fleet')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Twin-Hull Catamarans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('fleet')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Italian Flybridge Motor Yachts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('fleet')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Flagship Superyachts (Up to 50 Pax)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRecommend}
                  className="hover:text-neutral-900 transition-colors cursor-pointer font-medium text-neutral-900"
                >
                  AI Matchmaker Recommender
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Concierge Operations */}
          <div>
            <h4 className="font-semibold text-neutral-900 text-xs uppercase tracking-wider mb-3">
              Concierge Operations
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-neutral-600">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-neutral-900" />
                <span>+65 6834 2911 (Operations Desk)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-neutral-900" />
                <span>charters@theyachtclub.sg</span>
              </li>
              <li>
                <button
                  onClick={onOpenConcierge}
                  className="mt-2 inline-flex items-center gap-2 rounded-lg bg-neutral-100 border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <span>Chat with Concierge Desk</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-neutral-200 pt-8 text-[11px] text-neutral-400 font-light">
          <div>
            © {new Date().getFullYear()} The Yacht Club Singapore. Based on theyachtclub.sg luxury charter standards.
          </div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span>Maritime Safety Insured</span>
            <span aria-hidden="true">·</span>
            <span>MPA Passenger Regulated</span>
            <span aria-hidden="true">·</span>
            <span>Singapore Goods & Services Tax Registered</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
