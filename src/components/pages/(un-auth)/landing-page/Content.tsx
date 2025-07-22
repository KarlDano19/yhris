"use client"
import Navigation from "./Navigation";
import NewHeroSection from "./NewHeroSection";
import JobSeekerSection from "./JobSeekerSection";
import HRISUserSection from "./HRISUserSection";
import Footer from "./Footer";

const Content = () => {
  return (
    <>
      <Navigation />
      <NewHeroSection />
      <JobSeekerSection />
      <HRISUserSection />
      <Footer />
    </>
  );
};

export default Content;
