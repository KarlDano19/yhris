"use client";
import Link from "next/link";
import { Cloud, Folder, Search, ShieldCheck, FileDown, Users, ArrowRight } from "lucide-react";
import Navigation from "@/components/pages/(un-auth)/landing-page/Navigation";
import LpFooter from "@/components/pages/(un-auth)/landing-page/LpFooter";
import ScrollFadeIn from "@/components/pages/(un-auth)/landing-page/ScrollFadeIn";

const features = [
  { icon: Cloud, title: "Digital Document Storage", body: "Secure cloud-based storage for all employee documents with easy upload, organization, and access controls." },
  { icon: Folder, title: "Organized Document Management", body: "Structured categorization and filing system based on the employee's journey that helps organize documents systematically." },
  { icon: Search, title: "Document Organization and Access", body: "Organized filing system based on the employee's journey to easily locate and access documents." },
  { icon: ShieldCheck, title: "Compliance and Security", body: "Ensure data privacy compliance with encrypted storage, access logs, and retention policy management." },
];

const documentTypes = [
  {
    category: "Personal Records",
    documents: ["Employee Personal Information", "Emergency Contact Details", "Government IDs and Licenses", "Educational Certificates"],
  },
  {
    category: "Employment Documents",
    documents: ["Employment Contracts", "Job Descriptions", "Offer Letters", "Non-Disclosure Agreements"],
  },
  {
    category: "Performance Records",
    documents: ["Performance Evaluations", "Training Certificates", "Disciplinary Actions", "Achievement Awards"],
  },
  {
    category: "Compliance Documents",
    documents: ["Tax Forms (BIR 2316)", "SSS/PhilHealth Records", "Safety Training Certificates", "Medical Clearances"],
  },
];

const workflowSteps = [
  { step: "01", label: "Upload", icon: Cloud, description: "Drag and drop or batch upload documents with easy categorization." },
  { step: "02", label: "Organize", icon: Folder, description: "Structured filing system helps sort and tag documents efficiently." },
  { step: "03", label: "Access", icon: ShieldCheck, description: "Role-based access ensures only authorized personnel can view documents." },
  { step: "04", label: "Retrieve", icon: FileDown, description: "Easy document access and download with full audit trail tracking." },
];

const securityItems = [
  "End-to-end encryption for all documents",
  "Data Privacy Act compliance",
  "Role-based access controls",
  "Complete audit trail logging",
  "Structured retention policy management",
];

const results = [
  "Eliminated physical filing rooms and storage costs",
  "Locate documents easily with organized filing system",
  "Remote access allows work from anywhere securely",
];

const EmployeeDocumentationContent = () => {
  return (
    <>
      <Navigation />
      <div style={{ background: "hsl(var(--lp-page))" }}>
        <main className="min-h-screen pt-16">

          {/* Hero */}
          <section className="pt-28 pb-20 relative overflow-hidden lp-dot-grid-light lp-hero-glow">
            <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--lp-page)))" }} />
            <div className="lp-section-container relative z-10 text-center">
              <ScrollFadeIn>
                <span className="lp-section-label justify-center mb-5">USE CASE</span>
                <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] text-white mb-5 tracking-tight">
                  Employee Documentation.<br className="hidden md:inline" />
                  <span className="text-primary"> Everything in one place.</span>
                </h1>
                <p className="text-base md:text-lg text-white/50 max-w-xl mx-auto leading-relaxed mb-10">
                  Secure digital storage, intelligent organization, and instant access to all employee records and compliance documents.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/register" className="lp-btn-primary lp-btn-glow gap-2">
                    Start for Free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/use-cases" className="lp-btn-ghost gap-2">
                    View All Use Cases
                  </Link>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Business Story */}
          <section className="py-20 md:py-28" style={{ background: "hsl(var(--lp-surface))" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="text-center mb-12">
                  <span className="lp-section-label justify-center mb-4">CUSTOMER STORY</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">From Filing Cabinets to Digital Excellence</h2>
                  <p className="text-primary font-medium text-sm mb-1">How Davao Construction Corp Modernized Document Management</p>
                  <p className="text-white/25 text-xs italic">This is a fictional story for illustration purposes only.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">The Challenge</p>
                      <p className="text-sm text-white/55 leading-relaxed">Davao Construction Corp had rooms full of filing cabinets, lost employee records, and compliance nightmares. Finding a single document took hours, and audits were stressful ordeals with missing paperwork.</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">The Solution</p>
                      <p className="text-sm text-white/55 leading-relaxed">YAHSHUA HRIS digitized their entire document system with secure cloud storage, organized filing structure, and systematic management that keeps everything compliant and accessible.</p>
                    </div>
                  </div>
                  <div className="lp-dark-card p-7">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">The Results</p>
                    <ul className="space-y-3">
                      {results.map((r) => (
                        <li key={r} className="flex items-start gap-3 text-sm">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(255,193,7,0.12)", border: "1px solid rgba(255,193,7,0.2)" }}>
                            <svg className="w-2.5 h-2.5 text-primary" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5" /></svg>
                          </span>
                          <span className="text-white/60">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Features */}
          <section className="py-20 md:py-28">
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="text-center mb-14">
                  <span className="lp-section-label justify-center mb-4">KEY FEATURES</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Powerful documentation features.</h2>
                </div>
              </ScrollFadeIn>
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <ScrollFadeIn key={f.title} delay={i * 60}>
                      <div className="lp-dark-card p-7 flex gap-5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(0,0,0,0.06)" }}>
                          <Icon className="w-5 h-5 text-white/40" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white/80 mb-2">{f.title}</h3>
                          <p className="text-sm text-white/45 leading-relaxed">{f.body}</p>
                        </div>
                      </div>
                    </ScrollFadeIn>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Document Types */}
          <section className="py-20 md:py-28" style={{ background: "hsl(var(--lp-surface))" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="text-center mb-14">
                  <span className="lp-section-label justify-center mb-4">DOCUMENT TYPES</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Comprehensive document management.</h2>
                </div>
              </ScrollFadeIn>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {documentTypes.map((cat, i) => (
                  <ScrollFadeIn key={cat.category} delay={i * 60}>
                    <div className="lp-dark-card p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Folder className="w-4 h-4 text-primary/70" strokeWidth={1.5} />
                        <h3 className="text-sm font-bold text-white/80">{cat.category}</h3>
                      </div>
                      <ul className="space-y-2">
                        {cat.documents.map((doc) => (
                          <li key={doc} className="flex items-start gap-2 text-xs text-white/45 leading-relaxed">
                            <span className="w-1 h-1 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollFadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* Workflow */}
          <section className="py-20 md:py-28">
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="text-center mb-14">
                  <span className="lp-section-label justify-center mb-4">WORKFLOW</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Document management in 4 steps.</h2>
                </div>
              </ScrollFadeIn>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {workflowSteps.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <ScrollFadeIn key={s.step} delay={i * 60}>
                      <div className="lp-dark-card p-6">
                        <span className="text-xs font-mono text-white/20 mb-4 block">{s.step}</span>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: "rgba(0,0,0,0.06)" }}>
                          <Icon className="w-4 h-4 text-white/40" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-sm font-bold text-white/80 mb-2">{s.label}</h3>
                        <p className="text-sm text-white/40 leading-relaxed">{s.description}</p>
                      </div>
                    </ScrollFadeIn>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="py-20 md:py-28" style={{ background: "hsl(var(--lp-surface))" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="text-center mb-14">
                  <span className="lp-section-label justify-center mb-4">SECURITY</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Built for compliance and security.</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="lp-dark-card p-7">
                    <div className="flex items-center gap-2 mb-5">
                      <ShieldCheck className="w-5 h-5 text-primary/70" strokeWidth={1.5} />
                      <h3 className="text-sm font-bold text-white/80">Security and Compliance</h3>
                    </div>
                    <ul className="space-y-3">
                      {securityItems.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(255,193,7,0.12)", border: "1px solid rgba(255,193,7,0.2)" }}>
                            <svg className="w-2.5 h-2.5 text-primary" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5" /></svg>
                          </span>
                          <span className="text-white/60">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="lp-dark-card p-7">
                    <div className="flex items-center gap-2 mb-5">
                      <Users className="w-5 h-5 text-primary/70" strokeWidth={1.5} />
                      <h3 className="text-sm font-bold text-white/80">Document Access Analytics</h3>
                    </div>
                    <div className="space-y-5">
                      {[
                        { label: "Document Storage", value: "Secure", sub: "Cloud-based" },
                        { label: "Document Access", value: "Organized", sub: "Structured" },
                        { label: "Access Control", value: "Protected", sub: "Role-based" },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between items-center">
                          <span className="text-sm text-white/40">{row.label}</span>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-white/70">{row.value}</div>
                            <div className="text-xs text-primary/60">{row.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 md:py-28">
            <div className="lp-section-container text-center">
              <ScrollFadeIn>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Ready to go paperless?</h2>
                <p className="text-white/50 text-base mb-8 max-w-sm mx-auto">Start free or book a demo. No credit card required.</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/register" className="lp-btn-primary lp-btn-glow gap-2">Start for Free <ArrowRight className="w-4 h-4" /></Link>
                  <Link href="/use-cases" className="lp-btn-ghost gap-2">View All Use Cases</Link>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

        </main>
        <LpFooter />
      </div>
    </>
  );
};

export default EmployeeDocumentationContent;
