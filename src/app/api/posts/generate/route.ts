import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function POST(req: Request) {
  try {
    const { clientId } = await req.json();

    if (!clientId) {
      return NextResponse.json({ error: 'clientId is required' }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Request 3 distinct SEO blog post ideas + content for the client
    const prompt = `You are a Local SEO Expert. Write 3 long-form, highly-engaging SEO blog articles for a local business.
Business Details:
- Name: ${client.name}
- Niche: ${client.niche}
- City: ${client.city}
- Target Audience: Local customers searching for their services on Google.

Guidelines:
- Each article should establish local authority.
- The content MUST be written in beautifully formatted Markdown (using H2, H3, bullet points, and bold text).
- Do not add a main H1 in the Markdown body (we will render the title separately).
- Provide a strict JSON response.

Return EXACTLY this JSON structure:
{
  "posts": [
    {
      "title": "Compelling Click-Worthy SEO Title 1",
      "seoTitle": "SEO Meta Title under 60 chars",
      "seoDesc": "SEO Meta description under 160 chars containing keywords and city",
      "content": "The actual article content in valid Markdown format string..."
    },
    // ... 2 more posts
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Parse the JSON safely
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    if (!parsedData.posts || !Array.isArray(parsedData.posts)) {
      throw new Error("Invalid format from Gemini");
    }

    // Save all posts to database
    const createdPosts = await Promise.all(
      parsedData.posts.map(async (post: any) => {
        let slug = generateSlug(post.title);
        // Ensure slug uniqueness
        let counter = 1;
        let pSlug = slug;
        while (await prisma.post.findUnique({ where: { slug: pSlug } })) {
          pSlug = `${slug}-${counter}`;
          counter++;
        }
        
        return prisma.post.create({
          data: {
            title: post.title,
            slug: pSlug,
            content: post.content,
            seoTitle: post.seoTitle,
            seoDesc: post.seoDesc,
            clientId: client.id,
          }
        });
      })
    );

    return NextResponse.json({ success: true, posts: createdPosts });

  } catch (error) {
    console.error('Post Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate posts' },
      { status: 500 }
    );
  }
}
