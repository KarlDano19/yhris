import ScrollFadeIn from "./ScrollFadeIn";

const LpAboutBlock = () => {
  return (
    <section className="py-20 md:py-28" style={{ background: "#FFFBF0", borderTop: "1px solid rgba(255,193,7,0.15)" }}>
      <div className="lp-section-container max-w-2xl mx-auto text-center">
        <ScrollFadeIn>
          <span className="lp-section-label justify-center mb-5">WHO WE ARE</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 tracking-tight" style={{ lineHeight: "1.3" }}>
            Built by a team that has done this for 17 years.
          </h2>
          <p className="text-gray-500 text-base leading-relaxed mb-6">
            YAHSHUA HRIS is an all-in-one HR platform for Philippine businesses: employee management, DOLE compliance, recruitment, performance, and real-time payroll integration, built specifically for how Philippine businesses actually operate.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            YAHSHUA HRIS is part of{" "}
            <a
              href="https://www.theabbainitiative.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              The ABBA Initiative
            </a>
            , the company that also builds{" "}
            <a
              href="https://www.yahshua.one/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              YAHSHUA One
            </a>
            , our unified AI-powered business platform.
          </p>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default LpAboutBlock;
