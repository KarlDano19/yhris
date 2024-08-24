"use client";

import { use, useEffect, useState } from "react";
import { useQueryClient } from '@tanstack/react-query';
import ProfileTab from "./profile/Tab";
import ContactsTab from "./contacts/Tab";
import ProfDetailTab from "./prof-details/Tab";
import DocumentsTab from "./documents/Tab";
import WelcomeModal from "./modals/WelcomeModal";
import SuccessPopAlert from "@/components/SuccessPopAlert";
import AskProfModal from "./modals/AskProfModal";
import AskDocumentModal from "./modals/AskDocumentModal";
import { useForm ,FormProvider} from "react-hook-form";
import { toast } from "react-hot-toast";
import useSaveApplicantProfile from "./hooks/useSaveApplicantProfile";
import { T_ApplicantProfile } from "@/types/globals";



const Content = () => {
  const queryClient = useQueryClient();
  const cachedApplicantProfile = queryClient.getQueryCache().find(['applicantProfileCache']);
  const { register, setValue, watch, handleSubmit } = useForm<T_ApplicantProfile>();
  const [isWelcomeModal, setWelcomeModal] = useState(false);
  const [openSuccessAlert, setSuccessAlert] = useState(false);
  const [setupProfDetails, setProfDetails] = useState(false);
  const [openProfDetailsModal, setProfDetailsModal] = useState(false);
  const [setupDocuments, setDocuments] = useState(false);
  const [openDocumentsModal, setDocumentsModal] = useState(false);

  const [currentTab, setCurrentTab] = useState(1);
  const cachedApplicantData: any = cachedApplicantProfile?.state?.data;
  const {mutate, isLoading} = useSaveApplicantProfile(cachedApplicantData?.id);

  
  const submitProfile=(data: any)=>{
    setCurrentTab(currentTab + 1);
    console.log(data)
    }

    const submitContact=(data: any)=>{
      if (currentTab === 2 && setupProfDetails === false) {
        setProfDetailsModal(true);
      }else{
        setCurrentTab(currentTab + 1);
      }
      console.log(data)
      }
      const submitProfDetails=(data: any)=>{
        if (currentTab === 3 && setupDocuments === false) {
          setDocumentsModal(true);
        }else{
          setCurrentTab(currentTab + 1);
        }
        console.log(data)
        }

        const finalSubmit = (data:any)=>{
          console.log(data)
          const callBackReq = {
            onSuccess: (data: any) => {
               if(!data.error){
                toast.success("Applicant Profile Successfully Created")
               }
            },
            onError: (err: any) => {
              //toast.error(String(err)) //uncooment this if backend is ready
              toast.success("Applicant Profile Successfully Created") //remove this when backend is ready
            },
          }
            mutate(data,callBackReq)
        }
    const method = useForm();
  const nextTab = () => {
    if (currentTab === 2 && setupProfDetails === false) {
      setProfDetailsModal(true);
    } else if (currentTab === 3 && setupDocuments === false) {
      setDocumentsModal(true);
    }else{
      setCurrentTab(currentTab + 1);
    }
  };

  const renderButtons=()=>(
    <div
            className={`${
              currentTab <= 1 ? "justify-end" : "justify-between"
            } md:flex mt-10 md:mt-12 mb-7`}
          >
            <button
              type="button"
              className={`${
                currentTab <= 1 ? "hidden" : ""
              } w-full mb-5 md:mb-0 md:w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              onClick={prevTab}
            >
              BACK
            </button>
            <button
              type="submit"
              className="w-full md:w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              // onClick={nextTab}
            >
              {currentTab < 4 ? "NEXT" : (
                isLoading ? (
                  <div
                    className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2"
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  "Submit"
                )
              )}
            </button>
          </div>
  )
  const prevTab = () => {
    if (currentTab > 1) {
      setCurrentTab(currentTab - 1);
    }
  };

  useEffect(() => {
    setWelcomeModal(true);
  }, []);

  return (
    <div
      className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 `}
    >
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
            {currentTab === 2 ? (
              <FormProvider {...method}>
                <form onSubmit={method.handleSubmit(submitContact)}>
              <ContactsTab />
              {renderButtons()}
              </form>
              </FormProvider>
            ) : currentTab === 3 ? (
              <FormProvider {...method}>
                <form onSubmit={method.handleSubmit(submitProfDetails)}>
              <ProfDetailTab />
              {renderButtons()}
              </form>
              </FormProvider>
            ) : currentTab === 4 ? (
              <FormProvider {...method}>
                <form onSubmit={method.handleSubmit(finalSubmit)}>
              <DocumentsTab />
              {renderButtons()}
              </form>
              </FormProvider>
            ) : (
              <FormProvider {...method}>
              <form onSubmit={method.handleSubmit(submitProfile)}>
              <ProfileTab />
              {renderButtons()}
              </form>
              </FormProvider>
            )}
          </div>
          
        </div>
      </div>
      <WelcomeModal
        open={isWelcomeModal}
        onSuccess={() => setSuccessAlert(true)}
        onClose={() => setWelcomeModal(false)}
      />
      <AskProfModal
        open={openProfDetailsModal}
        onAgree={() => {
          setProfDetails(true);
          setCurrentTab(currentTab + 1);
        }}
        onClose={() => setProfDetailsModal(false)}
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
