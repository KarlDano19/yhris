import ScrollFadeIn from "./ScrollFadeIn";

const apps = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="hsl(var(--lp-primary))" strokeWidth="1.5" fill="none"/>
        <path d="M14 8v6l4 2" stroke="hsl(var(--lp-primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    name: "ABBA Timekeeper",
    tag: "Attendance",
    description: "Built for field workers who can't afford downtime. Facial recognition and geo-tagged clock-ins work without signal, and every record syncs the moment connectivity returns.",
    highlights: ["Works without internet", "Facial recognition clock-in", "Auto-sync on reconnect"],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="8" y="2" width="12" height="24" rx="2" stroke="hsl(var(--lp-primary))" strokeWidth="1.5" fill="none"/>
        <circle cx="14" cy="21" r="1" fill="hsl(var(--lp-primary))"/>
        <path d="M11 7h6M11 10h4" stroke="hsl(var(--lp-primary))" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    name: "ABBA Employee Kiosk",
    tag: "Self-Service",
    description: "No more Viber requests or paper forms. Employees file leave, OT, official business, and undertime from their phone, and get payslips and announcements in the same place.",
    highlights: ["No paper, no Viber", "All request types covered", "Payslips on demand"],
  },
];

const LpMobileApps = () => {
  return (
    <section className="py-28 md:py-36" style={{ background: 'hsl(var(--lp-surface))', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="lp-section-container">

        <ScrollFadeIn className="text-center mb-16">
          <span className="lp-section-label justify-center mb-5">MOBILE-FIRST APPS</span>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-5 leading-tight text-white tracking-tight">
            Purpose-built apps for every role.
          </h2>
          <p className="text-white/45 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Your workforce isn't desk-bound. These apps aren't either.
          </p>
        </ScrollFadeIn>

        <div className="grid md:grid-cols-2 gap-5 max-w-[720px] mx-auto">
          {apps.map((app, i) => (
            <ScrollFadeIn key={app.name} delay={i * 100}>
              <div className="h-full rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300 cursor-default"
                style={{ background: 'hsl(var(--lp-surface-2))', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,193,7,0.2), 0 16px 48px rgba(0,0,0,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>

                {/* Icon + tag */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.18)' }}>
                    {app.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(255,193,7,0.08)', color: 'hsl(var(--lp-primary))', border: '1px solid rgba(255,193,7,0.15)' }}>
                    {app.tag}
                  </span>
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-base font-bold text-white mb-2">{app.name}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{app.description}</p>
                </div>

                {/* Highlights */}
                <div className="flex flex-col gap-2 mt-auto">
                  {app.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-[12px] text-white/50">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.2)' }}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4l2 2L6.5 2" stroke="hsl(var(--lp-primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {h}
                    </div>
                  ))}
                </div>

              </div>
            </ScrollFadeIn>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LpMobileApps;
