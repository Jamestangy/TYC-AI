import React, { useState } from 'react';
import { Compass, MapPin, Navigation, Anchor, Wind, Waves, Sun } from 'lucide-react';
import { NAUTICAL_WAYPOINTS, FLEET } from '../data/yachtData';
import { NauticalWaypoint, Yacht } from '../types/yacht';

interface InteractiveNauticalMapProps {
  onSelectYachtToBook?: (yacht: Yacht) => void;
}

export const InteractiveNauticalMap: React.FC<InteractiveNauticalMapProps> = ({
  onSelectYachtToBook,
}) => {
  const [selectedWaypoint, setSelectedWaypoint] = useState<NauticalWaypoint>(NAUTICAL_WAYPOINTS[2]); // Default to Lazarus Island
  const [simulatedRoute, setSimulatedRoute] = useState<string>('lazarus-island');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleSelectWaypoint = (wp: NauticalWaypoint) => {
    setSelectedWaypoint(wp);
    setSimulatedRoute(wp.id);
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 800);
  };

  const relatedYachts = FLEET.filter((y) => {
    if (selectedWaypoint.id === 'keppel-bay') return y.homeMarina.includes('Keppel');
    if (selectedWaypoint.id === 'sentosa-cove') return y.homeMarina.includes('Sentosa');
    return true;
  }).slice(0, 2);

  return (
    <section id="nautical-map" className="mx-auto max-w-7xl px-6 py-20 border-t border-neutral-200 bg-white">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-neutral-200 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 tracking-wider uppercase">
            <span>Maritime Navigation</span>
            <span aria-hidden="true">·</span>
            <span>Live Itineraries & Anchorages</span>
          </div>
          <h2 className="mt-2 font-maritime text-3xl font-bold tracking-tight text-neutral-900 uppercase">
            Singapore Southern Waters Chart
          </h2>
          <p className="mt-2 text-sm text-neutral-600 max-w-2xl font-light">
            Explore premier cruising grounds from ONE°15 Marina Sentosa Cove to the tranquil anchorages of Lazarus Island and the Marina Bay city skyline.
          </p>
        </div>

        {/* Live Marine Telemetry Badge */}
        <div className="flex flex-wrap items-center gap-4 text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3">
          <div className="flex items-center gap-2 text-neutral-700">
            <Wind className="h-4 w-4 text-neutral-900" />
            <span>Wind: <strong className="font-mono text-neutral-900">11 kts ENE</strong></span>
          </div>
          <div className="h-3 w-px bg-neutral-300" />
          <div className="flex items-center gap-2 text-neutral-700">
            <Waves className="h-4 w-4 text-neutral-900" />
            <span>Sea: <strong className="font-mono text-neutral-900">Calm (0.3m)</strong></span>
          </div>
          <div className="h-3 w-px bg-neutral-300" />
          <div className="flex items-center gap-2 text-neutral-700">
            <Sun className="h-4 w-4 text-neutral-900" />
            <span>Sunset: <strong className="font-mono text-neutral-900">19:12 SGT</strong></span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Chart Canvas Container */}
        <div className="lg:col-span-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 shadow-md relative">
          {/* Chart Header Bar */}
          <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900 px-4 py-3 text-xs">
            <div className="flex items-center gap-2 text-neutral-200">
              <Compass className="h-4 w-4 text-neutral-400" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">Chart: Singapore Southern Archipelago (WGS84)</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-400">
              <span className="hidden sm:inline font-mono text-[11px]">1°14'N 103°50'E</span>
              <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-semibold text-neutral-300 border border-neutral-700">
                Live Vessel Feeds
              </span>
            </div>
          </div>

          {/* Interactive SVG Nautical Chart */}
          <div className="relative aspect-[16/10] w-full bg-[#050e1a] select-none overflow-hidden">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 1000 625"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="nautical-grid-min" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#0e1f36" strokeWidth="0.8" />
                </pattern>
                <linearGradient id="routeGradientMin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              <rect width="1000" height="625" fill="#040b14" />
              <rect width="1000" height="625" fill="url(#nautical-grid-min)" />

              {/* Bathymetric Depth Contours */}
              <ellipse cx="680" cy="450" rx="220" ry="120" stroke="#0a2544" strokeWidth="1.2" strokeDasharray="4 4" />
              <ellipse cx="680" cy="450" rx="160" ry="85" stroke="#10325a" strokeWidth="1.2" />
              <ellipse cx="500" cy="220" rx="380" ry="140" stroke="#0a2544" strokeWidth="1.2" strokeDasharray="6 6" />

              {/* Singapore Mainland Coastline */}
              <path
                d="M 0 160 Q 200 130 350 150 T 550 120 T 750 90 T 1000 110 L 1000 0 L 0 0 Z"
                fill="#0d1f33"
                stroke="#1e3b61"
                strokeWidth="1.5"
              />

              {/* Keppel Harbour Area */}
              <path
                d="M 320 155 Q 380 145 420 165 Q 400 185 340 180 Z"
                fill="#13273e"
                stroke="#2a4d7a"
                strokeWidth="1.5"
              />

              {/* Sentosa Island Landmass */}
              <path
                d="M 440 190 C 500 175 580 185 640 230 C 650 260 610 280 540 270 C 470 260 430 220 440 190 Z"
                fill="#152b45"
                stroke="#2d5385"
                strokeWidth="1.5"
              />
              <text x="510" y="235" fill="#94a3b8" fontSize="12" fontWeight="600" letterSpacing="2">
                SENTOSA ISLAND
              </text>

              {/* St. John's Island */}
              <path
                d="M 580 405 C 610 395 645 410 650 440 C 640 460 600 465 585 445 Z"
                fill="#152b45"
                stroke="#2d5385"
                strokeWidth="1.5"
              />
              <text x="575" y="465" fill="#94a3b8" fontSize="11" letterSpacing="1">
                ST. JOHN'S
              </text>

              {/* Lazarus Island */}
              <path
                d="M 645 415 C 680 390 735 415 725 460 C 700 480 660 465 645 425 Z"
                fill="#152b45"
                stroke="#2d5385"
                strokeWidth="1.5"
              />
              <text x="670" y="435" fill="#f8fafc" fontSize="11" fontWeight="700" letterSpacing="1">
                LAZARUS (EAGLE BAY)
              </text>

              {/* Causeway footbridge connecting St. John's & Lazarus */}
              <line x1="640" y1="430" x2="655" y2="425" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="2 2" />

              {/* Sisters' Islands */}
              <circle cx="480" cy="475" r="14" fill="#152b45" stroke="#2d5385" strokeWidth="1.5" />
              <circle cx="510" cy="490" r="10" fill="#152b45" stroke="#2d5385" strokeWidth="1.5" />
              <text x="445" y="520" fill="#94a3b8" fontSize="10" letterSpacing="1">
                SISTERS' ISLANDS
              </text>

              {/* Kusu Island */}
              <circle cx="780" cy="410" r="16" fill="#152b45" stroke="#2d5385" strokeWidth="1.5" />
              <text x="765" y="445" fill="#94a3b8" fontSize="10" letterSpacing="1">
                KUSU IS.
              </text>

              {/* Marina Bay Skyline Waters */}
              <path
                d="M 720 100 C 760 90 820 95 850 140 C 820 160 760 145 720 115 Z"
                fill="#122339"
                stroke="#2b4f7d"
                strokeWidth="1.5"
              />
              <text x="740" y="130" fill="#e2e8f0" fontSize="10" fontWeight="600" letterSpacing="1">
                MARINA BAY WATERS
              </text>

              {/* Routes */}
              <path
                d="M 590 250 C 610 290 640 350 675 425"
                fill="none"
                stroke="url(#routeGradientMin)"
                strokeWidth={simulatedRoute === 'lazarus-island' ? "3" : "1.2"}
                strokeDasharray={simulatedRoute === 'lazarus-island' ? "6 4" : "3 3"}
                className={simulatedRoute === 'lazarus-island' ? "animate-pulse" : "opacity-40"}
              />

              <path
                d="M 590 250 C 630 220 690 180 755 125"
                fill="none"
                stroke="url(#routeGradientMin)"
                strokeWidth={simulatedRoute === 'marina-bay-skyline' ? "3" : "1.2"}
                strokeDasharray={simulatedRoute === 'marina-bay-skyline' ? "6 4" : "3 3"}
                className={simulatedRoute === 'marina-bay-skyline' ? "animate-pulse" : "opacity-40"}
              />

              {/* Compass Rose */}
              <g transform="translate(100, 260) scale(0.7)" opacity="0.5">
                <circle cx="0" cy="0" r="45" stroke="#334155" strokeWidth="1" fill="none" />
                <polygon points="0,-45 8,-12 0,0" fill="#ffffff" />
                <polygon points="0,-45 -8,-12 0,0" fill="#64748b" />
                <polygon points="0,45 8,12 0,0" fill="#94a3b8" />
                <polygon points="0,45 -8,12 0,0" fill="#475569" />
                <text x="-4" y="-50" fill="#ffffff" fontSize="12" fontWeight="bold">N</text>
              </g>

              {/* Active Fleet Position Markers on Chart */}
              <g transform="translate(680, 420)">
                <circle cx="0" cy="0" r="14" fill="#ffffff" fillOpacity="0.2" className="animate-ping" />
                <circle cx="0" cy="0" r="6" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                <text x="10" y="4" fill="#ffffff" fontSize="10" fontWeight="600">Lagoon 400 S2</text>
              </g>

              <g transform="translate(585, 245)">
                <circle cx="0" cy="0" r="5" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                <text x="10" y="4" fill="#ffffff" fontSize="10" fontWeight="600">Majesty 88</text>
              </g>
            </svg>

            {/* Clickable Waypoints */}
            {NAUTICAL_WAYPOINTS.map((wp) => {
              const isSelected = selectedWaypoint.id === wp.id;
              return (
                <button
                  key={wp.id}
                  onClick={() => handleSelectWaypoint(wp)}
                  style={{ left: `${wp.coordinates.x}%`, top: `${wp.coordinates.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 flex items-center justify-center p-2 cursor-pointer transition-all ${
                    isSelected ? 'scale-115' : 'hover:scale-110'
                  }`}
                  title={wp.name}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border shadow-md transition-colors ${
                      isSelected
                        ? 'border-white bg-white text-neutral-900 ring-4 ring-white/20'
                        : 'border-neutral-400 bg-neutral-900/90 text-white'
                    }`}
                  >
                    {wp.category === 'marina' ? (
                      <Anchor className="h-3.5 w-3.5" />
                    ) : (
                      <MapPin className="h-3.5 w-3.5" />
                    )}
                  </div>

                  <div
                    className={`absolute top-full mt-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide transition-opacity border ${
                      isSelected
                        ? 'bg-white text-neutral-900 border-neutral-300 shadow-sm'
                        : 'bg-neutral-900/90 text-neutral-200 border-neutral-700 opacity-90 group-hover:opacity-100'
                    }`}
                  >
                    {wp.name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Route Strip */}
          <div className="flex flex-wrap items-center gap-2 border-t border-neutral-800 bg-neutral-900 px-4 py-3 text-xs">
            <span className="text-neutral-400 font-medium">Standard Routes:</span>
            <button
              onClick={() => handleSelectWaypoint(NAUTICAL_WAYPOINTS[2])}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                selectedWaypoint.id === 'lazarus-island'
                  ? 'bg-white text-neutral-900'
                  : 'bg-neutral-800 text-neutral-300 hover:text-white'
              }`}
            >
              Sentosa → Lazarus Island (25 mins)
            </button>
            <button
              onClick={() => handleSelectWaypoint(NAUTICAL_WAYPOINTS[6])}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                selectedWaypoint.id === 'marina-bay-skyline'
                  ? 'bg-white text-neutral-900'
                  : 'bg-neutral-800 text-neutral-300 hover:text-white'
              }`}
            >
              Sentosa → Marina Bay Skyline (45 mins)
            </button>
          </div>
        </div>

        {/* Selected Waypoint Information Panel - Minimalist */}
        <div className="lg:col-span-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              <Navigation className="h-3.5 w-3.5 text-neutral-900" />
              <span>Waypoint Profile</span>
            </div>
            <span className="font-mono text-xs text-neutral-400">
              {selectedWaypoint.realCoord.lat.toFixed(4)}°N, {selectedWaypoint.realCoord.lng.toFixed(4)}°E
            </span>
          </div>

          <h3 className="mt-4 font-maritime text-2xl font-bold text-neutral-900 uppercase">
            {selectedWaypoint.name}
          </h3>

          <div className="mt-1 text-xs font-medium text-neutral-600">
            {selectedWaypoint.recommendedFor}
          </div>

          <p className="mt-4 text-xs text-neutral-600 leading-relaxed font-light">
            {selectedWaypoint.description}
          </p>

          <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">
              Captain's Log Highlight:
            </div>
            <p className="mt-1 text-xs text-neutral-600 leading-relaxed font-light">
              {selectedWaypoint.highlight}
            </p>
          </div>

          {/* Recommended Vessels for this location */}
          <div className="mt-6 border-t border-neutral-200 pt-5">
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Vessels Frequently Berthing Here:
            </div>
            <div className="space-y-2.5">
              {relatedYachts.map((yacht) => (
                <div
                  key={yacht.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50/60 p-3 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={yacht.image}
                      alt={yacht.name}
                      className="h-10 w-10 rounded-lg object-cover border border-neutral-200"
                    />
                    <div>
                      <div className="font-maritime text-xs font-bold text-neutral-900 uppercase">
                        {yacht.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        Up to {yacht.maxGuests} guests
                      </div>
                    </div>
                  </div>
                  {onSelectYachtToBook && (
                    <button
                      onClick={() => onSelectYachtToBook(yacht)}
                      className="rounded-lg bg-neutral-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Book
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
