"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { XMarkIcon, PlayIcon } from "@heroicons/react/24/outline";

import ScrollFadeIn from "./ScrollFadeIn";

/* ── Feature Data ────────────────────────────────────────────── */
const features = [
  {
    label: "Recruitment & ATS",
    headline: "One pipeline from job post to Day 1.",
    description: "Post to Facebook, LinkedIn, and YAHSHUA Jobs with one click. Every applicant tracked, every stage visible, no spreadsheet required.",
    video: "/RECRUITMENT-ATS vid.mp4",
    bg: "#ffffff",
    accent: "rgba(255,193,7,0.06)",
  },
  {
    label: "DOLE Compliance",
    headline: "Every report DOLE needs, ready in minutes.",
    description: "Work Accident Reports, EC Logbooks, OSH documents. Generated from live data, formatted correctly, downloadable anytime. No more building reports from scratch.",
    video: "/DOLE COMPLIANCE.mp4",
    bg: "#FFFBF0",
    accent: "rgba(255,193,7,0.08)",
  },
  {
    label: "Centralized 201 Files",
    headline: "Every employee record, organized and always accessible.",
    description: "Complete digital 201 files from hire date to present. No filing cabinets, no lost documents. Every record is searchable, secure, and ready whenever you need it.",
    video: "/CENTRALIZED 201.mp4",
    bg: "#ffffff",
    accent: "rgba(255,193,7,0.06)",
  },
  {
    label: "Employee Separation",
    headline: "Offboarding done right, every time.",
    description: "Manage clearance forms, quitclaims, and final pay documentation through a structured workflow. Every step tracked, every signature accounted for.",
    video: "/Employee Separation.mp4",
    bg: "#FFFBF0",
    accent: "rgba(255,193,7,0.08)",
  },
];

/* ── Video Modal ─────────────────────────────────────────────── */
const VideoModal = ({ src, onClose }: { src: string; onClose: () => void }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>
        <video
          src={src}
          autoPlay
          controls
          playsInline
          className="w-full rounded-2xl shadow-2xl"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        />
      </div>
    </div>,
    document.body
  );
};

/* ── Main Export ─────────────────────────────────────────────── */
const LpFeatureBento = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <>
      {/* Section Header */}
      <div className="pt-28 md:pt-36 pb-20" style={{ background: "#FFFBF0" }}>
        <ScrollFadeIn className="lp-section-container text-center">
          <span className="lp-section-label justify-center mb-5">FEATURES</span>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-5 leading-tight text-gray-900 tracking-tight">
            Everything your HR team needs,<br className="hidden md:inline" /> in one place.
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            From hiring to payroll sync, YAHSHUA HRIS handles every part of the employee lifecycle.
          </p>
        </ScrollFadeIn>
      </div>

      {/* Feature Sections */}
      {features.map(({ label, headline, description, video, bg, accent }, i) => {
        const isEven = i % 2 === 0;

        return (
          <div
            key={label}
            className="relative pb-28 md:pb-40 overflow-hidden"
            style={{
              background: bg,
              borderTop: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            {/* Decorative accent blob */}
            <div
              className="absolute pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 60% 60% at ${isEven ? "80%" : "20%"} 50%, ${accent}, transparent)`,
                inset: 0,
              }}
            />

            <div className="lp-section-container pt-20 md:pt-28 relative z-10">
              <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 lg:gap-20`}>

                {/* Video Side */}
                <div className="w-full lg:w-[55%] shrink-0">
                  <button
                    onClick={() => setActiveVideo(video)}
                    className="relative w-full group cursor-pointer focus:outline-none"
                    aria-label={`Watch ${label} demo`}
                  >
                    <video
                      src={video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full rounded-2xl"
                      style={{
                        border: "1px solid rgba(0,0,0,0.08)",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
                      }}
                    />
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: "rgba(0,0,0,0.3)" }}
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ background: "hsl(43 100% 51%)", boxShadow: "0 4px 24px hsl(43 100% 51% / 0.45)" }}
                      >
                        <PlayIcon className="w-7 h-7 text-navy ml-1" strokeWidth={2} />
                      </div>
                    </div>
                  </button>
                </div>

                {/* Text Side */}
                <div className="flex-1 lg:text-left">
                  <span className="lp-section-label mb-4">{label}</span>
                  <h3 className="text-2xl md:text-3xl lg:text-[2rem] font-bold text-gray-900 tracking-tight mb-5 leading-tight">
                    {headline}
                  </h3>
                  <p className="text-gray-500 text-base leading-relaxed">
                    {description}
                  </p>
                </div>

              </div>
            </div>
          </div>
        );
      })}

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal src={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  );
};

export default LpFeatureBento;
