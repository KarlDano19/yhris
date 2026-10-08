"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, FileText, Tag } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image?: string;
  featured?: boolean;
};

export const RECENT_COUNT = 4;

// Featured = the post flagged `featured`, else the newest post with a cover image.
// Recent = the newest posts after that. Posts are ordered newest first.
export const splitFeatured = (posts: BlogPost[]) => {
  const featured = posts.find((p) => p.featured) ?? posts.find((p) => p.image) ?? posts[0];
  const recent = posts.filter((p) => p.slug !== featured.slug).slice(0, RECENT_COUNT);
  const shown = new Set([featured.slug, ...recent.map((p) => p.slug)]);
  const rest = posts.filter((p) => !shown.has(p.slug));
  return { featured, recent, rest };
};

const categoryBadge = { background: "rgba(255,193,7,0.12)", color: "hsl(38, 92%, 38%)" };

const BlogFeaturedSection = ({ featured, recent }: { featured: BlogPost; recent: BlogPost[] }) => {
  return (
    <section className="py-16" style={{ background: "#ffffff" }}>
      <div className="lp-section-container">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Featured */}
          <ScrollFadeIn className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Featured</p>
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="lp-light-card overflow-hidden">
                {featured.image && (
                  <div className="relative w-full overflow-hidden aspect-[1200/628]">
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-4" style={categoryBadge}>
                    <Tag className="w-3 h-3" />
                    {featured.category}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors" style={{ lineHeight: "1.35" }}>
                    {featured.title}
                  </h2>
                  <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                    <span className="flex items-center gap-3">
                      <span>{featured.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {featured.readTime}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                      Read article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollFadeIn>

          {/* Recent */}
          <ScrollFadeIn className="lg:col-span-2" delay={80}>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Recent Articles</p>
            <ul>
              {recent.map((post, i) => (
                <li key={post.slug} style={{ borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.07)" }}>
                  <Link href={`/blog/${post.slug}`} className="group flex gap-4 py-4">
                    <div className="relative shrink-0 w-24 h-16 rounded-lg overflow-hidden" style={{ background: "rgba(255,193,7,0.12)" }}>
                      {post.image ? (
                        <Image src={post.image} alt={post.title} fill sizes="96px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ color: "hsl(38, 92%, 38%)" }}>
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold mb-1" style={{ color: "hsl(38, 92%, 38%)" }}>{post.category}</p>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">{post.date} · {post.readTime}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollFadeIn>

        </div>
      </div>
    </section>
  );
};

export default BlogFeaturedSection;
