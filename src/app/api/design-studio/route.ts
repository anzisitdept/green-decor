import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export interface DesignStudioRequest {
  description?: string;
  image?: {
    data: string; // Base64 encoded string
    mimeType: string;
  } | null;
}

export interface DesignSuggestion {
  theme: string;
  tagline: string;
  tags: string[];
  imageUrl: string;
  fallbackImageUrl: string;
  layoutTips?: string[];
  recommendedPlants?: string[];
  imagePrompt?: string;
}

const CANDIDATE_MODELS = [
  'models/gemini-2.5-flash',
  'models/gemini-2.0-flash',
  'models/gemini-1.5-flash',
  'models/gemini-flash-latest',
  'models/gemini-1.5-pro',
];

const CURATED_CONCEPT_IMAGES = [
  {
    keywords: ['desert', 'succulent', 'terracotta', 'cactus', 'dry', 'warm', 'arizona', 'sand', 'minimalism'],
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['botanical', 'opulence', 'indoor', 'living', 'luxury', 'biophilic', 'sanctuary', 'waxy', 'monstera'],
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['harvest', 'organic', 'table', 'patio', 'dining', 'farm', 'herbs', 'kitchen', 'rustic', 'linen'],
    url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['balcony', 'tropical', 'vertical', 'terrace', 'pothos', 'hanging', 'cozy', 'lahore'],
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['minimal', 'concrete', 'modern', 'clean', 'sculptural', 'scandinavian', 'loft'],
    url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['resort', 'palms', 'pool', 'lounge', 'deck', 'lawn', 'outdoor', 'garden'],
    url: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['wall', 'greenery', 'vertical garden', 'moss', 'living wall', 'office', 'reception'],
    url: 'https://images.unsplash.com/photo-1534710961216-b5c8d41c10b4?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['boho', 'bohemian', 'cozy', 'hanging', 'macrame', 'wooden', 'sunlight'],
    url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['zen', 'japanese', 'gravel', 'bamboo', 'tranquil', 'courtyard', 'minimalist'],
    url: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['fiddle leaf', 'sunroom', 'interior', 'window', 'bright', 'plant stand'],
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['vegetable', 'herb', 'planter box', 'raised bed', 'garden', 'backyard'],
    url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['aquarium', 'aquascape', 'biotope', 'underwater', 'planted tank', 'water feature'],
    url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=900&q=80',
  },
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getConceptImages(
  theme: string,
  description: string,
  imagePrompt: string,
  index: number
): { imageUrl: string; fallbackImageUrl: string } {
  const cleanPrompt = imagePrompt?.trim() || `${theme} ${description} landscape architecture design photorealistic green decor studio`;
  const seed = Math.floor(Math.random() * 899999) + 100000 + index * 17;
  const aiGeneratedUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=900&height=600&nologo=true&seed=${seed}`;

  const combined = `${theme} ${description} ${cleanPrompt}`.toLowerCase();
  const matched = CURATED_CONCEPT_IMAGES.find((item) => item.keywords.some((kw) => combined.includes(kw)));
  
  let fallbackUrl = matched ? matched.url : '';
  if (!fallbackUrl) {
    const fallbackIdx = (index * 4 + (hashCode(combined) % CURATED_CONCEPT_IMAGES.length)) % CURATED_CONCEPT_IMAGES.length;
    fallbackUrl = CURATED_CONCEPT_IMAGES[fallbackIdx].url;
  }

  return {
    imageUrl: aiGeneratedUrl,
    fallbackImageUrl: fallbackUrl,
  };
}

function buildDefaultFallbackSuggestions(): DesignSuggestion[] {
  const defaultThemes = [
    {
      theme: 'Urban Jungle Oasis',
      tagline: 'A lush, multi-layered green sanctuary combining high-leaf Monsteras, trailing Pothos, and sturdy terracotta planters.',
      tags: ['Monstera Deliciosa', 'Terracotta Planters', 'Vertical Greens', 'Drip Irrigation'],
      layoutTips: ['Place taller plants like Areca Palms in the corners to create height.', 'Use hanging baskets for trailing Pothos to maximize vertical space.'],
      recommendedPlants: ['Monstera Deliciosa', 'Areca Palm', 'Golden Pothos', 'Snake Plant'],
      imagePrompt: 'lush tropical balcony garden with monstera plants, terracotta pots, ambient festoon lighting, cozy lounge chair, 8k photorealistic architectural photography',
    },
    {
      theme: 'Minimal Biophilic Corner',
      tagline: 'Clean lines with sculptural Fiddle Leaf Figs and sleek concrete pots, bringing calm balance and air purification.',
      tags: ['Fiddle Leaf Fig', 'Minimal Concrete', 'Air Purifying', 'Neutral Tones'],
      layoutTips: ['Group plants in odd numbers (3s or 5s) with varying pot heights.', 'Keep pathways clear for natural light flow.'],
      recommendedPlants: ['Fiddle Leaf Fig', 'Snake Plant Laurentii', 'Peace Lily'],
      imagePrompt: 'modern biophilic living room green corner, tall fiddle leaf fig in sleek concrete pot, warm natural wood stand, soft daylight 8k photorealistic render',
    },
    {
      theme: 'Modern Resort Terrace',
      tagline: 'Sun-hardy palms, fragrant jasmine, and low-maintenance succulents arranged around comfortable lounge seating.',
      tags: ['Majesty Palms', 'Sun Hardy', 'Low Maintenance', 'Resort Vibe'],
      layoutTips: ['Position sun-loving palms along exterior railings.', 'Add warm low-voltage solar spotlighting near planter bases.'],
      recommendedPlants: ['Majesty Palm', 'Bougainvillea', 'Aloe Vera', 'Rubber Tree'],
      imagePrompt: 'luxury modern resort patio lawn with majesty palms, white stone planters, outdoor seating and ambient landscape lighting 8k',
    },
  ];

  return defaultThemes.map((item, index) => {
    const imgs = getConceptImages(item.theme, item.tagline, item.imagePrompt, index);
    return {
      ...item,
      imageUrl: imgs.imageUrl,
      fallbackImageUrl: imgs.fallbackImageUrl,
    };
  });
}

function cleanJsonString(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

export async function POST(request: Request) {
  const defaultFallbacks = buildDefaultFallbackSuggestions();

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is missing in environment. Using fallback suggestions.');
      return NextResponse.json({ success: true, suggestions: defaultFallbacks, source: 'fallback' });
    }

    const body: DesignStudioRequest = await request.json().catch(() => ({}));
    const descriptionText = body.description?.trim() || '';
    const imageInput = body.image;

    const systemPrompt = `You are an expert landscape architect and botanical interior designer for "Green Decor" (a luxury plant, pot, and outdoor/indoor styling brand).
Analyze the user's description and uploaded photo (if provided).
Generate exactly 3 creative, distinct, and practical green design concepts for their space.

Provide your output ONLY as a raw valid JSON array of 3 objects with these exact keys:
[
  {
    "theme": "Catchy Short Title",
    "tagline": "A rich 2-3 sentence overview describing layout, pots, lighting, and foliage texture.",
    "tags": ["3 to 5 relevant tags (e.g. plant names, pot style, or design style)"],
    "layoutTips": ["2 actionable placement or arrangement tips"],
    "recommendedPlants": ["3 to 4 specific suitable plants"],
    "imagePrompt": "A detailed 1-2 sentence description of a high-resolution photorealistic landscape architectural render for AI image generation showcasing this specific plant styling concept with realistic lighting and pots."
  }
]

User Description: "${descriptionText || 'A sunny balcony or indoor green corner requiring modern plant styling.'}"`;

    const parts: Array<Record<string, unknown>> = [
      { text: systemPrompt }
    ];

    if (imageInput && imageInput.data && imageInput.mimeType) {
      parts.push({
        inlineData: {
          mimeType: imageInput.mimeType,
          data: imageInput.data.replace(/^data:image\/\w+;base64,/, ''),
        }
      });
    }

    let rawOutput: string | null = null;

    for (const model of CANDIDATE_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            rawOutput = candidateText;
            break;
          }
        }
      } catch (err) {
        console.warn(`Failed to call ${model}:`, err);
      }
    }

    if (!rawOutput) {
      console.warn('Gemini models failed. Returning default concepts.');
      return NextResponse.json({ success: true, suggestions: defaultFallbacks, source: 'fallback' });
    }

    try {
      const cleaned = cleanJsonString(rawOutput);
      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed) && parsed.length > 0) {
        const formattedSuggestions: DesignSuggestion[] = parsed.slice(0, 3).map((item, index) => {
          const theme = String(item.theme || `Green Concept ${index + 1}`);
          const tagline = String(item.tagline || 'Beautiful green styling for your space.');
          const imagePrompt = String(item.imagePrompt || `${theme} ${descriptionText} landscape design photorealistic`);
          const recPlants = Array.isArray(item.recommendedPlants) ? item.recommendedPlants.map(String) : [];

          const conceptImgs = getConceptImages(theme, descriptionText || tagline, imagePrompt, index);

          return {
            theme,
            tagline,
            tags: Array.isArray(item.tags) ? item.tags.map(String) : ['Green Decor', 'Live Plants'],
            imageUrl: conceptImgs.imageUrl,
            fallbackImageUrl: conceptImgs.fallbackImageUrl,
            imagePrompt,
            layoutTips: Array.isArray(item.layoutTips) ? item.layoutTips.map(String) : undefined,
            recommendedPlants: recPlants.length > 0 ? recPlants : undefined,
          };
        });

        return NextResponse.json({ success: true, suggestions: formattedSuggestions, source: 'ai' });
      }
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output:', parseErr, rawOutput);
    }

    return NextResponse.json({ success: true, suggestions: defaultFallbacks, source: 'fallback' });
  } catch (error) {
    console.error('Error in design-studio API route:', error);
    return NextResponse.json({ success: true, suggestions: defaultFallbacks, source: 'fallback' });
  }
}

