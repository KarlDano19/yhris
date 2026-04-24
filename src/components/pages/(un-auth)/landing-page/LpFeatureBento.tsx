import ScrollFadeIn from "./ScrollFadeIn";

/* ── Feature Data ────────────────────────────────────────────── */
const features = [
  {
    label: "Recruitment & ATS",
    headline: "One pipeline from job post to Day 1.",
    description: "Post to Facebook, LinkedIn, and YAHSHUA Jobs with one click. Every applicant tracked, every stage visible, no spreadsheet required.",
    video: "/RECRUITMENT-ATS vid.mp4",
  },
  {
    label: "DOLE Compliance",
    headline: "Every report DOLE needs, ready in minutes.",
    description: "Work Accident Reports, EC Logbooks, OSH documents. Generated from live data, formatted correctly, downloadable anytime. No more building reports from scratch.",
    video: "/DOLE COMPLIANCE.mp4",
  },
  {
    label: "Centralized 201 Files",
    headline: "Every employee record, organized and always accessible.",
    description: "Complete digital 201 files from hire date to present. No filing cabinets, no lost documents. Every record is searchable, secure, and ready whenever you need it.",
    video: "/CENTRALIZED 201.mp4",
  },
  {
    label: "Employee Separation",
    headline: "Offboarding done right, every time.",
    description: "Manage clearance forms, quitclaims, and final pay documentation through a structured workflow. Every step tracked, every signature accounted for.",
    video: "/Employee Separation.mp4",
  },
];

/* ── Main Export ─────────────────────────────────────────────── */
const LpFeatureBento = () => {
  return (
    <div style={{ background: 'hsl(var(--lp-surface))' }}>

      {/* Section Header */}
      <div className="pt-28 md:pt-36 pb-20">
        <ScrollFadeIn className="lp-section-container text-center">
          <span className="lp-section-label justify-center mb-5">FEATURES</span>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-5 leading-tight text-white tracking-tight">
            Everything your HR team needs,<br className="hidden md:inline" /> in one place.
          </h2>
          <p className="text-white/45 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            From hiring to payroll sync, YAHSHUA HRIS handles every part of the employee lifecycle.
          </p>
        </ScrollFadeIn>
      </div>

      {/* Feature Sections */}
      {features.map(({ label, headline, description, video }, i) => {
        const isEven = i % 2 === 0; // even = video left, text right | odd = text left, video right

        return (
          <div key={label} className="pb-28 md:pb-40" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="lp-section-container pt-20 md:pt-28">
              <ScrollFadeIn>
                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>

                  {/* Video Side */}
                  <div className="w-full lg:w-[55%] shrink-0">
                    <video
                      src={video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full rounded-2xl"
                      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                    />
                  </div>

                  {/* Text Side */}
                  <div className="flex-1 lg:text-left">
                    <span className="lp-section-label mb-4">{label}</span>
                    <h3 className="text-2xl md:text-3xl lg:text-[2rem] font-bold text-white tracking-tight mb-5 leading-tight">
                      {headline}
                    </h3>
                    <p className="text-white/45 text-base leading-relaxed">
                      {description}
                    </p>
                  </div>

                </div>
              </ScrollFadeIn>
            </div>
          </div>
        );
      })}

    </div>
  );
};

export default LpFeatureBento;
