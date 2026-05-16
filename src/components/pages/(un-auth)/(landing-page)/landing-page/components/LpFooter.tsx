import Link from "next/link";
import ScrollFadeIn from "./ScrollFadeIn";
import MainLogo from "@/svg/MainLogo";

const featureLinks = ["Recruitment", "Employee Management", "Leave & Attendance", "Time Tracking", "Compliance", "Performance"];
const companyLinks = ["About The ABBA Initiative", "Pricing", "Request a Demo", "Contact"];
const resourceLinks = ["Documentation", "Support", "Data Privacy Statement", "Blog"];

const LpFooter = () => {
  return (
    <footer style={{ background: 'hsl(var(--lp-surface))', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
      <div className="lp-section-container py-12 md:py-16">
        <ScrollFadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <MainLogo />
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-2">
                Professional. Compliant. Cost-effective.
              </p>
              <p className="text-xs text-gray-400">
                A product of The ABBA Initiative (OPC)
              </p>
            </div>

            {/* Links */}
            {[
              { heading: "Features", links: featureLinks },
              { heading: "Company", links: companyLinks },
              { heading: "Resources", links: resourceLinks },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">{col.heading}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      {link === "Blog" ? (
                        <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200">
                          {link}
                        </Link>
                      ) : link === "Pricing" ? (
                        <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200">
                          {link}
                        </Link>
                      ) : (
                        <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200">
                          {link}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={100}>
          <div className="border-t border-black/10 pt-6 text-center">
            <p className="text-xs text-gray-400">
              © 2025 The ABBA Initiative (OPC). All rights reserved. · Privacy Policy · Terms of Service · Data Privacy Statement
            </p>
          </div>
        </ScrollFadeIn>
      </div>
    </footer>
  );
};

export default LpFooter;
