export interface DesignSuggestion {
  theme: string;
  tagline: string;
  tags: string[];
}

interface ThemeOption extends DesignSuggestion {
  keywords: string[];
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    keywords: ['balcony', 'terrace', 'patio', 'outdoor', 'garden', 'lawn', 'land', 'backyard', 'roof', 'rooftop'],
    theme: 'Urban Jungle Balcony',
    tagline: 'A layered tropical balcony with a vertical green wall and cozy seating.',
    tags: ['Tropical Plants', 'Hanging Baskets', 'Cozy Seating'],
  },
  {
    keywords: ['office', 'indoor', 'living', 'room', 'studio', 'bedroom', 'desk', 'home'],
    theme: 'Serene Biophilic Interior',
    tagline: 'Calm, air-purifying indoor styling with soft greens and natural textures.',
    tags: ['Air Purifiers', 'Soft Lighting', 'Natural Textures'],
  },
  {
    keywords: ['minimal', 'modern', 'clean', 'concrete', 'apartment', 'loft', 'scandinavian'],
    theme: 'Minimal Modern Oasis',
    tagline: 'Crisp modern look with sculptural plants and clean-line planters.',
    tags: ['Clean Lines', 'Neutral Tones', 'Sculptural Plants'],
  },
  {
    keywords: ['pool', 'lounge', 'entertain', 'party', 'deck', 'resort', 'commercial'],
    theme: 'Modern Outdoor Oasis',
    tagline: 'Resort-worthy lounge with palms and sun-friendly planters.',
    tags: ['Palm Trees', 'Poolside Decor', 'Low Maintenance'],
  },
];

export async function generateDesignSuggestions(input: {
  description?: string;
  image?: { name: string };
}): Promise<DesignSuggestion[]> {
  // TODO(dummy): Replace with a real Gemini API call when integrated.
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const text = `${input.description ?? ''} ${input.image?.name ?? ''}`.toLowerCase();
  const matched = THEME_OPTIONS.filter((option) => option.keywords.some((k) => text.includes(k)));
  const candidates = matched.length > 0 ? matched : THEME_OPTIONS;

  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  return shuffled
    .slice(0, Math.min(3, shuffled.length))
    .map(({ theme, tagline, tags }) => ({ theme, tagline, tags }));
}