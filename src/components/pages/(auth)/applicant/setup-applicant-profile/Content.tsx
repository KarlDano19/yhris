"use client";

import { use, useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-hot-toast";

import useSaveApplicantProfile from "./hooks/useSaveApplicantProfile";

import CustomToast from '@/components/CustomToast';
import ProfileTab from "./profile/Tab";
import ContactsTab from "./contacts/Tab";
import ProfDetailTab from "./prof-details/Tab";
import DocumentsTab from "./documents/Tab";
import WelcomeModal from "./modals/WelcomeModal";
import SuccessPopAlert from "@/components/SuccessPopAlert";
import AskDocumentModal from "./modals/AskDocumentModal";

import { T_ApplicantProfile } from "@/types/globals";

const Content = () => {
  const queryClient = useQueryClient();
  const cachedApplicantProfile = queryClient
    .getQueryCache()
    .find(["applicantProfileCache"]);
  const { register, setValue, watch, handleSubmit, getValues, reset } = useForm<T_ApplicantProfile>();
  const [isWelcomeModal, setWelcomeModal] = useState(false);
  const [openSuccessAlert, setSuccessAlert] = useState(false);
  const [setupProfDetails, setProfDetails] = useState(false);
  const [openProfDetailsModal, setProfDetailsModal] = useState(false);
  const [setupDocuments, setDocuments] = useState(false);
  const [openDocumentsModal, setDocumentsModal] = useState(false);
  const [profileData, setProfileData] = useState<T_ApplicantProfile | null>(
    null
  );

  const [currentTab, setCurrentTab] = useState(1);
  const cachedApplicantData: any = cachedApplicantProfile?.state?.data;
  const { mutate, isLoading } = useSaveApplicantProfile(
    cachedApplicantData?.id
  );

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type="success" />, { duration: 4000 });
        setCurrentTab(1);
        reset();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type="error" />, { duration: 4000 });
      },
    };
    mutate(data, callbackReq);
  })

  useEffect(() => {
    setWelcomeModal(true);
  }, []);

  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 `}>
      <SuccessPopAlert
        message="Successfully uploaded document."
        open={openSuccessAlert}
        onClose={() => setSuccessAlert(false)}
      />
      <div className="p-4">
        <h3 className="text-2xl text-indigo-dye font-semibold">
          Tell us more about you!
        </h3>
        <div className="md:mx-5">
          {/* Tab header section */}
          <div className="mt-5">
            <div className="sm:hidden">
              <h5 className="text-savoy-blue text-center text-lg font-semibold">
                {currentTab === 2
                  ? "Contacts"
                  : currentTab === 3
                  ? "Professional Details"
                  : currentTab === 4
                  ? "Documents"
                  : "Profile"}
              </h5>
            </div>
            <div className="hidden sm:block">
              <div className="md:w-[82%] lg:w-[84%] mx-auto translate-y-[10px]">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className={`${
                      currentTab === 2
                        ? "w-[28%]"
                        : currentTab === 3
                        ? "w-[63%]"
                        : currentTab === 4
                        ? "w-full"
                        : "w-0"
                    } bg-blue-600 h-1 rounded-full`}
                  ></div>
                </div>
              </div>
              <div className="border-t-4 border-gray-300 mx-24 w-auto mb-3 translate-y-[23px] hidden"></div>
              <nav
                className="-mb-px flex relative justify-between w-[90%] mx-auto"
                aria-label="Tabs"
              >
                <li
                  className={`text-center text-sm font-semibold list-none flex flex-col items-center text-savoy-blue`}
                >
                  <div className="bg-white px-2">
                    <div
                      className={`h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center border-savoy-blue`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full bg-savoy-blue`}
                      ></div>
                    </div>
                  </div>
                  Profile
                </li>
                <li
                  className={`
                    ${
                      currentTab >= 2 && currentTab <= 4
                        ? "text-savoy-blue"
                        : "text-gray-500"
                    } text-center text-sm font-semibold list-none flex flex-col items-center`}
                >
                  <div className="bg-white px-2">
                    <div
                      className={`${
                        currentTab >= 2 && currentTab <= 4
                          ? "border-savoy-blue"
                          : "border-gray-300"
                      } h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center`}
                    >
                      <div
                        className={`${
                          currentTab >= 2 && currentTab <= 4
                            ? "bg-savoy-blue"
                            : "bg-gray-300"
                        } h-2 w-2 rounded-full`}
                      ></div>
                    </div>
                  </div>
                  Contacts
                </li>
                <li
                  className={`
                    ${
                      currentTab >= 3 && currentTab <= 4
                        ? "text-savoy-blue"
                        : "text-gray-500"
                    } text-center text-sm font-semibold list-none flex flex-col items-center`}
                >
                  <div className="bg-white px-2">
                    <div
                      className={`${
                        currentTab >= 3 && currentTab <= 4
                          ? "border-savoy-blue"
                          : "border-gray-300"
                      } h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center`}
                    >
                      <div
                        className={`${
                          currentTab >= 3 && currentTab <= 4
                            ? "bg-savoy-blue"
                            : "bg-gray-300"
                        } h-2 w-2 rounded-full`}
                      ></div>
                    </div>
                  </div>
                  Professional Details
                </li>
                <li
                  className={`
                    ${
                      currentTab === 4 ? "text-savoy-blue" : "text-gray-500"
                    } text-center text-sm font-semibold list-none flex flex-col items-center`}
                >
                  <div className="bg-white px-2">
                    <div
                      className={`${
                        currentTab === 4
                          ? "border-savoy-blue"
                          : "border-gray-300"
                      } h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center`}
                    >
                      <div
                        className={`${
                          currentTab === 4 ? "bg-savoy-blue" : "bg-gray-300"
                        } h-2 w-2 rounded-full`}
                      ></div>
                    </div>
                  </div>
                  Documents
                </li>
              </nav>
            </div>
          </div>
          <div>
            {currentTab === 1 && (
              <ProfileTab
                {...{
                  register,
                  setValue,
                  handleSubmit,
                  setCurrentTab,
                }}
              />
            )}
            {currentTab === 2 && (
              <ContactsTab
                {...{
                  register,
                  watch,
                  setValue,
                  onSubmit,
                  setCurrentTab,
                }}
              />
            )}
            {currentTab === 3 && (
              <ProfDetailTab
                {...{
                  register,
                  watch,
                  setValue,
                  handleSubmit,
                  setCurrentTab,
                }}
              />
            )}
            {currentTab === 4 && (
              <DocumentsTab
                {...{
                  register,
                  watch,
                  setValue,
                  handleSubmit,
                  setCurrentTab,
                }}
              />
            )}
          </div>
        </div>
      </div>
      <WelcomeModal
        open={isWelcomeModal}
        onSuccess={() => setSuccessAlert(true)}
        onClose={() => setWelcomeModal(false)}
      />
      <AskDocumentModal
        open={openDocumentsModal}
        onAgree={() => {
          setDocuments(true);
          setCurrentTab(currentTab + 1);
        }}
        onClose={() => setDocumentsModal(false)}
      />
    </div>
  );
};

export default Content;
