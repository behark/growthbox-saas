import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function POST(req: Request) {
  try {
    const { businessName, niche, location } = await req.json();

    if (!businessName || !niche || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set' },
        { status: 500 }
      );
    }

    // Check if client already exists
    const baseSlug = generateSlug(businessName);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await prisma.client.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert copywriter and local SEO specialist. Generate high-converting website content for a local business with the following details:
Business Name: ${businessName}
Niche: ${niche}
Location: ${location}

You MUST return ONLY a valid JSON object matching the following structure exactly (no markdown formatting, no code blocks):
{
  "hero": {
    "headline": "Catchy benefit-driven headline",
    "subheadline": "Supporting subheadline with location keywords",
    "cta": "Primary Call to Action text (e.g. Get a Free Quote)"
  },
  "about": {
    "title": "About Us Title",
    "content": "A short, persuasive paragraph about the company"
  },
  "services": [
    {
      "name": "Service 1",
      "description": "Short description of service 1"
    },
    {
      "name": "Service 2",
      "description": "Short description of service 2"
    },
    {
      "name": "Service 3",
      "description": "Short description of service 3"
    }
  ],
  "seo": {
    "metaTitle": "Optimized Meta Title",
    "metaDescription": "Optimized Meta Description"
  }
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    // Validate it's parseable JSON
    JSON.parse(cleanJson);

    // Save to the Database
    const newClient = await prisma.client.create({
      data: {
        slug: finalSlug,
        name: businessName,
        niche: niche,
        city: location,
        config: cleanJson,
        status: "Deployed"
      }
    });

    return NextResponse.json({ success: true, data: JSON.parse(cleanJson), client: newClient });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content or save to DB' },
      { status: 500 }
    );
  }
}
