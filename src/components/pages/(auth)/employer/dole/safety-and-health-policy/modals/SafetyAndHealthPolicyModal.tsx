import {
  Dispatch,
  Fragment,
  useRef,
  useEffect,
  useState,
  useMemo,
} from "react";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import "react-quill/dist/quill.snow.css";
import { XCircleIcon } from "@heroicons/react/24/solid";

import CustomToast from "@/components/CustomToast";
import SendEmailModal from "@/components/SendEmailModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import useGetSafetyAndHealthPolicyDetails from "../hooks/useGetSafetyANdHelathPolicyDetails";
import useUpdateSafetyAndHealthPolicy from "../hooks/useUpdateSafetyAndHealthPolicy";
import useSendEmail from "../hooks/useSendEmail";
import SafetyAndHealthPolicyAttachmentSection from "../components/SafetyAndHealthPolicyAttachmentSection";
import { ENHANCED_QUILL_MODULES, ENHANCED_QUILL_FORMATS } from "./helper/CustomQuill";
import "../styles.css";

import EditIcon from "@/svg/EditIcon";
import EmailLogo from "@/svg/EmailLogo";
import PrintIcon from "@/svg/PrintIcon";
import SelectChevronDown from "@/svg/SelectChevronDown";

import classNames from "@/helpers/classNames";

interface cachedRigthsData {
  name: string;
  type_of_industry: string;
}

type T_ModalData = {
  open: boolean;
};

type FormValues = {
  body: string;
};

function SafetyAndHealthPolicyModal({
  companyName,
  isOpen,
  setIsOpen,
  hasActiveSubscription,
}: {
  companyName: string;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  hasActiveSubscription: boolean;
}) {
  const cancelButtonRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        body: "",
      },
    });

  const [safetyAndHealthPolicyId, setSafetyAndHealthPolicyId] = useState<
    number | null
  >(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const cachedRigths = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };

  const [isSendEmailModalOpen, setIsSendEmailModalOpen] =
    useState<T_ModalData | null>(null);
  
  // Email-specific state
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentExist, setAttachmentExist] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const {
    data: safetyAndHealthPolicyDetails,
    refetch: refetchSafetyAndHealthPolicyDetails,
  } = useGetSafetyAndHealthPolicyDetails();

  useEffect(() => {
    if (isEdit) {
      refetchSafetyAndHealthPolicyDetails();
    }
  }, [isEdit, refetchSafetyAndHealthPolicyDetails]);

  const { mutateAsync: updateMutate, isLoading } = useUpdateSafetyAndHealthPolicy();
  const { mutate: sendEmailMutate, isLoading: isEmailLoading } = useSendEmail();

  const statusOptions = [
    { value: 'on-schedule', label: 'On Schedule', color: 'bg-purple-100 text-purple-700' },
    { value: 'for-submission', label: 'For Submission', color: 'bg-blue-100 text-blue-700' },
    { value: 'for-review', label: 'For Review', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-700' },
  ];

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateMutate({
        data: { 
          id: safetyAndHealthPolicyDetails?.id,
          status: newStatus 
        }
      });
      
      toast.custom(() => <CustomToast message='Status updated successfully.' type='success' />, { duration: 3000 });
      refetchSafetyAndHealthPolicyDetails();
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error || 'Failed to update status.'} type='error' />, { duration: 5000 });
    }
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-600';
  };

  // Email-specific handlers
  const handleViewAttachment = (url: string) => {
    window.open(url, '_blank');
  };

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.custom(() => <CustomToast message='File size must be less than 5MB.' type='error' />, { duration: 2000 });
        return;
      }
      setAttachment(file);
      setAttachmentExist(true);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setAttachmentExist(false);
  };

  const handleDeleteAttachment = async () => {
    setIsDeleting(true);
    try {
      // Use the existing updateMutate to delete attachment with explicit null
      await updateMutate({
        data: { 
          id: safetyAndHealthPolicyDetails?.id,
          attachment: null // This will clear the attachment
        }
      });
      
      toast.custom(() => <CustomToast message='Attachment deleted successfully.' type='success' />, { duration: 3000 });
      refetchSafetyAndHealthPolicyDetails();
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error?.message || 'Failed to delete attachment.'} type='error' />, { duration: 5000 });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Use the existing updateMutate to trigger PDF generation
      await updateMutate({
        data: { 
          id: safetyAndHealthPolicyDetails?.id,
          regenerate_pdf: true 
        }
      });
      
      toast.custom(() => <CustomToast message='PDF generated successfully.' type='success' />, { duration: 3000 });
      await refetchSafetyAndHealthPolicyDetails();
      
      // If we're not in the send email modal, open it after successful PDF generation
      if (!isSendEmailModalOpen) {
        setIsSendEmailModalOpen({
          open: true,
        });
      }
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error?.message || 'Failed to generate PDF.'} type='error' />, { duration: 5000 });
    } finally {
      // Add 5-second timeout to prevent spam
      setTimeout(() => {
        setIsGeneratingPDF(false);
      }, 5000);
    }
  };

  const handleEmailSubmit = (data: any) => {
    if (isSendEmailModalOpen && isSendEmailModalOpen.open) {
      const payload = new FormData();
      payload.append('to', JSON.stringify(data.email));
      payload.append('subject', data.subject);
      payload.append('context', data.message);
      if (data.cc && data.cc.length > 0) payload.append('cc', JSON.stringify(data.cc));
      if (data.bcc && data.bcc.length > 0) payload.append('bcc', JSON.stringify(data.bcc));
      
      // Include attachment if present
      if (data.attachment) {
        payload.append('attachment', data.attachment);
      } else if (attachment) {
        payload.append('attachment', attachment);
      }

      const callbackReq = {
        onSuccess: () => {
          setIsSendEmailModalOpen(null);
          refetchSafetyAndHealthPolicyDetails();
          setAttachment(null);
          setAttachmentExist(false);
          toast.custom(() => <CustomToast message='Email sent successfully.' type='success' />, { duration: 3000 });
        },
        onError: (err: any) => {
          const errorMessage = err?.message || err?.response?.data?.message || 'Failed to send email.';
          toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 5000 });
        }
      };
      
      sendEmailMutate(payload, callbackReq);
    }
  };

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: () => {
        setIsEdit(false);
        reset();
        refetchSafetyAndHealthPolicyDetails();
      },
      onError: (err: any) => {
        const errorMessage = err.message || "An unexpected error occurred.";
        toast.custom(
          () => <CustomToast message={errorMessage} type="error" />,
          {
            duration: 7000,
          }
        );
      },
    };
    updateMutate(
      { data: { ...data, id: safetyAndHealthPolicyId } },
      callbackReq
    );
  });

  const onEditClick = () => {
    setIsEdit(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    // Check if we came from analytics page
    const fromAnalytics = searchParams.get('from') === 'analytics';
    if (fromAnalytics) {
      router.push('/analytics?tab=3');
    }
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                  <div className="flex bg-savoy-blue p-2 items-center">
                    <h3 className="flex-1 text-white ml-2 font-semibold">
                      Safety and Health Policy
                    </h3>
                    <XCircleIcon
                      className="w-8 h-8 text-white cursor-pointer"
                      onClick={handleCloseModal}
                    />
                  </div>
                  <div className="flex space-x-2 justify-end pr-6 pt-4">
                    <div className='relative inline-block'>
                      <select
                        value={safetyAndHealthPolicyDetails?.status || 'on-schedule'}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={!cachedRigths?.state?.data?.edit_dole_safety_health_policy}
                        className={`px-4 py-2 rounded-lg text-sm font-bold ${getStatusColor(safetyAndHealthPolicyDetails?.status || 'on-schedule')} border-0 focus:ring-0 disabled:opacity-50 appearance-none pr-8`}
                      >
                        {statusOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            style={{
                              backgroundColor: 'white',
                              color: '#111827'
                            }}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                        <SelectChevronDown />
                      </div>
                    </div>
                    <button
                      onClick={() => onEditClick()} // Pass the specific policy ID
                      disabled={!cachedRigths?.state?.data?.edit_dole_safety_health_policy || !hasActiveSubscription}
                      data-edit-button
                      className={classNames(!hasActiveSubscription && 'opacity-50 pointer-events-none', 'disabled:opacity-50 disabled:pointer-events-none')}
                    >
                      <EditIcon />
                    </button>
                    {!safetyAndHealthPolicyDetails?.attachment && (
                      <button 
                        onClick={handleGeneratePDF} 
                        data-print-button 
                        disabled={!hasActiveSubscription || isGeneratingPDF} 
                        className={classNames(!hasActiveSubscription && 'opacity-50 pointer-events-none', 'disabled:opacity-50 disabled:pointer-events-none')}
                        title="Generate PDF"
                      >
                        {isGeneratingPDF ? (
                          <LoadingSpinner size="sm" color="yellow" />
                        ) : (
                          <PrintIcon />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setIsSendEmailModalOpen({
                          open: true,
                        })
                      }
                      // disabled={!cachedRigths?.state?.data?.send_email_dole_safety_health_policy || !hasActiveSubscription}
                      data-email-button
                      className={classNames(!hasActiveSubscription && 'opacity-50 pointer-events-none', 'disabled:opacity-50 disabled:pointer-events-none')}
                    >
                      <EmailLogo />
                    </button>
                  </div>
                  {isEdit ? (
                    safetyAndHealthPolicyDetails && (
                      <form onSubmit={onSubmit}>
                        <div className="px-4 pt-4 pb-6">
                          <div className="sm:col-span-4 mt-4">
                            <label
                              htmlFor="message"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Message<span className="text-red-600">*</span>
                            </label>
                            <div className="mt-2 h-72 mb-12">
                              <textarea
                                rows={4}
                                {...register("body", { required: true })}
                                id="message"
                                hidden
                              />
                              <ReactQuill
                                onChange={(value) => setValue("body", value)}
                                formats={ENHANCED_QUILL_FORMATS}
                                modules={ENHANCED_QUILL_MODULES}
                                style={{
                                  height: "100%",
                                  padding: "5px 8px !important",
                                }}
                                value={
                                  watch("body") ||
                                  safetyAndHealthPolicyDetails.body
                                } // Use fetched details
                                className="quill-editor-container"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4">
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
                            disabled={isLoading}
                          >
                            {isLoading && (
                              <div role="status">
                                <svg
                                  aria-hidden="true"
                                  className="inline w-6 h-6 mr-2 text-gray-200 animate-spin fill-blue-600"
                                  viewBox="0 0 100 101"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                  />
                                </svg>
                                <span className="sr-only">Loading...</span>
                              </div>
                            )}
                            {!isLoading && "Update"}
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => setIsEdit(false)}
                            ref={cancelButtonRef}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )
                  ) : (
                    <>
                      <div className="border border-gray-200 rounded-lg mx-6 my-6">
                        <div className="px-4 pb-6">
                          <div id="pdf-content" className="sm:col-span-4 mt-4">
                            <div
                              className="policy-content"
                              dangerouslySetInnerHTML={{
                                __html: safetyAndHealthPolicyDetails?.body.replace(
                                  /{{company_name}}/g,
                                  companyName
                                ),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-6">
                      <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-6 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={handleCloseModal}
                            ref={cancelButtonRef}
                          >
                            Close
                          </button>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
          
          {isSendEmailModalOpen && (
            <SendEmailModal
              title="Send Safety and Health Policy"
              isOpen={!!isSendEmailModalOpen}
              onClose={() => setIsSendEmailModalOpen(null)}
              onSubmit={handleEmailSubmit}
              defaultRecipients={[]}
              showAttachment={true}
              customAttachmentSection={
                <SafetyAndHealthPolicyAttachmentSection
                  pdfAttachment={safetyAndHealthPolicyDetails?.attachment || null}
                  isDeleting={isDeleting}
                  canDelete={!!cachedRigths?.state?.data?.edit_dole_safety_health_policy}
                  onViewAttachment={handleViewAttachment}
                  onDeleteAttachment={handleDeleteAttachment}
                  onGeneratePDF={handleGeneratePDF}
                  isGeneratingPDF={isGeneratingPDF}
                  canGeneratePDF={hasActiveSubscription}
                />
              }
            />
          )}
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default SafetyAndHealthPolicyModal;
