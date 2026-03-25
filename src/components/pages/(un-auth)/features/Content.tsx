"use client"
import Navigation from "../landing-page/Navigation";
import FeaturesSection from "../landing-page/FeaturesSection";
import UseCasesSection from "../landing-page/UseCasesSection";
import IntegrationSection from "../landing-page/IntegrationSection";
import Footer from "../landing-page/Footer";

const Content = () => {
  return (
    <>
      <Navigation />
      
      {/* Features Header */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 pt-24">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-indigo-dye mb-6 leading-tight">
              YAHSHUA HRIS
              <br />
              <span className="text-[#FFC107]">Complete Features</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Discover all the powerful features that make YAHSHUA HRIS the complete solution for employee data management, 
              job posting automation, and HR compliance. Built specifically for Philippine businesses.
            </p>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <UseCasesSection />
      <IntegrationSection />
      <Footer />
    </>
  );
};

export default Content;