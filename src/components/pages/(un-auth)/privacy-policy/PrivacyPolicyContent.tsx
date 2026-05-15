"use client";
import { ShieldCheck } from "lucide-react";

const PrivacyPolicyContent = () => {
  const listItem = (text: string) => (
    <li className="flex items-start gap-3 text-sm" key={text}>
      <span
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.2)" }}
      >
        <svg className="w-2 h-2 text-primary" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 6l3 3 5-5" />
        </svg>
      </span>
      <span className="text-white/60 leading-relaxed">{text}</span>
    </li>
  );

  return (
    <div className="lp-section-container py-20 max-w-3xl">
      {/* Header */}
      <div className="flex justify-center mb-10">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.2)" }}>
          <ShieldCheck className="w-8 h-8 text-primary" strokeWidth={1.5} />
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4 tracking-tight">Privacy Policy</h1>
      <p className="text-white/50 text-base text-center max-w-xl mx-auto mb-16 leading-relaxed">
        Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
      </p>

      <div className="space-y-10">

        <section>
          <h2 className="text-lg font-bold text-white mb-4">Web and Mobile App Privacy Notice</h2>
          <p className="text-white/60 leading-relaxed text-sm">
            This Privacy Notice is for the YAHSHUA-ABBA mobile applications, enabling collection and processing of personal information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-4">Personal Information Collected and Manner of Collection</h2>
          <p className="text-white/60 text-sm mb-3">Collected information includes:</p>
          <ul className="space-y-2">
            {["Name", "Company Name", "Email Address", "Phone Number"].map(listItem)}
          </ul>
          <p className="text-white/60 text-sm mt-4 leading-relaxed">
            Additional personal information may be collected as necessary for product or service delivery.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-4">Basis, Use, and Purpose for Processing of Personal Information</h2>
          <p className="text-white/60 text-sm mb-3">Purposes include:</p>
          <ul className="space-y-2">
            {[
              "Providing products and services",
              "Collecting customer feedback",
              "Improving product quality",
              "Developing new services",
              "Personalizing customer experience",
              "Marketing and promotion",
              "Ensuring legal compliance",
              "Addressing privacy rights requests",
            ].map(listItem)}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-4">Methods for Automated Access</h2>
          <div className="rounded-xl p-5 text-sm text-white/60 italic leading-relaxed" style={{ background: "hsl(var(--lp-surface))", border: "1px solid rgba(255,193,7,0.15)", borderLeft: "3px solid hsl(var(--lp-primary))" }}>
            "We exclusively utilize tokens for user identification within our mobile application to facilitate authentication. We do not use any other cookies for this or for any other purpose."
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-4">Disclosure of Personal Information</h2>
          <p className="text-white/60 text-sm mb-3">Personal information is shared only when:</p>
          <ul className="space-y-2">
            {[
              "Allowed under specific legal sections",
              "Essential for service delivery",
              "Meeting legal requirements",
            ].map(listItem)}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-4">Risks Involved</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Risks include potential unauthorized collection, use, disclosure, or access to personal information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-4">Data Protection and Security Measures</h2>
          <p className="text-white/60 text-sm mb-3">Implemented measures include:</p>
          <ul className="space-y-2">
            {[
              "Access control policies",
              "End-to-end encryption",
              "Security against external threats",
              "Technical protection for databases",
            ].map(listItem)}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-4">Storage and Retention</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Files are stored with cloud-based providers, maintained only as long as necessary for specified purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-4">Disposal</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Physical records are shredded, digital files anonymized to prevent unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-4">Rights of a Data Subject</h2>
          <p className="text-white/60 text-sm mb-3">Includes rights to:</p>
          <ul className="space-y-2">
            {[
              "Access personal information",
              "Request rectification",
              "Request erasure",
              "Object to processing",
              "Data portability",
            ].map(listItem)}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-4">Contact Information</h2>
          <div className="rounded-xl p-6 space-y-2" style={{ background: "hsl(var(--lp-surface))", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-white font-bold">Data Protection Officer (DPO)</p>
            <p className="text-white/60 text-sm">Unit #12 2F E-Max Building</p>
            <p className="text-white/60 text-sm">Masterson Avenue, Upper Balulang</p>
            <p className="text-white/60 text-sm">Cagayan de Oro City, Philippines 9000</p>
            <p className="text-white/60 text-sm">
              Email:{" "}
              <a href="mailto:dpo@abba.works" className="text-primary hover:underline">dpo@abba.works</a>
              {" / "}
              <a href="mailto:dpo@yahshuagroup.com" className="text-primary hover:underline">dpo@yahshuagroup.com</a>
            </p>
          </div>
          <p className="text-white/30 text-xs mt-6">Date last updated: 05 January 2024</p>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicyContent;
