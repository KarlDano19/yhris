"use client"
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import PayrollFeaturesSection from "./PayrollFeaturesSection";
import UseCasesSection from "./UseCasesSection";
import IntegrationSection from "./IntegrationSection";
import Footer from "./Footer";

const Content = () => {
  return (
    <>
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      {/* <PayrollFeaturesSection /> */}
      <UseCasesSection />
      <IntegrationSection />
      <Footer />
    </>
  );
};

export default Content;
