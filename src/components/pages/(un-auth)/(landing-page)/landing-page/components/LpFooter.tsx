import Link from "next/link";
import ScrollFadeIn from "./ScrollFadeIn";
import MainLogoWhite from "@/svg/MainLogoWhite";

const LpFooter = () => {
  return (
    <footer style={{ background: 'hsl(var(--lp-surface))', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="lp-section-container py-12 md:py-16">
        <ScrollFadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <MainLogoWhite />
              </div>
              <p className="text-sm text-white/50 leading-relaxed mb-2">
                Professional. Compliant. Cost-effective.
              </p>
              <p className="text-xs text-white/30">
                A product of The ABBA Initiative (OPC)
              </p>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2.5">
                {["Recruitment", "Employee Management", "Leave & Attendance", "Time Tracking", "Compliance", "Performance"].map((link) => (
                  <li key={link}>
                    <Link href="/features" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="https://www.theabbainitiative.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                    About The ABBA Initiative
                  </a>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                    Pricing
                  </Link>
                </li>
                <li>
                  <a href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                    Request a Demo
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/docs" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-notice" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                    Data Privacy Statement
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={100}>
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-xs text-white/30">
              © 2025 The ABBA Initiative (OPC). All rights reserved. ·{' '}
              <Link href="/privacy-policy" className="hover:text-white/60 transition-colors duration-200">Privacy Policy</Link>
              {' · '}
              <Link href="/terms-of-service" className="hover:text-white/60 transition-colors duration-200">Terms of Service</Link>
              {' · '}
              <Link href="/privacy-notice" className="hover:text-white/60 transition-colors duration-200">Data Privacy Statement</Link>
            </p>
          </div>
        </ScrollFadeIn>
      </div>
    </footer>
  );
};

export default LpFooter;
