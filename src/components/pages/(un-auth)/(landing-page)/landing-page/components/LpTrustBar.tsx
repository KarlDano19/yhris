import ScrollFadeIn from "../components/ScrollFadeIn";

const logos = [
  { name: "RCBC", src: "/RCBC.svg" },
  { name: "Globe", src: "/GLOBE.svg" },
  { name: "CyTech", src: "/CYTECH.svg" },
  { name: "Sterling Bank of Asia", src: "/STERLING.svg" },
];

const quadrupled = [...logos, ...logos, ...logos, ...logos];

const LpTrustBar = () => {
  return (
    <section className="py-5 overflow-hidden" style={{ background: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <ScrollFadeIn>
        <div className="lp-section-container mb-4">
          <p className="text-center text-sm font-bold text-gray-700">
            Trusted by industry leaders
          </p>
        </div>
      </ScrollFadeIn>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #ffffff, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #ffffff, transparent)' }} />

        <div className="flex lp-marquee items-center h-24 md:h-36 gap-10 md:gap-20">
          {quadrupled.map((logo, i) => (
            <div
              key={i}
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.name}
                className="h-16 md:h-28"
                style={{ width: 'auto', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LpTrustBar;
