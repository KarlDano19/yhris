"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Tag } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const posts = [
  {
    slug: "night-differential-holiday-pay-philippines",
    category: "DOLE Compliance",
    title: "Night Differential and Holiday Pay: How the Rates Actually Stack",
    excerpt: "A night-shift employee working a regular holiday rest day earns 286%, not 200% or 260%. Full stacking tables for night differential, holiday pay, rest days, overtime, and double holidays, plus a worked example.",
    date: "August 2026",
    readTime: "7 min read",
    image: "/blog/night-differential-holiday-stacking.png",
  },
  {
    slug: "ncr-minimum-wage-2026",
    category: "Statutory Compliance",
    title: "NCR Minimum Wage 2026: New Rates Under Wage Order No. 27 Are Now in Effect",
    excerpt: "Non-agriculture workers in Metro Manila now earn a minimum of ₱755/day under Wage Order No. NCR-27, effective July 25, 2026. A second tranche of ₱25 follows January 20, 2027. Full rate table, who is covered, and employer payroll checklist.",
    date: "July 2026",
    readTime: "8 min read",
    image: "/blog/ncr-minimum-wage-2026.png",
  },
  {
    slug: "ai-guidance-vs-automation-hr-software",
    category: "Future of Work",
    title: "Why \"Telling You the Rule\" Is Not Compliance: The Real Difference Between AI Guidance and AI Automation in HR Software",
    excerpt: "An AI assistant that quotes you the SSS rate is not the same as a payroll system that applies it correctly. One informs. The other acts. This is the distinction that determines your actual compliance exposure.",
    date: "July 2026",
    readTime: "10 min read",
    image: "/blog/ai-guidance-vs-automation.png",
  },
  {
    slug: "payroll-registration-checklist-philippines",
    category: "Operations Playbook",
    title: "The Philippine Business Payroll Setup Checklist: Registering with BIR, SSS, PhilHealth, and Pag-IBIG",
    excerpt: "Every form, fee, and deadline for setting up payroll compliance from scratch. Covers the correct registration sequence, why Pag-IBIG must come last, and what triggers penalties before your first remittance.",
    date: "July 2026",
    readTime: "9 min read",
    image: "/blog/payroll-registration-checklist.png",
  },
  {
    slug: "sss-contribution-table-2026-philippines",
    category: "Statutory Compliance",
    title: "2026 Philippine Statutory Contribution Changes: SSS, PhilHealth and Pag-IBIG Rates Employers Must Update Now",
    excerpt: "SSS raised its total rate to 15% with a ₱35,000 MSC ceiling. PhilHealth is finalized at 5% with a ₱100,000 ceiling. Pag-IBIG caps at ₱400 per month. Updated tables and computation examples for every salary level.",
    date: "July 2026",
    readTime: "10 min read",
    image: "/blog/sss-contribution-2026.png",
  },
  {
    slug: "philippine-payroll-errors-msme",
    category: "Payroll Compliance",
    title: "What Philippine Payroll Errors Actually Cost MSMEs",
    excerpt: "SSS is now at 15%, PhilHealth at 5%, and BIR penalties compound at 25% surcharge plus 12% annual interest. If your payroll system was not updated, errors have been accumulating since January.",
    date: "June 2026",
    readTime: "7 min read",
    image: "/blog/payroll-errors-msme.png",
  },
  {
    slug: "philippine-compliance-hris-2026",
    category: "HRIS & Compliance",
    title: "Philippine Compliance 2026: Why You Need One System, Not Five Checklists",
    excerpt: "PhilHealth E-Claims 3.0 deadline is June 30. BIR income sourcing rules are active. DOLE AERW is open. Here is what each obligation means and how to face all of them without drowning.",
    date: "June 2026",
    readTime: "6 min read",
    image: "/blog/why-one-system.png",
  },
  {
    slug: "payroll-automation-philippines",
    category: "Payroll & HR",
    title: "Your Payroll Is a Message to Your Team",
    excerpt: "A payroll that is late says: you were not our priority. A payroll that is correct, on time, every cycle says something else entirely. Here is what accurate, automated payroll actually gives Philippine businesses.",
    date: "June 2026",
    readTime: "7 min read",
    image: "/blog/payroll-message.png",
  },
  {
    slug: "thirteenth-month-pay-tracking-philippines",
    category: "Payroll Compliance",
    title: "Start Tracking 13th Month Pay Now — Or Pay For It in November",
    excerpt: "Philippine employers owe 13th month pay by December 24. The ones that don't scramble are the ones tracking it every payroll run, not just in November. Here's the formula, who qualifies, and how to set it up.",
    date: "June 2026",
    readTime: "6 min read",
    image: "/blog/start-tracking-13th-month.png",
  },
  {
    slug: "philippine-holiday-pay-computation-guide",
    category: "DOLE Compliance",
    title: "Philippine Holiday Pay Computation: A Complete Employer Guide",
    excerpt: "Correct pay rates for regular and special non-working holidays, rest day premiums, common employer mistakes, and what DOLE expects on every payroll cycle.",
    date: "June 2026",
    readTime: "6 min read",
    image: "/blog/philippine-holiday-pay.png",
  },
  {
    slug: "dole-compliance-requirements-philippines",
    category: "DOLE Compliance",
    title: "DOLE Compliance Requirements Every Philippine Employer Must Know in 2026",
    excerpt: "A practical breakdown of mandatory DOLE reports under DO 252-25, including monthly WAIR submissions, the Annual Medical Report, and what the new penalty rules mean for your business.",
    date: "April 2026",
    readTime: "7 min read",
    image: "/blog/dole-compliance-2026.png",
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
                      {post.image && (
                        <div className="relative w-full overflow-hidden" style={{ height: "180px" }}>
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
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
