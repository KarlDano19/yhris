import ScrollFadeIn from "./ScrollFadeIn";
import AnimatedHeadline from "./AnimatedHeadline";

const badges = [
  { src: "/GDPR.svg", name: "GDPR Compliant" },
  { src: "/SOC2 Type 2.svg", name: "SOC2 Type 2" },
  { src: "/ISO 27001.svg", name: "ISO 27001" },
  { src: "/DOLE-Ready.svg", name: "DOLE-Ready" },
];

const LpComplianceTrust = () => {
  return (
    <section className="py-28 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.015)' }} />

      <div className="lp-section-container relative z-10">
        <ScrollFadeIn className="text-center mb-20">
          <span className="lp-section-label justify-center mb-5">SECURITY &amp; COMPLIANCE</span>
          <AnimatedHeadline className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-5 leading-tight text-white tracking-tight">
            Auditors and labor inspectors won&apos;t catch you off guard.
          </AnimatedHeadline>
          <p className="text-white/45 text-base md:text-lg max-w-md mx-auto leading-relaxed">
            YAHSHUA HRIS is built around Philippine labor law and international data security standards, so compliance is never an afterthought.
          </p>
        </ScrollFadeIn>

        <ScrollFadeIn>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {badges.map((b) => (
              <div
                key={b.name}
                className="opacity-80 hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center px-3 py-2"
                style={{ background: '#ffffff', boxShadow: '0 0 24px 6px rgba(255,255,255,0.25), 0 0 60px 10px rgba(255,255,255,0.1)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.src}
                  alt={b.name}
                  className="h-24 md:h-40 lg:h-[190px]"
                  style={{ width: 'auto', objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default LpComplianceTrust;
