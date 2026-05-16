"use client";
import Navigation from "../landing-page/components/Navigation";
import LpFooter from "../landing-page/components/LpFooter";
import ScrollToTop from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollToTop";

function Content() {
  return (
    <>
      <Navigation />
      <div style={{ background: "hsl(var(--lp-page))" }}>
        <main className="min-h-screen pt-16">
          <div className="lp-section-container py-20 max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-bold text-white pt-8 mb-2">
              YAHSHUA-ABBA Terms of Service
            </h1>
            <p className="text-white/40 text-sm mb-12">for Web App</p>

            <h2 className="text-lg font-bold text-white pt-8 mb-3">Terms of Service Agreement</h2>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              These Terms of Service ("Terms") govern your access to and use of the YAHSHUA Outsourcing Worldwide Inc.
              ("YAHSHUA") and The ABBA Initiative, OPC ("ABBA") web application and related services, collectively referred
              to as the "Service". By accessing or using our Service, you agree to be bound by these Terms.
            </p>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              If you do not agree with any part of these Terms, then you may not access the Service. These Terms apply to
              all visitors, users, and others who access or use the Service.
            </p>

            <h3 className="text-base font-bold text-white pt-8 mb-3">1. Acceptance of Terms</h3>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              By accessing and using this Service, you accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do not use this Service.
            </p>

            <h3 className="text-base font-bold text-white pt-8 mb-3">2. Description of Service</h3>
            <p className="text-justify text-white/60 leading-relaxed mb-3">
              YAHSHUA-ABBA provides a comprehensive Human Resource Information System (HRIS) platform that includes but is
              not limited to:
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-1 mb-4 pl-2">
              <li>Employee management and payroll processing</li>
              <li>Job posting and applicant tracking</li>
              <li>Training and performance evaluation systems</li>
              <li>DOLE compliance and reporting tools</li>
              <li>Document generation and management</li>
              <li>Subscription and payment processing</li>
            </ul>

            <h3 className="text-base font-bold text-white pt-8 mb-3">3. User Accounts and Registration</h3>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              To access certain features of the Service, you must register for an account. You agree to provide accurate,
              current, and complete information during the registration process and to update such information to keep it
              accurate, current, and complete.
            </p>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              You are responsible for safeguarding the password and for maintaining the confidentiality of your account.
              You agree not to disclose your password to any third party and to take sole responsibility for activities
              that occur under your account.
            </p>

            <h3 className="text-base font-bold text-white pt-8 mb-3">4. Acceptable Use Policy</h3>
            <p className="text-justify text-white/60 leading-relaxed mb-3">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-1 mb-4 pl-2">
              <li>Use the Service in any way that violates applicable local, national, or international laws or regulations</li>
              <li>Transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
              <li>Impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
              <li>Engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
              <li>Use the Service to store, transmit, or distribute malicious software or content</li>
            </ul>

            <h3 className="text-base font-bold text-white pt-8 mb-3">5. Privacy and Data Protection</h3>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service,
              to understand our practices regarding the collection, use, and disclosure of your personal information.
            </p>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              We process personal data in accordance with Republic Act No. 10173, otherwise known as the Data Privacy Act
              of 2012 (DPA), and other applicable data protection laws.
            </p>

            <h3 className="text-base font-bold text-white pt-8 mb-3">6. Subscription and Payment Terms</h3>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              Certain features of the Service may require payment of fees. You agree to pay all applicable fees as described
              on the Service at the time you access the applicable feature.
            </p>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              Subscription fees are billed in advance on a recurring basis (monthly or annually). Your subscription will
              automatically renew unless you cancel it before the renewal date.
            </p>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              All payments are non-refundable except as required by law or as specifically stated in these Terms.
            </p>

            <h3 className="text-base font-bold text-white pt-8 mb-3">7. Intellectual Property Rights</h3>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property
              of YAHSHUA-ABBA and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              You retain ownership of any content you submit, post, or display on or through the Service ("User Content").
              By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce,
              and distribute such content in connection with the Service.
            </p>

            <h3 className="text-base font-bold text-white pt-8 mb-3">8. Service Availability and Modifications</h3>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              We strive to maintain the Service's availability but cannot guarantee uninterrupted access. The Service may
              be temporarily unavailable due to maintenance, updates, or circumstances beyond our control.
            </p>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time with or without
              notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation
              of the Service.
            </p>

            <h3 className="text-base font-bold text-white pt-8 mb-3">9. Limitation of Liability</h3>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              To the maximum extent permitted by applicable law, YAHSHUA-ABBA shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred
              directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your
              use of the Service.
            </p>

            <h3 className="text-base font-bold text-white pt-8 mb-3">10. Indemnification</h3>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              You agree to defend, indemnify, and hold harmless YAHSHUA-ABBA and its officers, directors, employees, and
              agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees
              arising out of or relating to your violation of these Terms or your use of the Service.
            </p>

            <h3 className="text-base font-bold text-white pt-8 mb-3">11. Termination</h3>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or
              liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of
              the Terms.
            </p>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              You may terminate your account at any time by contacting us. Upon termination, your right to use the Service
              will cease immediately.
            </p>

            <h3 className="text-base font-bold text-white pt-8 mb-3">12. Governing Law and Jurisdiction</h3>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              These Terms shall be interpreted and governed by the laws of the Republic of the Philippines. Any disputes
              arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts
              of the Philippines.
            </p>

            <h3 className="text-base font-bold text-white pt-8 mb-3">13. Changes to Terms</h3>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
              is material, we will provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>

            <h3 className="text-base font-bold text-white pt-8 mb-3">14. Contact Information</h3>
            <p className="text-justify text-white/60 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-6 p-6 rounded-xl space-y-1" style={{ background: "hsl(var(--lp-surface))", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-white font-bold">YAHSHUA Outsourcing Worldwide, Inc.</p>
              <p className="text-white/60">The ABBA Initiative, OPC.</p>
              <p className="text-white/60">Unit #12 2F E-Max Building</p>
              <p className="text-white/60">Masterson Avenue, Upper Balulang</p>
              <p className="text-white/60">Cagayan de Oro City, Philippines 9000</p>
              <p className="text-white/60">Email: <span className="text-primary font-semibold">clientrelations@abba.works</span></p>
              <p className="text-white/60">Phone: <span className="font-semibold text-white/80">0917-625-5249</span></p>
            </div>
            <p className="text-white/30 text-xs mt-8">Date last updated: 25 June 2025</p>
          </div>
        </main>
        <LpFooter />
      </div>
      <ScrollToTop />
    </>
  );
}

export default Content;
