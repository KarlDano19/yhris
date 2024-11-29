import { useState, useCallback } from "react";

import Image from "next/image";

import { UseFormRegister } from "react-hook-form";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";

interface ProfileTabProps {
  register: UseFormRegister<any>;
  handleSubmit: any;
  firstSubmit: any;
  setCurrentTab: any;
}

const ProfileTab = ({
  register,
  handleSubmit,
  firstSubmit,
  setCurrentTab,
}: ProfileTabProps) => {
  const [profilePhotoList, setProfilePhotoList] = useState<FileList | null>(null);
  const compressImage = useCallback(
    (
      file: File,
      maxWidth: number,
      maxHeight: number,
      quality: number
    ): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = document.createElement("img");
          img.src = event.target?.result as string;
          img.onload = () => {
            const elem = document.createElement("canvas");
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
            elem.width = width;
            elem.height = height;
            const ctx = elem.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const dataUrl = elem.toDataURL("image/jpeg", quality);
              resolve(dataUrl);
            } else {
              reject(new Error("Failed to get canvas context"));
            }
          };
          img.onerror = () => reject(new Error("Image loading error"));
        };
        reader.onerror = () => reject(new Error("File reading error"));
      });
    },
    []
  );

  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    
    if (!mimeMatch) {
      throw new Error("Invalid data URL: MIME type not found");
    }

    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  };

  const dataURLtoFileList = (dataUrl: string, filename: string): FileList => {
    const file = dataURLtoFile(dataUrl, filename);
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
  };

  const renderUploadPhoto = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      try {
        const compressedImage = await compressImage(
          event.target.files[0],
          1920,
          1080,
          0.7
        );
        const fileList = dataURLtoFileList(compressedImage, event.target.files[0].name);
        setProfilePhotoList(fileList);
      } catch (error) {
        console.error("Error compressing image:", error);
        toast.custom(
          () => <CustomToast message="Error processing image" type="error" />,
          {
            duration: 7000,
          }
        );
      }
    }
  };

  const profileSubmit = handleSubmit((data: any) => {
    const formData = {
      ...data,
      profilePicture: profilePhotoList ? profilePhotoList : [],
    };
    firstSubmit(formData);
  });

  return (
    <form onSubmit={profileSubmit}>
      <h5 className="text-xl font-semibold">Profile</h5>
      <div className="grid lg:grid-cols-7 gap-x-8 mt-7">
        <div className="lg:col-span-1">
          <div className="overflow-hidden h-[155px] w-36 md:w-auto md:max-w-[150px] mx-auto md:mx-0 md:cols-span-1 lg:col-span-3 flex items-center justify-center">
            <Image
              src={profilePhotoList ? URL.createObjectURL(profilePhotoList[0]) : "/assets/no-user.png"}
              width={143}
              height={155}
              priority={true}
              alt="profile-logo"
              className="rounded object-cover max-w-[143px] h-[155px]"
            />
          </div>
        </div>
        <div className="lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
          <div className="grid-item">
            <label
              htmlFor="first-name"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              First Name<span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                {...register("firstName", { required: true })}
                id="first-name"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <label
              htmlFor="middle-name"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              Middle Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                {...register("middleName")}
                id="middle-name"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <label
              htmlFor="last-name"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              Last Name<span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                {...register("lastName", { required: true })}
                id="last-name"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              Email Address<span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="email"
                {...register("email", { required: true })}
                id="email"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <label
              htmlFor="mobile-no"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              Mobile No.<span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="tel"
                {...register("mobileNo", { required: true })}
                id="mobile-no"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <label
              htmlFor="address"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              City Address (Please provide your current city address)
              <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                {...register("address", { required: true })}
                id="address"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 mt-11">
        <div className="grid-item">
          <h6 className="block text-sm font-medium leading-6 text-gray-900">
            Photo (2x2 photo is recommended)
          </h6>
          <div className="mt-2">
            <input
              type="file"
              {...register("profilePicture", {
                onChange: (e: any) => {
                  const file = e.target.files[0];
                  if (file && file.size > 5 * 1024 * 1024) {
                    toast.custom(
                      () => (
                        <CustomToast
                          message="Photo size should not exceed 5 MB"
                          type="error"
                        />
                      ),
                      {
                        duration: 7000,
                      }
                    );
                    e.target.value = null;
                  } else {
                    renderUploadPhoto(e);
                  }
                },
              })}
              id="profile-picture"
              className="rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4 focus:ring-black"
              accept="image/png, image/jpeg, image/jpg"
            />
            <h6 className="text-xs mt-3">Maximum file size: 5 MB</h6>
          </div>
        </div>
        <div className="grid-item">
          <h6 className="block text-sm font-medium leading-6 text-gray-900">
            Curriculum Vitae/Resume (Optional)
          </h6>
          <div className="mt-2">
            <input
              type="file"
              {...register("resume", {
                onChange: (e: any) => {
                  const file = e.target.files[0];
                  if (file && file.size > 5 * 1024 * 1024) {
                    toast.custom(
                      () => (
                        <CustomToast
                          message="Curriculum Vitae/Resume size should not exceed 5 MB"
                          type="error"
                        />
                      ),
                      {
                        duration: 7000,
                      }
                    );
                    e.target.value = null;
                  }
                },
              })}
              id="resume"
              className="rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4"
              accept="application/pdf"
            />
            <h6 className="text-xs mt-3">Maximum file size: 5 MB</h6>
          </div>
        </div>
        <div className="grid-item">
          <label
            htmlFor="portfolio"
            className="text-sm font-medium leading-6 text-gray-900"
          >
            Portfolio (Optional)
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("portfolio")}
              id="portfolio"
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="w-full md:w-auto mt-10 md:mt-12 mb-7 rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          NEXT
        </button>
      </div>
    </form>
  );
};

export default ProfileTab;