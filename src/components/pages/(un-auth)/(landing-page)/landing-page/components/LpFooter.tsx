import Link from "next/link";
import ScrollFadeIn from "./ScrollFadeIn";
import MainLogoWhite from "@/svg/MainLogoWhite";

const CALENDLY_URL = "https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026";

interface FooterLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLinkItem[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Features",
    links: [
      { label: "Recruitment", href: "/features#recruitment" },
      { label: "Employee Management", href: "/features#employee-management" },
      { label: "Compliance", href: "/features#compliance" },
      { label: "Performance", href: "/features" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About The ABBA Initiative", href: "https://www.theabbainitiative.com/", external: true },
      { label: "Pricing", href: "/pricing" },
      { label: "Request a Demo", href: CALENDLY_URL, external: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Support", href: "/faqs" },
      { label: "Data Privacy Statement", href: "/privacy-notice" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

const linkClass = "text-sm text-white/50 hover:text-white transition-colors duration-200";

const FooterLink = ({ label, href, external }: FooterLinkItem) => {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={linkClass}>
      {label}
    </Link>
  );
};

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
                Professional. Compliant.<br />Cost-effective.
              </p>
              <p className="text-xs text-white/30">
                A product of The ABBA Initiative (OPC)
              </p>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h4 className="text-sm font-semibold text-white mb-4">{column.title}</h4>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink {...link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
