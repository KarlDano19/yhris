"use client";

import Link from "next/link";

import { ArrowRight, Clock, Tag } from "lucide-react";

import Navigation from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/Navigation";
import LpFooter from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/LpFooter";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";
import ScrollToTop from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollToTop";

const posts = [
  {
    slug: "dole-compliance-requirements-philippines",
    category: "DOLE Compliance",
    title: "DOLE Compliance Requirements Every Philippine Employer Must Know in 2026",
    excerpt: "A practical breakdown of mandatory DOLE reports under DO 252-25, including monthly WAIR submissions, the Annual Medical Report, and what the new penalty rules mean for your business.",
    date: "April 2026",
    readTime: "7 min read",
  },
];

const categoryColors: Record<string, string> = {
  "HR Tips": "bg-blue-500/10 text-blue-600",
  "DOLE Compliance": "bg-emerald-500/10 text-emerald-600",
  "Payroll": "bg-purple-500/10 text-purple-600",
  "Recruitment": "bg-orange-500/10 text-orange-600",
  "Performance": "bg-pink-500/10 text-pink-600",
};

const LpBlogContent = () => {
  return (
    <>
      <Navigation />
      <div style={{ background: 'hsl(var(--lp-page))' }}>
        <main className="min-h-screen pt-16">

          {/* Hero */}
          <section className="pt-24 pb-16 relative overflow-hidden lp-dot-grid-light lp-hero-glow" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--lp-page)))' }} />
            <div className="lp-section-container text-center relative z-10">
              <ScrollFadeIn>
                <span className="lp-section-label justify-center mb-5">BLOG</span>
                <h1 className="text-3xl md:text-4xl lg:text-[3rem] font-bold text-gray-900 mb-5" style={{ lineHeight: '1.3' }}>
                  HR Insights for Philippine<br className="hidden md:inline" />{" "}
                  <span className="text-primary">Business Leaders</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
                  Practical guides on DOLE compliance, payroll, recruitment, and running HR without the chaos.
                </p>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Post Grid */}
          <section className="py-16">
            <div className="lp-section-container">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, i) => (
                  <ScrollFadeIn key={post.slug} delay={i * 60}>
                    <Link href={`/blog/${post.slug}`} className="group block h-full">
                      <div className="lp-dark-card h-full flex flex-col overflow-hidden">
                        <div className="p-6 flex flex-col flex-1">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start ${categoryColors[post.category] ?? "bg-black/5 text-gray-500"}`}>
                            <Tag className="w-3 h-3" />
                            {post.category}
                          </span>
                          <h3 className="text-base font-bold text-gray-900 leading-normal mb-3 group-hover:text-primary transition-colors flex-1">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                            <span>{post.date}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </ScrollFadeIn>
                ))}
              </div>
            </div>
          </section>

        </main>
        <LpFooter />
      </div>
      <ScrollToTop />
    </>
  );
};

export default LpBlogContent;
