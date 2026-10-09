import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const FLEET_CONTEXT = `
Curated Fleet at The Yacht Club Singapore:
1. "Lagoon 400 S2" (Catamaran, 40ft, Max 18 guests, Base 10 pax included):
   - Rates: S$1,150 (Weekday 4h), S$1,450 (Weekend 4h), S$55/extra guest.
   - Home Marina: ONE°15 Marina Sentosa Cove.
   - Highlights: Twin-hull high stability (no sea-sickness), front trampoline sunbed, BBQ grill, 2 kayaks, 1 paddleboard, giant water mat included. Air-conditioned saloon.
   - Best for: Family days out, birthday celebrations, casual water sports.

2. "Azimut 55 Flybridge" (Motor Yacht, 55ft, Max 20 guests, Base 12 pax included):
   - Rates: S$1,850 (Weekday 4h), S$2,350 (Weekend 4h), S$75/extra guest.
   - Home Marina: Marina at Keppel Bay.
   - Highlights: Italian designer luxury, expansive flybridge with wet bar & 360° views, submersible swim platform, Bose surround sound, espresso bar.
   - Best for: Romantic sunset proposals, corporate VIP client hosting, executive networking.

3. "Sunreef 62 Grand Luxe" (Luxury Catamaran, 62ft, Max 35 guests, Base 20 pax included):
   - Rates: S$2,450 (Weekday 4h), S$3,100 (Weekend 4h), S$80/extra guest.
   - Home Marina: ONE°15 Marina Sentosa Cove.
   - Highlights: Massive 9.5m beam, full teak deck, huge flybridge, karaoke system with wireless mics, 2 paddleboards, 1 clear kayak, floating sea island.
   - Best for: Large milestone birthday parties, corporate team sails, bachelor/bachelorette gatherings.

4. "Majesty 88 Flagship Superyacht" (Superyacht, 88ft, Max 50 guests, Base 30 pax included):
   - Rates: S$4,950 (Weekday 4h), S$5,950 (Weekend 4h), S$110/extra guest.
   - Home Marina: ONE°15 Marina Sentosa Cove.
   - Highlights: Upper flybridge heated Jacuzzi, formal dining salon for 12, 4 luxury en-suite staterooms, included Sea-Doo Jet Ski & Seabob F5S, Starlink maritime Wi-Fi, 4 professional crew members.
   - Best for: High net worth private celebrations, brand launches, luxury yacht solemnisations & weddings.

5. "Aquila 44 Power Catamaran" (Power Catamaran, 44ft, Max 22 guests, Base 12 pax included):
   - Rates: S$1,450 (Weekday 4h), S$1,850 (Weekend 4h), S$60/extra guest.
   - Home Marina: Marina at Keppel Bay.
   - Highlights: Direct bridge-to-bow staircase (elderly & child safe), shaded aft dining, high fuel efficiency, panoramic glass salon.
   - Best for: Family reunions, sunset dinner cruises, multi-generational groups.

6. "Beneteau Oceanis 51.1" (Sailing Yacht, 51ft, Max 14 guests, Base 8 pax included):
   - Rates: S$1,250 (Weekday 4h), S$1,600 (Weekend 4h), S$55/extra guest.
   - Home Marina: ONE°15 Marina Sentosa Cove.
   - Highlights: Authentic monohull sailing, cockpit sunshade bimini, retractable swim platform, serene silent cruising under wind power.
   - Best for: Sailing enthusiasts, romantic dates, intimate anniversary cruises.

Anchorages & Itinerary:
- Lazarus Island (Eagle Bay): Sheltered calm turquoise bay, white sandy beach, prime anchorage for swimming, water toys, and BBQ grilling.
- St. John's Island: Connected to Lazarus via causeway footbridge, rich tropical nature trails.
- Sisters' Islands Marine Park: Coral reefs, scenic navigation route.
- Marina Bay Sands Skyline Route: Evening twilight cruise past Marina South Pier with illuminated views of Marina Bay Sands, Singapore Flyer, and Singapore financial skyline.
- Marinas: ONE°15 Marina Club (Sentosa Cove) and Marina at Keppel Bay.
- Singapore Goods & Services Tax (GST) is 9%.
- Maritime and Port Authority of Singapore (MPA) rules strictly mandate that every person aboard (including toddlers and infants) counts as one passenger towards maximum vessel capacity.
`;

// AI Concierge Chat Route
app.post('/api/concierge', async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // If Gemini client is available, call Gemini 3.8 Flash
  if (ai) {
    try {
      const systemInstruction = `You are Captain Louis, Chief Maritime Concierge at The Yacht Club Singapore (theyachtclub.sg).
You speak with authentic maritime warmth, refined luxury sophistication, and deep expertise on Singapore waters.
Address the client with polite, professional elegance.
Answer questions accurately based on our fleet details, charter timings, catering, and anchorages.
${FLEET_CONTEXT}

Key guidelines:
- If asked for recommendations, suggest specific vessels by exact name (e.g., Lagoon 400 S2, Sunreef 62, Azimut 55, Majesty 88).
- Explain standard inclusions (captain, crew, fuel, water toys, ice).
- Mention that BYO food and beverages are welcome with ZERO corkage fee on most vessels, or we offer private BBQ grilling service and beverage packages.
- Always provide pricing estimates in SGD with 9% Singapore GST clearly noted.
- Keep responses informative, structured with concise bullet points where helpful, and under 220 words so clients can read quickly.`;

      // Build context from history if provided
      let promptContents = message;
      if (Array.isArray(history) && history.length > 0) {
        const recentHistory = history.slice(-6).map((h: any) => `${h.sender === 'user' ? 'Client' : 'Captain Louis'}: ${h.text}`).join('\n');
        promptContents = `Conversation so far:\n${recentHistory}\nClient: ${message}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'Ahoy! I am at your service to curate your luxury yacht charter in Singapore.';
      
      // Check if any yacht was explicitly recommended to attach a quick link
      let suggestedYachtId: string | undefined;
      const lowerReply = replyText.toLowerCase();
      if (lowerReply.includes('lagoon 400')) suggestedYachtId = 'lagoon-400-s2';
      else if (lowerReply.includes('azimut 55')) suggestedYachtId = 'azimut-55-flybridge';
      else if (lowerReply.includes('sunreef 62')) suggestedYachtId = 'sunreef-62-luxury';
      else if (lowerReply.includes('majesty 88')) suggestedYachtId = 'majesty-88-superyacht';
      else if (lowerReply.includes('aquila 44')) suggestedYachtId = 'aquila-44-power-cat';
      else if (lowerReply.includes('oceanis 51')) suggestedYachtId = 'oceanis-51-sailing';

      return res.json({
        reply: replyText,
        suggestedYachtId,
        source: 'gemini',
      });
    } catch (err) {
      console.error('Gemini Concierge API error:', err);
      // Fall through to fallback handler below
    }
  }

  // Graceful rule-based luxury concierge fallback
  const query = message.toLowerCase();
  let reply = '';
  let suggestedYachtId: string | undefined;

  if (query.includes('bbq') || query.includes('food') || query.includes('catering') || query.includes('drink')) {
    reply = `Welcome aboard! At The Yacht Club Singapore, you are welcome to bring your own food and wine with **zero corkage fees** on all our vessels. We provide large cooler boxes with ice and microwave facilities.\n\nAlternatively, our crew can set up the marine gas grill and cook your skewers for a flat fee of **S$120**, or you can select our **Gourmet Singapore BBQ Platter (S$48/pax)** featuring fresh jumbo tiger prawns, Angus ribeye, and chicken satay!`;
    suggestedYachtId = 'lagoon-400-s2';
  } else if (query.includes('proposal') || query.includes('romantic') || query.includes('anniversary') || query.includes('couple')) {
    reply = `For an unforgettable romantic celebration or sunset proposal, I warmly recommend the **Azimut 55 Flybridge**. Her Italian leather salon and upper flybridge cocktail deck offer unmatched intimacy. We can arrange our VIP Romance Package with chilled Veuve Clicquot champagne, fresh floral canopy, and a golden hour cruise past Lazarus Island into the Marina Bay Sands skyline.`;
    suggestedYachtId = 'azimut-55-flybridge';
  } else if (query.includes('capacity') || query.includes('large') || query.includes('corporate') || query.includes('30') || query.includes('40') || query.includes('50')) {
    reply = `For larger groups: our **Sunreef 62 Grand Luxe** hosts up to 35 guests with a massive 9.5m beam and karaoke system (from S$2,450 for 4 hours), while our flagship **Majesty 88 Superyacht** accommodates up to 50 guests with an upper deck heated Jacuzzi and 4 crew members (from S$4,950). Under Singapore Maritime Authority regulations, every passenger including children counts towards the total headcount.`;
    suggestedYachtId = 'sunreef-62-luxury';
  } else if (query.includes('route') || query.includes('lazarus') || query.includes('itinerary') || query.includes('where')) {
    reply = `Our classic 4-hour charter departs from ONE°15 Marina Sentosa Cove, cruising smoothly across the Singapore Strait to anchor in the sheltered turquoise waters of **Lazarus Island (Eagle Bay)**. Here guests enjoy swimming, floating water mats, and paddleboarding. For sunset charters, we cruise past the illuminated skyline of **Marina Bay Sands** before returning.`;
    suggestedYachtId = 'lagoon-400-s2';
  } else if (query.includes('price') || query.includes('cost') || query.includes('rate') || query.includes('cheap')) {
    reply = `Our 4-hour yacht charter rates start from **S$1,150 on weekdays** and **S$1,450 on weekends** for the Lagoon 400 S2 Catamaran (up to 10 guests included, additional guests S$55/pax). All charters include captain, crew, fuel, water toys, and ice. Rates are subject to 9% Singapore GST. You can use our real-time calculator on this page for an instant itemized breakdown!`;
    suggestedYachtId = 'lagoon-400-s2';
  } else {
    reply = `Greetings from The Yacht Club Singapore! I am Captain Louis. We offer a curated fleet of sailing catamarans, Italian motor yachts, and luxury superyachts berthed at ONE°15 Marina Sentosa Cove and Marina at Keppel Bay.\n\nWhether you are planning a relaxed family swim at Lazarus Island, a corporate sunset cocktail soiree, or a romantic proposal, I can assist you with availability, yacht matching, and bespoke catering. How may I assist your voyage today?`;
  }

  return res.json({
    reply,
    suggestedYachtId,
    source: 'concierge-knowledge-engine',
  });
});

// AI Recommendation Endpoint
app.post('/api/ai-recommend', async (req: Request, res: Response) => {
  const { occasion, guestCount, budgetAmount, budgetRange, priority } = req.body;

  const count = parseInt(guestCount || '10', 10);
  const budget = budgetAmount ? parseInt(budgetAmount, 10) : (budgetRange === 'ultra_luxury' ? 5500 : budgetRange === 'premium' ? 2500 : 1400);

  if (ai) {
    try {
      const prompt = `Act as an expert luxury yacht charter matchmaker for The Yacht Club Singapore.
Recommend the ideal vessel and charter plan based on these user requirements:
- Occasion: ${occasion} (options: party, romantic, family, corporate, fishing)
- Guest Count: ${count} people
- Exact Budget: S$${budget} SGD
- Priority: ${priority} (options: water_sports, relaxation, fine_dining, skyline_views)

Available Fleet:
- lagoon-400-s2: Lagoon 400 S2 Catamaran (Max 18 pax, budget friendly, stable, water mat, kayaks, S$1,150-S$1,450)
- azimut-55-flybridge: Azimut 55 Flybridge Motor Yacht (Max 20 pax, luxury Italian, romantic, sleek, S$1,850-S$2,350)
- sunreef-62-luxury: Sunreef 62 Grand Luxe Catamaran (Max 35 pax, huge deck, karaoke, party, corporate, S$2,450-S$3,100)
- majesty-88-superyacht: Majesty 88 Superyacht (Max 50 pax, ultra-luxury, Jacuzzi, jet ski, VIP, S$4,950-S$5,950)
- aquila-44-power-cat: Aquila 44 Power Catamaran (Max 22 pax, very stable, family safe, S$1,450-S$1,850)
- oceanis-51-sailing: Beneteau Oceanis 51.1 (Max 14 pax, sailing romance, quiet, S$1,250-S$1,600)

Return a JSON response with:
{
  "primaryYachtId": "yacht id from list above",
  "alternativeYachtId": "alternative yacht id",
  "matchScore": 96,
  "reasoning": "2-3 sentences explaining why this vessel perfectly matches their headcount, occasion, budget of S$${budget}, and priority.",
  "suggestedSlot": "afternoon" or "sunset" or "morning",
  "suggestedItinerary": "Brief 1-2 sentence route description",
  "recommendedToys": ["toy 1", "toy 2"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        ...parsed,
        source: 'gemini',
      });
    } catch (err) {
      console.error('Gemini Recommendation API error:', err);
    }
  }

  // Fallback matching logic
  let primaryYachtId = 'lagoon-400-s2';
  let altYachtId = 'aquila-44-power-cat';
  let matchScore = 94;
  let reasoning = `The Lagoon 400 S2 offers the optimal balance of twin-hull stability and water toys within your S$${budget} budget.`;
  let suggestedSlot = 'afternoon';
  let suggestedItinerary = 'Depart ONE°15 Marina Sentosa Cove to Eagle Bay, Lazarus Island for swimming and water sports, returning along Sentosa coast.';
  const recommendedToys = ['Floating Water Mat', 'Stand-Up Paddleboards'];

  if (count > 25 || budget >= 4500) {
    if (count > 35 || budget >= 5000) {
      primaryYachtId = 'majesty-88-superyacht';
      altYachtId = 'sunreef-62-luxury';
      matchScore = 98;
      reasoning = `With ${count} guests and an S$${budget} budget, the 88ft Majesty Superyacht provides presidential entertainment spaces, flybridge Jacuzzi, and white-glove crew service.`;
      suggestedSlot = 'sunset';
      suggestedItinerary = 'ONE°15 Marina departure, cruising to Lazarus Island for cocktails, followed by twilight city skyline cruise of Marina Bay Sands.';
      recommendedToys.push('Seabob F5S', 'Jet Ski');
    } else {
      primaryYachtId = 'sunreef-62-luxury';
      altYachtId = 'majesty-88-superyacht';
      matchScore = 96;
      reasoning = `The Sunreef 62 features an unmatched 9.5-metre beam and expansive flybridge, perfectly matching your S$${budget} budget for ${count} guests with built-in karaoke and party dining.`;
      suggestedSlot = 'afternoon';
    }
  } else if (occasion === 'romantic') {
    primaryYachtId = 'azimut-55-flybridge';
    altYachtId = 'oceanis-51-sailing';
    matchScore = 97;
    reasoning = `The Azimut 55 Italian motor yacht delivers sleek elegance, panoramic flybridge seating, and romantic privacy within your S$${budget} budget.`;
    suggestedSlot = 'sunset';
    suggestedItinerary = 'Golden hour departure to Lazarus Island for champagne, continuing to Singapore skyline night views.';
  } else if (occasion === 'family' || priority === 'relaxation') {
    primaryYachtId = count <= 18 ? 'lagoon-400-s2' : 'aquila-44-power-cat';
    altYachtId = 'aquila-44-power-cat';
    matchScore = 95;
    reasoning = `Twin-hull catamaran design guarantees minimum wave roll, safe walkarounds for children, and comfortable cruising within your S$${budget} budget.`;
    suggestedSlot = 'morning';
  }

  return res.json({
    primaryYachtId,
    alternativeYachtId: altYachtId,
    matchScore,
    reasoning,
    suggestedSlot,
    suggestedItinerary,
    recommendedToys,
    source: 'recommendation-engine',
  });
});

// Vite middleware or production static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`The Yacht Club Singapore full-stack app running on port ${port}`);
  });
}

startServer();
