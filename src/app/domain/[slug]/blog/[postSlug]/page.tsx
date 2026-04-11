import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/prisma";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Clock, User } from "lucide-react";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; postSlug: string }>;
}) {
  const { slug, postSlug } = await params;

  // Verify client
  const clientData = await prisma.client.findUnique({
    where: { slug },
  });

  if (!clientData) {
    notFound();
  }

  // Fetch the post
  const post = await prisma.post.findUnique({
    where: { slug: postSlug },
  });

  if (!post || post.clientId !== clientData.id) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      
      {/* Blog Header */}
      <header className="bg-neutral-900 text-white pt-24 pb-32 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-transparent"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/blog" className="inline-flex items-center text-blue-300 hover:text-white font-medium mb-8 bg-neutral-800/50 px-4 py-2 rounded-full text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
          </Link>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-neutral-300 font-medium text-sm">
            <span className="flex items-center gap-2"><User className="w-4 h-4" /> {clientData.name} Team</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </header>

      {/* Post Content */}
      <main className="max-w-3xl mx-auto px-4 -mt-20 relative z-20 pb-24">
        <article className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-8 md:p-12 mb-12">
          {/* Prose class requires @tailwindcss/typography */}
          <div className="prose prose-lg prose-blue max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
        
        {/* CTA */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center ring-1 ring-blue-900/5 shadow-sm">
          <h3 className="text-2xl font-bold text-neutral-900 mb-3">Need {clientData.niche} help in {clientData.city}?</h3>
          <p className="text-neutral-600 mb-6 font-medium">Get in touch with {clientData.name} today for professional service.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all">
            Contact Us Now
          </button>
        </div>
      </main>

    </div>
  );
}
