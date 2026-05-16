"use client"
import Navigation from "./Navigation";
import LpHeroSection from "./LpHeroSection";
import LpTrustBar from "./LpTrustBar";
import LpValueProposition from "./LpValueProposition";
import LpFeatureBento from "./LpFeatureBento";
import LpPayrollIntegration from "./LpPayrollIntegration";
import LpComplianceTrust from "./LpComplianceTrust";
import LpComparisonTable from "./LpComparisonTable";
import LpFAQ from "./LpFAQ";
import LpFinalCTA from "./LpFinalCTA";
import LpFooter from "./LpFooter";
import ScrollFadeIn from "./ScrollFadeIn";

const Content = () => {
  return (
    <div className="min-h-screen lp-dot-grid-light" style={{ background: '#ffffff' }}>
      <Navigation />
      <LpHeroSection />
      <ScrollFadeIn duration={800}><LpValueProposition /></ScrollFadeIn>
      <ScrollFadeIn duration={800} delay={50}><LpTrustBar /></ScrollFadeIn>
      <ScrollFadeIn duration={800} delay={50}><LpFeatureBento /></ScrollFadeIn>
      <ScrollFadeIn duration={800} delay={50}><LpPayrollIntegration /></ScrollFadeIn>
      <ScrollFadeIn duration={800} delay={50}><LpComplianceTrust /></ScrollFadeIn>
      <ScrollFadeIn duration={800} delay={50}><LpComparisonTable /></ScrollFadeIn>
      <ScrollFadeIn duration={800} delay={50}><LpFAQ /></ScrollFadeIn>
      <ScrollFadeIn duration={800} delay={50}><LpFinalCTA /></ScrollFadeIn>
      <LpFooter />
    </div>
  );
};

export default Content;
