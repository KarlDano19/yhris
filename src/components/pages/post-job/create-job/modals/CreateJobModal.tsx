import { Dispatch, Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { T_CreateJob } from "@/types/globals";
import DateCalendarDummy from "@/svg/DateCalendarDummy";
import SelectChevronDown from "@/svg/SelectChevronDownDummy";
import SalaryRangeModal from "./SalaryRangeModal";
import CreateJobPageOne from "./ModalPages/CreateJobPageOne";
import CreateJobPageTwo from "./ModalPages/CreateJobPageTwo";
import CreateJobPageThree from "./ModalPages/CreateJobPageThree";
import CreateJobPageFour from "./ModalPages/CreateJobPageFour";
import { CREATEJOB_TEMPLATE } from "@/helpers/constants";
import CreateJobPageFive from "./ModalPages/CreateJobPageFive";
import CreateJobPageSix from "./ModalPages/CreateJobPageSix";
import CreateJobPageSeven from "./ModalPages/CreateJobPageSeven";
import CreateJobPageEight from "./ModalPages/CreateJobPageEight";
import CustomToast from "@/components/CustomToast";

export default function CreateJobModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const { register, handleSubmit, watch, setValue, getValues, trigger, setFocus, reset } =
    useForm<T_CreateJob>({
      defaultValues: {
        country: "Philippines",
        language: "English",
        salary: {
          salaryType: "Range",
        },
        rate: "Monthly",
        jobDescription: CREATEJOB_TEMPLATE[0],
      },
    });

  const [pageNumber, setPageNumber] = useState(1);
  const [isSalaryRangeModalOpen, setIsSalaryRangeModalOpen] = useState(false);
  const [isCreateJobPageEightModalOpen, setIsCreateJobPageEightModalOpen] =
    useState(false);
  const [isRangeBenefitsAdded, setIsRangeBenefitsAdded] = useState(false);
  const cancelButtonRef = useRef(null);

  const onSubmit = handleSubmit((data: T_CreateJob) => {
    console.log('dataToBeAdded', data);
    setPageNumber(1);
    setIsOpen(false);
    setIsSalaryRangeModalOpen(false);
    reset();
  });

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setIsOpen}
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
                      Job No. 1
                    </h3>
                    <XCircleIcon
                      className="w-8 h-8 text-white cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    />
                  </div>
                  <form onSubmit={onSubmit}>
                    {pageNumber == 1 && (
                      <CreateJobPageOne
                        register={register}
                        setPageNumber={setPageNumber}
                        trigger={trigger}
                      />
                    )}
                    {pageNumber == 2 && (
                      <CreateJobPageTwo
                        setIsSalaryRangeModalOpen={setIsSalaryRangeModalOpen}
                        watch={watch}
                        setValue={setValue}
                        register={register}
                        setPageNumber={setPageNumber}
                        trigger={trigger}
                        getValues={getValues}
                        setFocus={setFocus}
                      />
                    )}
                    {pageNumber == 3 && (
                      <CreateJobPageThree
                        watch={watch}
                        setValue={setValue}
                        onSubmit={onSubmit}
                        register={register}
                        trigger={trigger}
                        setPageNumber={setPageNumber}
                        setFocus={setFocus}
                        getValues={getValues}
                      />
                    )}
                    {pageNumber == 4 && (
                      <CreateJobPageFour
                        setValue={setValue}
                        getValues={getValues}
                        register={register}
                        setPageNumber={setPageNumber}
                      />
                    )}
                    {pageNumber == 5 && (
                      <CreateJobPageFive
                        setValue={setValue}
                        watch={watch}
                        register={register}
                        setPageNumber={setPageNumber}
                        getValues={getValues}
                        isRangeBenefitsAdded={isRangeBenefitsAdded}
                      />
                    )}
                    {pageNumber == 6 && (
                      <CreateJobPageSix
                        getValues={getValues}
                        setValue={setValue}
                        watch={watch}
                        register={register}
                        setPageNumber={setPageNumber}
                      />
                    )}
                    {pageNumber == 7 && (
                      <CreateJobPageSeven
                        setValue={setValue}
                        watch={watch}
                        register={register}
                        setPageNumber={setPageNumber}
                        setIsCreateJobPageEightModalOpen={
                          setIsCreateJobPageEightModalOpen
                        }
                        setParentOpen={setIsOpen}
                        onSubmit={onSubmit}
                      />
                    )}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <CreateJobPageEight
        isOpen={isCreateJobPageEightModalOpen}
        setIsOpen={setIsCreateJobPageEightModalOpen}
      />
      <SalaryRangeModal
        setPageNumber={setPageNumber}
        isOpen={isSalaryRangeModalOpen}
        setIsOpen={setIsSalaryRangeModalOpen}
        setIsRangeBenefitsAdded={setIsRangeBenefitsAdded}
      />
    </>
  );
}
