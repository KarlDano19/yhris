"use client"

import LpHeroSection from "./components/LpHeroSection";
import LpTrustBar from "./components/LpTrustBar";
import LpValueProposition from "./components/LpValueProposition";
import LpFeatureBento from "./components/LpFeatureBento";
import LpPayrollIntegration from "./components/LpPayrollIntegration";
import LpComplianceTrust from "./components/LpComplianceTrust";
import LpComparisonTable from "./components/LpComparisonTable";
import LpFAQ from "./components/LpFAQ";
import LpFinalCTA from "./components/LpFinalCTA";

const Content = () => {
  return (
    <>
      <div className="lp-scroll-progress" aria-hidden="true" />
      <div className="min-h-screen" style={{ background: "#ffffff" }}>
        <LpHeroSection />
        <LpValueProposition />
        <LpTrustBar />
        <LpFeatureBento />
        <LpPayrollIntegration />
        <LpComplianceTrust />
        <LpComparisonTable />
        <LpFAQ />
        <LpFinalCTA />
      </div>
    </>
  );
};

export default Content;
