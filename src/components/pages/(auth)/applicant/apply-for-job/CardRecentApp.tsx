import Image from "next/image";
import profileImage from "@/assets/Ellipse 8.png";

const CardRecentApp = () => {
  return (
    <div className="card card-recent-app h-auto bg-white border border-gray-300 shadow rounded-md mt-8 md:mt-9">
      <h6 className="font-semibold text-indigo-dye my-4 mx-6">
        Recent Applications
      </h6>
      <div className="mx-3 border-t border-gray-300 divider"></div>
      <p className="text-center mx-auto text-[#CCD8EA] font-semibold w-40 h-32 mt-7">
        No application yet. Apply Now!
      </p>
      <div className="grid grid-cols-6 mx-7 mt-6 gap-x-4">
        <div className="col-span-2">
          <div className="h-[80px] rounded-md bg-gray-200 overflow-hidden">
            <Image
              className="hidden"
              src={profileImage}
              width={0}
              height={0}
              alt="company image"
            />
          </div>
        </div>
        <div className="col-span-4">
          <h6 className="font-semibold text-indigo-dye">Accounting Officer</h6>
          <h6 className="text-sm text-indigo-dye leading-4">
            The ABBA Initiative
          </h6>
          <button
            type="button"
            className="rounded-md bg-[#6F829B] w-full px-3.5 py-2.5 text-sm text-white shadow-sm hover:bg-indigo-200 mt-[18px]"
          >
            Status: For Review
          </button>
          <p className="text-[#ACB9CB] text-[11px] text-center mt-1 mb-5">
            Status as of Apr 7, 2023 08:53 am
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardRecentApp;
