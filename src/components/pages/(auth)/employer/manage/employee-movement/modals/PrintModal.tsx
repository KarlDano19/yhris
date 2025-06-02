import { Dispatch, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import html2canvas from 'html2canvas';

import useGetAddPersonelMovementDetails from "../hooks/useGetAddPersonelMovementDetails";
import useGetPersonnelMovementApprovals from "../hooks/useGetPersonnelMovementApprovals";
import EmployeeProfilePrint from "./print/EmployeeProfilePrint";
import ReccomendationPrint from "./print/ReccomendationPrint";

import { XCircleIcon, PrinterIcon } from "@heroicons/react/24/solid";

type T_ModalData = {
  id: number;
  open: boolean;
};

function PrintModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { register, control, setValue, watch } = useForm();
  const { data: personelMovementData, refetch: refetchPersonelMovement, remove: removePersonelMovement } = useGetAddPersonelMovementDetails(isOpen.id);
  const { approvals, currentUserApproval, refetch: refetchApprovals } = useGetPersonnelMovementApprovals(isOpen.id);

  useEffect(() => {
    if (isOpen) {
      refetchPersonelMovement();
      refetchApprovals();
    }
  }, [isOpen]);

  useEffect(() => {
    if (personelMovementData) {
      personelMovementData['created_at'] = Intl.DateTimeFormat('en-US').format(new Date(personelMovementData.created_at));
    }
  }, [personelMovementData]);

  useEffect(() => {
    if (personelMovementData) {
      setValue("id", personelMovementData.id);
      setValue("created_at", personelMovementData.created_at);
      setValue("date", personelMovementData.date);
      setValue("employee", personelMovementData.employee);
      setValue("current_position", personelMovementData.current_position);
      setValue("new_position", personelMovementData.new_position);
      setValue("reason", personelMovementData.reason);
      setValue("status", personelMovementData.status);
      setValue("processed_by", personelMovementData.processed_by);
      setValue("start_date", personelMovementData.start_date);
      setValue("proposed_rate", personelMovementData.proposed_rate);
      setValue("percentage_increase", personelMovementData.percentage_increase);
      setValue('approvals', personelMovementData.approvals);
    }
  }, [personelMovementData]);

  useEffect(() => {
    if (currentUserApproval) {
      setValue("recommendation", currentUserApproval.recommendation || "");
      setValue("signature", currentUserApproval.signature || "");
    }
  }, [currentUserApproval]);
  
  const customCloseModal = () => {
    removePersonelMovement();
    setIsOpen(null);
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Create a new div element
    const printDiv = document.createElement('div');

    // Copy the content of the printRef
    if (printRef.current) {
      printDiv.innerHTML = printRef.current.innerHTML;
    }

    // Style the new div to be off-screen
    printDiv.style.width = '1080px';
    printDiv.style.height = '100%';
    printDiv.style.position = 'absolute';
    printDiv.style.left = '-9999px';
    printDiv.style.top = '-9999px';

    // Add the new div to the body
    document.body.appendChild(printDiv);

    // Use html2canvas on the new div
    html2canvas(printDiv).then((canvas) => {
      // Remove the temporary div
      document.body.removeChild(printDiv);

      const imgData = canvas.toDataURL('image/png');
      const newWindow = window.open('', '_blank');
      newWindow?.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Personal Movement Form (PMF)</title>
            <style>
              body { 
                padding: 20px;
                font-family: Arial, sans-serif;
              }
              @media print {
                body { 
                  padding: 0;
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" style="width:100%;height:auto;">
          </body>
        </html>
      `);
      
      newWindow?.document.close();
      
      // Wait for content to load before printing
      setTimeout(() => {
        newWindow?.print();
        newWindow?.close();
      }, 500);
    });
  };

  return (
    <Transition.Root show={isOpen.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => customCloseModal()}
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
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Print Personal Movement Form (PMF)
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePrint(e);
                      }}
                      className="p-1 text-white hover:bg-savoy-blue/80 rounded"
                    >
                      <PrinterIcon className="w-6 h-6" />
                    </button>
                    <XCircleIcon
                      className="w-8 h-8 text-white cursor-pointer"
                      onClick={() => customCloseModal()}
                    />
                  </div>
                </div>
                <div ref={printRef} className="p-4">
                  <EmployeeProfilePrint
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    register={register}
                    handleSubmit={() => {}}
                    isLoading={false}
                    isEdit={false}
                  />
                  <ReccomendationPrint
                    onSubmit={() => {}}
                    approvals={approvals}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default PrintModal;
