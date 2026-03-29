import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export default async function BlogIndexPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const clientData = await prisma.client.findUnique({
    where: { slug },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!clientData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold text-neutral-900 mb-2">Our Latest News & Articles</h1>
        <p className="text-xl text-neutral-600 mb-12">Expert advice for {clientData.city} from the {clientData.niche} professionals.</p>

        <div className="space-y-8">
          {clientData.posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-neutral-100">
              <h3 className="text-xl font-medium text-neutral-900">No articles yet</h3>
              <p className="text-neutral-500">Check back later for new content!</p>
            </div>
          ) : (
            clientData.posts.map((post: any) => (
              <article key={post.id} className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-3 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-neutral-600 mb-6">{post.seoDesc}</p>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-100">
                  <span className="inline-flex items-center text-sm text-neutral-500">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                    Read Full Article &rarr;
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
