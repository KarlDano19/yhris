import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import FacebookIcon from "@/svg/FacebookIcon";
import InstagramIcon from "@/svg/InstagramIcons";
import LinkedInIcon from "@/svg/LinkedInIcon";
import YoutubeIcon from "@/svg/YoutubeIcon";

const Footer = () => {
  return (
    <footer className="mt-28 md:mt-24 lg:mt-36 mb-3">
      <div className="flex flex-col items-center lg:items-start lg:flex-row lg:justify-around">
        <div>
          <h5 className="text-center lg:text-left text-indigo-dye text-xl font-semibold underline underline-offset-2">
            Contact Us
          </h5>
          <div className="flex items-center space-x-2 mt-3">
            <EnvelopeIcon className="w-5 h-5 text-indigo-dye" />
            <h6 className="text-lg text-indigo-dye">marketing@abba.works</h6>
          </div>
          <div className="flex items-center space-x-2">
            <PhoneIcon className="w-5 h-5 text-indigo-dye" />
            <h6 className="text-lg text-indigo-dye">+63 9161 532 902</h6>
          </div>
        </div>
        <div className="mt-7 lg:mt-0">
          <h5 className="text-indigo-dye text-xl font-semibold">
            Visit our Social Media
          </h5>
          <div className="flex mt-4 space-x-4 mx-5">
            <Link href="#">
              <FacebookIcon className="w-[30px] h-[30px]" />
            </Link>
            <Link href="#">
              <InstagramIcon className="w-[31px] h-[31px]" />
            </Link>
            <Link href="#">
              <LinkedInIcon className="w-[30px] h-[30px]" />
            </Link>
            <Link href="#">
              <YoutubeIcon className="w-[38px] h-[31px]" />
            </Link>
          </div>
        </div>
        <div className="mt-7 lg:mt-0">
          <h5 className="text-center lg:text-left text-indigo-dye text-xl font-semibold underline underline-offset-2">
            Other Solutions
          </h5>
          <h6 className="text-center lg:text-left text-lg text-indigo-dye mt-3">
            YAHSHUA Payroll Solutions
          </h6>
          <h6 className="text-center lg:text-left  text-lg text-indigo-dye">
            YAHSHUA Books Online
          </h6>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-center md:space-x-6 mt-7 text-[#6F829B] text-[15px]">
        <Link href="#" className="text-center md:text-start">
          &copy; ABBA-YAHSHUA Solutions
        </Link>
        <Link href="#" className="text-center md:text-start">
          <span className="mr-2">•</span>Terms and Conditions
        </Link>
        <Link href="#" className="text-center md:text-start">
          <span className="mr-2">•</span>Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
