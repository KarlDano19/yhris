import { ArrowRight } from "lucide-react";

interface InlineDemoCtaProps {
  heading: string;
  body: string;
  campaign: string;
}

const InlineDemoCta = ({ heading, body, campaign }: InlineDemoCtaProps) => {
  return (
    <div
      className="not-prose"
      style={{
        background: "#FFFBF0",
        border: "1px solid rgba(255,193,7,0.25)",
        borderRadius: "16px",
        padding: "1.5rem 1.75rem",
        margin: "2.5rem 0",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem 1.5rem",
      }}
    >
      <div style={{ flex: "1 1 280px" }}>
        <p style={{ color: "#111827", fontWeight: 600, fontSize: "1.05rem", margin: "0 0 0.35rem" }}>{heading}</p>
        <p style={{ color: "#6b7280", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>{body}</p>
      </div>
      <a
        href={`https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=${campaign}_inline`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-semibold px-5 py-3 rounded-xl text-white transition-all hover:gap-3"
        style={{ background: "hsl(38, 92%, 45%)", whiteSpace: "nowrap" }}
      >
        Book a free demo <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
};

export default InlineDemoCta;
