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
    <section className="py-28 md:py-36 relative overflow-hidden" style={{ background: "#ffffff" }}>
      <div className="lp-section-container relative z-10">
        <ScrollFadeIn className="text-center mb-20">
          <span className="lp-section-label justify-center mb-5">SECURITY &amp; COMPLIANCE</span>
          <AnimatedHeadline className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-5 leading-tight text-gray-900 tracking-tight">
            Auditors and labor inspectors won&apos;t catch you off guard.
          </AnimatedHeadline>
          <p className="text-gray-500 text-base md:text-lg max-w-md mx-auto leading-relaxed">
            YAHSHUA HRIS is built around Philippine labor law and international data security standards, so compliance is never an afterthought.
          </p>
        </ScrollFadeIn>

        <ScrollFadeIn>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {badges.map((b) => (
              <div
                key={b.name}
                className="opacity-90 hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center px-3 py-2"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(255,193,7,0.2)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.src}
                  alt={b.name}
                  className="h-24 md:h-40 lg:h-[190px]"
                  style={{ width: "auto", objectFit: "contain" }}
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
