"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import ScrollFadeIn from "./ScrollFadeIn";

const items = [
  { q: "What type of system is YAHSHUA HRIS?", a: "YAHSHUA HRIS is a cloud-based system. Open it in any browser, on any device, from anywhere. No installation, no IT setup required." },
  { q: "Is the system mobile-friendly?", a: "Yes. The system is fully responsive on desktop, tablet, and mobile browsers so your team can access it from any device. A dedicated mobile app is in the works." },
  { q: "What is the system uptime target?", a: "YAHSHUA HRIS targets 99.9% uptime. When maintenance is needed, updates are scheduled overnight to minimize disruption to your team." },
  { q: "How is my data kept secure?", a: "Your data is private, encrypted, and accessible only to authorized people in your organization. YAHSHUA HRIS is SOC2 Type 2 certified, ISO 27001 certified, and GDPR compliant." },
  { q: "How are user permissions managed?", a: "YAHSHUA HRIS uses Role-Based Access Control (RBAC). Each user sees only what their role allows, keeping sensitive data visible only to the people who need it." },
  { q: "Does the system support password reset?", a: "Yes. Secure password reset and account recovery are built in. No admin intervention needed." },
  { q: "Can YAHSHUA HRIS integrate with other systems?", a: "Currently, YAHSHUA HRIS integrates with YAHSHUA Payroll. Support for additional integrations is planned in future updates." },
  { q: "How does the YAHSHUA Payroll integration work?", a: "When you log in through YAHSHUA Payroll's SSO, the two systems connect automatically. Employee data from Payroll syncs directly into HRIS, no manual transfers needed." },
  { q: "Can we import existing employee data?", a: "Yes. YAHSHUA HRIS supports bulk data imports so you can migrate your existing employee records without rebuilding everything from scratch." },
  { q: "Will performance slow down as our team grows?", a: "Our team actively monitors server traffic and makes timely optimizations as usage grows. You get a system that keeps up with your business." },
  { q: "What is ABBA Smart Support?", a: "ABBA Smart Support is your first point of contact for any system question. Ask anything and get instant AI-powered guidance. If your concern needs a human agent, you can request one directly from the same chat." },
];

const LpFAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-28 md:py-36">
      <div className="lp-section-container">
        <ScrollFadeIn className="text-center mb-16">
          <span className="lp-section-label justify-center mb-5">FAQs</span>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight text-gray-900 tracking-tight">
            Still on the fence?<br className="hidden md:inline" /> We&apos;ve heard it before.
          </h2>
        </ScrollFadeIn>

        <ScrollFadeIn delay={100}>
          <div className="max-w-[720px] mx-auto rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={i} style={{ borderBottom: i < items.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 transition-colors duration-200"
                    style={{ background: isOpen ? 'rgba(255,193,7,0.04)' : 'transparent' }}
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-gray-700">{item.q}</span>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-200"
                      style={{
                        background: isOpen ? 'rgba(255,193,7,0.15)' : 'rgba(0,0,0,0.05)',
                        border: isOpen ? '1px solid rgba(255,193,7,0.25)' : '1px solid rgba(0,0,0,0.1)',
                      }}>
                      <Plus
                        className="w-3.5 h-3.5 transition-transform duration-200"
                        style={{
                          color: isOpen ? 'hsl(var(--lp-primary))' : 'rgba(0,0,0,0.4)',
                          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        }}
                        strokeWidth={2.5}
                      />
                    </div>
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-in-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm text-gray-500 leading-relaxed px-6 pb-5">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default LpFAQ;
