import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FacebookIcon from "@/svg/FacebookIcon";
import InstagramIcon from "@/svg/InstagramIcons";
import LinkedInIcon from "@/svg/LinkedInIcon";
import YoutubeIcon from "@/svg/YoutubeIcon";

const Footer = () => {
  const pathname = usePathname();
  
  // Helper function to create proper navigation links
  const getNavLink = (section: string) => {
    if (pathname === '/landing-page') {
      return `#${section}`;
    }
    return `/landing-page#${section}`;
  };
  return (
    <footer id="contact" className="relative mt-20 mb-8">
      <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl mx-4 sm:mx-6 lg:mx-8 p-8 lg:p-12 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold text-indigo-dye mb-4">
                YAHSHUA <span className="text-[#FFC107]">HRIS</span>
              </h3>
              <p className="text-gray-600 mb-6">
                Complete HR solution for modern businesses. Streamline your HR processes with our comprehensive platform.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-[#FFC107] transition-colors">
                  <FacebookIcon className="w-6 h-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-[#FFC107] transition-colors">
                  <InstagramIcon className="w-6 h-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-[#FFC107] transition-colors">
                  <LinkedInIcon className="w-6 h-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-[#FFC107] transition-colors">
                  <YoutubeIcon className="w-6 h-6" />
                </Link>
              </div>
            </div>

            <div id="products">
              <h5 className="text-indigo-dye text-lg font-semibold mb-4">
                ABBA Initiative Products
              </h5>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-savoy-blue transition-colors">
                    YAHSHUA HRIS
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-savoy-blue transition-colors">
                    YAHSHUA Payroll Online
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-savoy-blue transition-colors">
                    YAHSHUA Books Online
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-savoy-blue transition-colors">
                    YAHSHUA Tax Online
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-indigo-dye text-lg font-semibold mb-4">
                Quick Links
              </h5>
              <ul className="space-y-3">
                <li>
                  <Link href={getNavLink("features")} className="text-gray-600 hover:text-[#FFC107] transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href={getNavLink("integration")} className="text-gray-600 hover:text-[#FFC107] transition-colors">
                    Integration
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-600 hover:text-[#FFC107] transition-colors">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-600 hover:text-[#FFC107] transition-colors">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-indigo-dye text-lg font-semibold mb-4">
                Contact Us
              </h5>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-[#FFC107] flex-shrink-0" />
                  <a href="mailto:marketing@abba.works" className="text-gray-600 hover:text-[#FFC107] transition-colors">
                    marketing@abba.works
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-[#FFC107] flex-shrink-0" />
                  <a href="tel:+639161532902" className="text-gray-600 hover:text-[#FFC107] transition-colors">
                    +63 9161 532 902
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div className="text-gray-500 text-sm text-center md:text-left">
                &copy; 2024 The ABBA Initiative, OPC. All rights reserved.
              </div>
              <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 text-center md:text-left">
                <Link href="#" className="text-gray-500 hover:text-[#FFC107] text-sm transition-colors">
                  Terms and Conditions
                </Link>
                <Link href="#" className="text-gray-500 hover:text-[#FFC107] text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-gray-500 hover:text-[#FFC107] text-sm transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
