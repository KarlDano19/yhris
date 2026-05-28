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
import LpScrollZoom from "./components/LpScrollZoom";
import ScrollFadeIn from "./components/ScrollFadeIn";

const Content = () => {
  return (
    <div className="min-h-screen lp-dot-grid-light" style={{ background: '#ffffff' }}>
      <LpHeroSection />
      <LpScrollZoom>
        <ScrollFadeIn duration={800}><LpValueProposition /></ScrollFadeIn>
        <ScrollFadeIn duration={800} delay={50}><LpTrustBar /></ScrollFadeIn>
        <ScrollFadeIn duration={800} delay={50}><LpFeatureBento /></ScrollFadeIn>
        <ScrollFadeIn duration={800} delay={50}><LpPayrollIntegration /></ScrollFadeIn>
        <ScrollFadeIn duration={800} delay={50}><LpComplianceTrust /></ScrollFadeIn>
        <ScrollFadeIn duration={800} delay={50}><LpComparisonTable /></ScrollFadeIn>
        <ScrollFadeIn duration={800} delay={50}><LpFAQ /></ScrollFadeIn>
        <ScrollFadeIn duration={800} delay={50}><LpFinalCTA /></ScrollFadeIn>
      </LpScrollZoom>
    </div>
  );
};

export default Content;
