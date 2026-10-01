export interface DesignSuggestion {
  theme: string;
  tagline: string;
  tags: string[];
  imageUrl?: string;
  fallbackImageUrl?: string;
  layoutTips?: string[];
  recommendedPlants?: string[];
  imagePrompt?: string;
}

export interface GenerateDesignInput {
  description?: string;
  /**
   * Contact details collected by the pre-generation modal. Optional so the
   * generation call still works without them, but when present the server
   * records the visitor as an AI studio lead for the sales team.
   */
  name?: string;
  phone?: string;
  image?: {
    data: string; // Base64 image
    mimeType: string;
    name?: string;
  } | null;
}

const FALLBACK_SUGGESTIONS: DesignSuggestion[] = [
  {
    theme: 'Urban Jungle Balcony',
    tagline: 'A layered tropical balcony featuring vertical wall accents, hanging baskets, and warm ambient outdoor lighting.',
    tags: ['Monstera Deliciosa', 'Hanging Baskets', 'Terracotta Planters'],
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
    layoutTips: ['Hang trailing plants along railings', 'Position taller potted palms in corners for depth'],
    recommendedPlants: ['Monstera Deliciosa', 'Golden Pothos', 'Areca Palm'],
    imagePrompt: 'lush tropical balcony garden with monstera plants, terracotta pots, ambient festoon lighting, cozy lounge chair, 8k photorealistic architectural photography',
  },
  {
    theme: 'Serene Biophilic Interior',
    tagline: 'Calm, air-purifying indoor styling with sleek ceramic pots, soft organic foliage, and natural wooden stands.',
    tags: ['Fiddle Leaf Fig', 'Air Purifiers', 'Ceramic Pots'],
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80',
    layoutTips: ['Place near bright indirect light sources', 'Cluster 3 pots of varying heights'],
    recommendedPlants: ['Fiddle Leaf Fig', 'Snake Plant', 'Peace Lily'],
    imagePrompt: 'modern biophilic living room green corner, tall fiddle leaf fig in sleek ceramic pot, warm natural wood stand, soft sunlight, 8k render',
  },
  {
    theme: 'Minimal Modern Outdoor Oasis',
    tagline: 'Crisp modern look with sculptural plants, clean-line concrete planters, and low-maintenance greenery.',
    tags: ['Clean Concrete', 'Sun Hardy', 'Sculptural Plants'],
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
    layoutTips: ['Use uniform concrete planter colors for a cohesive look', 'Add automated drip irrigation'],
    recommendedPlants: ['Majesty Palm', 'Bougainvillea', 'Aloe Vera'],
    imagePrompt: 'luxury modern resort patio lawn with palm trees, clean concrete planters, outdoor lighting, high end landscape design photography 8k',
  },
];

export async function generateDesignSuggestions(input: GenerateDesignInput): Promise<DesignSuggestion[]> {
  try {
    const response = await fetch('/api/design-studio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: input.description,
        ...(input.name?.trim() ? { name: input.name.trim() } : {}),
        ...(input.phone?.trim() ? { phone: input.phone.trim() } : {}),
        image: input.image
          ? {
              data: input.image.data,
              mimeType: input.image.mimeType,
            }
          : null,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        return data.suggestions;
      }
    }
  } catch (error) {
    console.error('Client failed to fetch design suggestions from API:', error);
  }

  return FALLBACK_SUGGESTIONS;
}