"use client";

import Link from "next/link";
import { Clock, Tag } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const posts = [
  {
    slug: "thirteenth-month-pay-tracking-philippines",
    category: "Payroll Compliance",
    title: "Start Tracking 13th Month Pay Now — Or Pay For It in November",
    excerpt: "Philippine employers owe 13th month pay by December 24. The ones that don't scramble are the ones tracking it every payroll run, not just in November. Here's the formula, who qualifies, and how to set it up.",
    date: "June 2026",
    readTime: "6 min read",
  },
  {
    slug: "philippine-holiday-pay-computation-guide",
    category: "DOLE Compliance",
    title: "Philippine Holiday Pay Computation: A Complete Employer Guide",
    excerpt: "Correct pay rates for regular and special non-working holidays, rest day premiums, common employer mistakes, and what DOLE expects on every payroll cycle.",
    date: "June 2026",
    readTime: "6 min read",
  },
  {
    slug: "dole-compliance-requirements-philippines",
    category: "DOLE Compliance",
    title: "DOLE Compliance Requirements Every Philippine Employer Must Know in 2026",
    excerpt: "A practical breakdown of mandatory DOLE reports under DO 252-25, including monthly WAIR submissions, the Annual Medical Report, and what the new penalty rules mean for your business.",
    date: "April 2026",
    readTime: "7 min read",
  },
];

const LpBlogContent = () => {
  return (
    <div style={{ background: "#ffffff" }}>
      <main className="min-h-screen pt-16">

        {/* Hero */}
        <section className="pt-24 pb-16 relative overflow-hidden lp-dot-grid-light lp-hero-glow"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #ffffff)" }} />
          <div className="lp-section-container text-center relative z-10">
            <ScrollFadeIn>
              <span className="lp-section-label justify-center mb-5">BLOG</span>
              <h1 className="text-3xl md:text-4xl lg:text-[3rem] font-bold text-gray-900 mb-5" style={{ lineHeight: "1.3" }}>
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
        <section className="py-16" style={{ background: "#FFFBF0" }}>
          <div className="lp-section-container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <ScrollFadeIn key={post.slug} delay={i * 60}>
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    <div className="lp-light-card h-full flex flex-col overflow-hidden">
                      <div className="p-6 flex flex-col flex-1">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start"
                          style={{ background: "rgba(255,193,7,0.12)", color: "hsl(38, 92%, 38%)" }}
                        >
                          <Tag className="w-3 h-3" />
                          {post.category}
                        </span>
                        <h3 className="text-base font-bold text-gray-900 leading-normal mb-3 group-hover:text-primary transition-colors flex-1">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4"
                          style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
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
    </div>
  );
};

export default LpBlogContent;
