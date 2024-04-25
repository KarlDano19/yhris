import Image from "next/image";
import profileImage from "@/assets/Ellipse 8.png";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const CardProfile = () => {
  return (
    <div className="card card-user-info bg-white border border-gray-300 w-full h-auto shadow rounded-md overflow-hidden relative">
      <div className="h-32 bg-[#FCCA34] border-b border-gray-300"></div>
      <div className="flex justify-center">
        <div className="profile-image-container w-32 h-36 bg-gray-50 border border-gray-300 rounded-md overflow-hidden absolute top-11">
          <Image
            className="hidden"
            src={profileImage}
            fill
            alt="Profile image"
          />
        </div>
      </div>
      <h4 className="applicant-name text-center mt-[74px] text-xl text-indigo-dye font-semibold">
        Henry Malinawon
      </h4>
      <div className="flex justify-center mt-3 border-b pb-5 border-gray-300">
        <Link
          href="/edit-profile"
          className="rounded-md bg-white px-11 py-2.5 text-base font-bold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50"
        >
          Edit Profile
        </Link>
      </div>
      <div className="contact-address py-5 text-indigo-dye">
        <div className="email flex w-[75%] mx-auto items-center space-x-3 truncate">
          <EnvelopeIcon className="h-6 h-6" />
          <h6 className="w-10">henrymalinawon@gmail.com</h6>
        </div>
        <div className="email mt-2 flex w-[75%] mx-auto items-center space-x-3">
          <PhoneIcon className="h-6 h-6" />
          <h6>09161789374</h6>
        </div>
      </div>
    </div>
  );
};

export default CardProfile;
