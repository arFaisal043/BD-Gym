import { GoogleGenAI } from '@google/genai';
import { config } from '../../config';
import { IChatMessage } from './chat.interface';

export const ChatService = {
  async generateCoachResponse(messages: IChatMessage[]): Promise<string> {
    const formattedContents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const systemInstruction = `You are "Coach Flow", the Elite Head Athletic Director & Strength Coach at GymFlow BD located in Banani, Dhaka, Bangladesh.
You specialize in:
1. Eleiko Olympic powerlifting & hypertrophy splits (Push/Pull/Legs, Upper/Lower, 4-day power splits).
2. Dhaka-tailored nutrition: high-protein options available in Bangladesh (deshi chicken breast, Rui/Hilsha fish, Tok Doi sour curd, chana lentils, eggs, oats, ruti, peanut butter).
3. Recovery suite protocols: Scandinavian dry timber sauna (85°C) & filtered cold plunge (8°C).
4. Facility info: GymFlow BD Banani Hub, Turnstile RFID, HEPA H14 air purification.

Tone: Professional, motivational, evidence-based, concise. Formatting: Use markdown bullet points and bolding for clarity. Never mention specific model names or technical AI infrastructure.`;

    if (config.geminiApiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        console.warn('[Gemini Coach Flow fallback triggered]:', err.message);
      }
    }

    // Contextual athletic fallback
    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

    if (lastUserMessage.includes('split') || lastUserMessage.includes('push') || lastUserMessage.includes('workout') || lastUserMessage.includes('routine')) {
      return `**Coach Flow's 4-Day Banani Power Split:**\n\n- **Day 1 (Push Hypertrophy):** Barbell Incline Bench (4x8), Eleiko DB Shoulder Press (3x10), Cable Lateral Raises (4x15), Dips.\n- **Day 2 (Pull & Traps):** Deadlifts on rubber shock pit (4x5), Lat Pulldowns (3x10), Chest-supported T-bar Row (3x12), Bicep Curls.\n- **Day 3 (Recovery):** 15 min Finnish Sauna + 3 min 8°C Cold Plunge.\n- **Day 4 (Legs & Core):** Monolift Back Squats (4x8), Romanian Deadlifts (3x10), Bulgarian Split Squats (3x12), Hanging Leg Raises.\n\n*Hydrate with electrolytes and consume 140g+ protein daily!*`;
    }

    if (lastUserMessage.includes('diet') || lastUserMessage.includes('meal') || lastUserMessage.includes('protein') || lastUserMessage.includes('food')) {
      return `**Coach Flow's High-Protein Dhaka Meal Protocol (140g+ Protein):**\n\n1. **Breakfast (30g protein):** 4 boiled eggs (3 whole, 1 white) + oats or 2 whole wheat ruti + green tea.\n2. **Lunch (45g protein):** 200g grilled/boiled deshi chicken breast + 1 cup brown rice + 1 cup thick daal (lentils) + fresh salad.\n3. **Post-Workout (25g protein):** 1 cup Tok Doi (sour curd) blended with a banana or soaked chana (chickpeas).\n4. **Dinner (40g protein):** 150g grilled Rui or Hilsha fish (rich in Omega-3) + steamed vegetables + 1 ruti.`;
    }

    if (lastUserMessage.includes('cold plunge') || lastUserMessage.includes('sauna') || lastUserMessage.includes('recovery')) {
      return `**Scandinavian Recovery Suite (Zone 03) Protocol:**\n\n- **Heat Stage:** 15–20 minutes in the Finnish dry timber sauna (85°C) to elevate growth hormone and vasodilation.\n- **Cold Stage:** 2–3 minutes immersion in our filtered 8°C cold plunge tub to drastically reduce systemic inflammation and flush lactic acid.\n- **Contrast Effect:** Repeat 2 cycles for accelerated central nervous system (CNS) regeneration after heavy Eleiko lifting.`;
    }

    return "Coach Flow here! I'm on the gym floor at Banani Hub. Ask me for a customized training split, local Dhaka macro guidance, or recovery suite protocols!";
  },
};
