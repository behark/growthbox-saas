import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Phone, CheckCircle, ArrowRight, Shield, Clock, MapPin } from "lucide-react";

export default async function ClientSite({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  // Fetch from the SQLite DB using the subdomain
  const clientData = await prisma.client.findUnique({
    where: { slug: slug },
    include: {
      posts: {
        orderBy: { createdAt: 'desc' },
        take: 3
      }
    }
  });

  if (!clientData) {
    notFound();
  }

  const siteContent = JSON.parse(clientData.config);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      {/* Top Value Bar */}
      <div className="bg-neutral-900 text-white py-2 px-4 text-sm flex justify-center items-center gap-6 hidden sm:flex">
        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" /> Serving {clientData.city} & Surrounding Areas</span>
        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" /> 24/7 Emergency Service Available</span>
      </div>

      {/* Navigation */}
      <nav className="border-b shadow-sm sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="font-extrabold text-2xl tracking-tighter text-blue-900">
            {clientData.name}
          </div>
          <div className="flex gap-4 items-center">
            <div className="hidden md:flex gap-6 font-medium text-neutral-600 mr-4">
              <a href="#about" className="hover:text-blue-600">About Us</a>
              <a href="#services" className="hover:text-blue-600">Services</a>
              <a href="/blog" className="hover:text-blue-600">Blog</a>
            </div>
            <a href="tel:5551234567" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-bold text-shadow-sm transition-all flex items-center gap-2 shadow-md">
              <Phone className="w-5 h-5" />
              <span className="hidden sm:inline">(555) 123-4567</span>
              <span className="sm:hidden">Call Now</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-neutral-50 overflow-hidden border-b">
        {/* Subtle patterned background or gradient */}
        <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 mb-6">
            ✨ #1 {clientData.niche} in {clientData.city}
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 max-w-4xl mb-6">
            {siteContent.hero?.headline}
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 max-w-2xl mb-10 leading-relaxed">
            {siteContent.hero?.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2">
              {siteContent.hero?.cta}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-200 px-8 py-4 rounded-lg font-bold text-lg shadow-sm transition-all flex justify-center items-center gap-2">
              View Our Work
            </button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-neutral-200 w-full max-w-3xl grid grid-cols-3 gap-4 text-sm font-medium text-neutral-500">
            <div className="flex flex-col items-center gap-2"><Shield className="w-6 h-6 text-green-500"/> Fully Licensed & Insured</div>
            <div className="flex flex-col items-center gap-2"><CheckCircle className="w-6 h-6 text-blue-500"/> Guaranteed Satisfaction</div>
            <div className="flex flex-col items-center gap-2"><Clock className="w-6 h-6 text-orange-400"/> Fast Response Times</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-600 font-bold tracking-wide uppercase mb-2">Our Capabilities</h2>
            <h3 className="text-4xl font-extrabold text-neutral-900">Expert {clientData.niche} Services</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {siteContent.services?.map((service: any, index: number) => (
              <div key={index} className="bg-neutral-50 rounded-2xl p-8 border border-neutral-100 hover:border-blue-100 hover:shadow-lg transition-all group cursor-pointer block">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-neutral-900 mb-3">{service.name}</h4>
                <p className="text-neutral-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-neutral-900 text-white rounded-3xl mx-4 sm:mx-8 mb-12 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full blur-[128px] opacity-20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-extrabold mb-6 text-white">{siteContent.about?.title}</h2>
          <p className="text-xl text-neutral-300 leading-relaxed mb-10">
            {siteContent.about?.content}
          </p>
          <button className="bg-white hover:bg-neutral-100 text-neutral-900 px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all">
            Get Your Free Estimate Today
          </button>
        </div>
      </section>

      {/* Recent Blog Posts */}
      {clientData.posts && clientData.posts.length > 0 && (
        <section id="blog" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-blue-600 font-bold tracking-wide uppercase mb-2">Local Expertise</h2>
                <h3 className="text-4xl font-extrabold text-neutral-900">Recent Articles</h3>
              </div>
              <a href="/blog" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {clientData.posts.map((post: any) => (
                <div key={post.id} className="bg-neutral-50 rounded-2xl p-8 border border-neutral-100 hover:shadow-md transition-shadow flex flex-col h-full">
                  <span className="text-sm font-semibold text-blue-600 mb-3">{new Date(post.createdAt).toLocaleDateString()}</span>
                  <h4 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2">{post.title}</h4>
                  <p className="text-neutral-600 leading-relaxed mb-6 line-clamp-3 flex-grow">{post.seoDesc}</p>
                  <a href={`/blog/${post.slug}`} className="text-neutral-900 font-bold hover:text-blue-600 transition-colors mt-auto flex items-center">
                    Read Article <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-neutral-100 py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="font-extrabold text-2xl tracking-tighter text-blue-900 mb-2">
              {clientData.name}
            </div>
            <p className="text-neutral-500">Proudly serving {clientData.city} and the surrounding community.</p>
          </div>
          <div className="flex md:justify-end gap-6 text-sm font-medium text-neutral-500">
            <a href="#" className="hover:text-neutral-900">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-900">Terms of Service</a>
            <a href="#" className="hover:text-neutral-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
