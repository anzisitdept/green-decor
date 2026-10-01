import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, prompt, material, color, size } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required before generating AI concepts.' },
        { status: 400 }
      );
    }

    if (!prompt && !material) {
      return NextResponse.json(
        { error: 'Please enter a description for your custom pot.' },
        { status: 400 }
      );
    }

    // High quality curated concept pot images mapped to materials/colors
    const CONCEPT_IMAGES: Record<string, string[]> = {
      terracotta: ['/hero-1.webp', '/hero-2.jfif', '/about-hero.jpg'],
      ceramic: ['/hero-2.jfif', '/hero-1.webp', '/about-hero.jpg'],
      'fiber-stone': ['/about-hero.jpg', '/hero-1.webp', '/hero-2.jfif'],
      metallic: ['/hero-1.webp', '/hero-2.jfif', '/about-hero.jpg'],
    };

    const imagePool = CONCEPT_IMAGES[material] || CONCEPT_IMAGES.terracotta;
    const randomIndex = Math.floor(Math.random() * imagePool.length);
    const imageUrl = imagePool[randomIndex];

    // Simulate AI generation delay for realistic user experience
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      imageUrl,
      conceptTitle: `AI Concept: ${color || 'Custom'} ${material || 'Handcrafted'} Pot`,
      prompt,
      userName: name,
      userPhone: phone,
    });
  } catch (error) {
    console.error('API generate-pot error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI concept. Please try again.' },
      { status: 500 }
    );
  }
}
