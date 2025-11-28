"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import { SmartButton } from "@/components/SmartPermissions/SmartButton";

import { handlePrintPDF } from './PrintData';
import { getPrintAnnualMedicalReportDetails } from './hooks/useGetPrintAnnualMedicalReportDetails';
import useFileforge from "@/components/hooks/useFileforge";
import CustomToast from "@/components/CustomToast";
import LoadingSpinner from "@/components/LoadingSpinner";
import DeleteModal, { DeleteModalData } from "@/components/DeleteModal";
import ProgressModal from "@/components/ProgressModal";
import Pagination from "@/components/Pagination";
import CustomDatePicker from "@/components/CustomDatePicker";
import classNames from "@/helpers/classNames";

import useGetAnnualMedicalReportItems from "./hooks/useGetAnnualMedicalReportItems";
import useDeleteAnnualMedicalReport from "./hooks/useDeleteAnnualMedicalReport";
import useUpdateAnnualMedicalReport from "./hooks/useUpdateAnnualMedicalReport";
import useBulkDeleteAnnualMedicalReport from "./hooks/useBulkDeleteAnnualMedicalReport";
import ExportProgressModal from "./modals/ExportProgressModal";
import CreateAnnualMedicalReportModal from "./modals/CreateAnnualMedicalReportModal";
import EditAnnualMedicalReportModal from "./modals/EditAnnualMedicalReportModal";

import SelectChevronDown from "@/svg/SelectChevronDown";
import EditIcon from "@/svg/EditIcon";
import PrintIcon from "@/svg/PrintIcon";
import DeleteIcon from "@/svg/DeleteIcon";
import RBACTest from "@/components/RBACTest";


type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

type T_BulkDeleteModalData = DeleteModalData & {
  selectedCount: number;
};

function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const [
    isDeleteAnnualMedicalReportModalOpen,
    setIsDeleteAnnualMedicalReportModalOpen,
  ] = useState<T_ModalData | null>(null);
  const [
    isEditAnnualMedicalReportModalOpen,
    setIsEditAnnualMedicalReportModalOpen,
  ] = useState<T_ModalData | null>(null);
  const [
    isCreateAnnualMedicalReportModalOpen,
    setIsCreateAnnualMedicalReportModalOpen,
  ] = useState<boolean>(false);
  const [generatingItemId, setGeneratingItemId] = useState<number | null>(null);
  const [annualMedicalReportItems, setAnnualMedicalReportItems] = useState<any>([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [itemsFilter, setItemsFilter] = useState<any>({
    from: "",
    to: "",
    search: "",
  });
  
  // Bulk delete states
  const [selectedReports, setSelectedReports] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteConfirmModalOpen, setIsBulkDeleteConfirmModalOpen] = useState<DeleteModalData | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);
  
  const {
    data: annualMedicalReportData,
    isLoading: isAnnualMedicalReportLoading,
    refetch: annualMedicalReportRefetch,
  } = useGetAnnualMedicalReportItems({
    ...itemsFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });

  // Form Methods
  const createFormMethods = useForm();
  const editFormMethods = useForm();

  const updateAnnualMedicalReport = useUpdateAnnualMedicalReport();
  const { mutate: deleteAnnualMedicalReport, isLoading: isDeleteAnnualMedicalReportLoading } = useDeleteAnnualMedicalReport();
  const bulkDeleteMutation = useBulkDeleteAnnualMedicalReport();

  const { generatePDFLocally, isGenerating } = useFileforge({
    pageMargins: {
      top: '0.1in',
      right: '0.1in',
      bottom: '0.1in',
      left: '0.1in'
    },
    onSuccess: () => {
      setGeneratingItemId(null);
      toast.custom(() => <CustomToast message='PDF generated successfully.' type='success' />, { duration: 3000 });
    },
    onError: (error) => {
      setGeneratingItemId(null);
      toast.custom(() => <CustomToast message={`Failed to generate PDF: ${error.message}`} type='error' />, { duration: 5000 });
    }
  });

  const statusOptions = [
    { value: 'on-schedule', label: 'On Schedule', color: 'bg-purple-100 text-purple-700' },
    { value: 'for-submission', label: 'For Submission', color: 'bg-blue-100 text-blue-700' },
    { value: 'for-review', label: 'For Review', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-700' },
  ];

  const handleStatusChange = async (itemId: number, newStatus: string) => {
    try {
      await updateAnnualMedicalReport.mutateAsync({
        annual_medical_report_id: itemId,
        data: { status: newStatus }
      });
      
      toast.custom(() => <CustomToast message='Status updated successfully.' type='success' />, { duration: 3000 });
      annualMedicalReportRefetch();
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error || 'Failed to update status.'} type='error' />, { duration: 5000 });
    }
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-600';
  };

  const handlePrintPDFLocal = async (item: any) => {
    try {
      setGeneratingItemId(item.id);
      // Get current year for fallback
      const currentYear = new Date().getFullYear();
      
      // Use date range from filter or fallback to current year
      const reportPeriodFrom = itemsFilter.from || `January 01, ${currentYear}`;
      const reportPeriodTo = itemsFilter.to || `December 31, ${currentYear}`;

      // Fetch detailed data using the print hook's function directly
      const detailedData = await getPrintAnnualMedicalReportDetails(item.id);
      
      // Use detailed data for PDF generation
      await handlePrintPDF(detailedData, generatePDFLocally, detailedData.company_name, reportPeriodFrom, reportPeriodTo);
    } catch (error) {
      setGeneratingItemId(null);
      toast.custom(() => <CustomToast message={`Failed to generate PDF: ${error}`} type='error' />, { duration: 5000 });
    }
  };

  // Handle individual report selection
  const handleReportSelect = (reportId: number) => {
    setSelectedReports(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });
  };

  // Handle select all functionality
  const handleSelectAll = () => {
    if (!annualMedicalReportItems) return;
    
    if (selectAll) {
      setSelectedReports(new Set());
    } else {
      const allIds = annualMedicalReportItems.map((item: any) => item.id);
      setSelectedReports(new Set(allIds));
    }
  };

  // Handle bulk delete - opens confirmation modal
  const handleBulkDelete = () => {
    if (selectedReports.size === 0) return;
    setBulkDeleteCount(selectedReports.size);
    setIsBulkDeleteConfirmModalOpen({
      open: true,
    });
  };

  // Confirm the warning and open progress modal
  const confirmBulkDeleteWarning = () => {
    setIsBulkDeleteConfirmModalOpen(null);
    setIsBulkDeleteModalOpen(true);
  };

  // Perform the actual deletion (called by ProgressModal)
  const confirmBulkDelete = async () => {
    try {
      const reportIds = Array.from(selectedReports);
      await bulkDeleteMutation.mutateAsync(reportIds);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete reports';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
      setIsBulkDeleteModalOpen(false);
    }
  };

  // Handle success after deletion completes
  const handleBulkDeleteSuccess = () => {
    toast.custom(() => <CustomToast message={`${bulkDeleteCount} report(s) deleted successfully.`} type="success" />, { duration: 3000 });
    setSelectedReports(new Set());
    setSelectAll(false);
    setBulkDeleteCount(0);
    annualMedicalReportRefetch();
  };

  useEffect(() => {
    if (annualMedicalReportData) {
      const sortedRecords = [...annualMedicalReportData.records]
        .map((item: any) => {
          const incidentDate = new Date(item.date_of_report);
          item.date_of_incident = `${
            incidentDate.getMonth() + 1
          }/${incidentDate.getDate()}/${incidentDate.getFullYear()}`;
          return item;
        })
        .sort((a, b) => b.id - a.id);
      setAnnualMedicalReportItems(sortedRecords);
      setPagination({
        totalPages: annualMedicalReportData.total_pages,
        totalRecords: annualMedicalReportData.total_records,
      });
    }
  }, [annualMedicalReportData]);

  // Update select all state when reports change
  useEffect(() => {
    if (annualMedicalReportItems) {
      const allReportIds = new Set(annualMedicalReportItems.map((item: any) => item.id));
      const allSelected = allReportIds.size > 0 && 
        Array.from(allReportIds).every((id: any) => selectedReports.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedReports, annualMedicalReportItems]);

  useEffect(() => {
    annualMedicalReportRefetch();
  }, [currentPage, pageSize]);

  const checkIfDateIsValid = () => {
    const dateFrom = Date.parse(itemsFilter.from);
    const dateTo = Date.parse(itemsFilter.to);

    if (dateFrom && !dateTo) {
      return toast.custom(
        () => <CustomToast message="Invalid date to." type="error" />,
        {
          duration: 5000,
        }
      );
    }
    if (!dateFrom && dateTo) {
      return toast.custom(
        () => <CustomToast message="Invalid date from." type="error" />,
        {
          duration: 5000,
        }
      );
    }
    if (dateFrom > dateTo) {
      return toast.custom(
        () => (
          <CustomToast
            message="You have entered an invalid date range. Please select again."
            type="error"
          />
        ),
        {
          duration: 5000,
        }
      );
    }
    annualMedicalReportRefetch();
  };

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const renderRows = () => {
    if (isAnnualMedicalReportLoading) {
      return (
        <tr>
          <td colSpan={100}>
            <div className="py-5">
              <LoadingSpinner size="lg" color="yellow" />
            </div>
          </td>
        </tr>
      );
    }
    if (
      annualMedicalReportItems &&
      annualMedicalReportItems.length > 0
    ) {
      return annualMedicalReportItems.map((item: any) => (
        <tr key={item.id} className="cursor-pointer">
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <input
              type="checkbox"
              checked={selectedReports.has(item.id)}
              onChange={() => handleReportSelect(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
            />
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {item.date_of_report}
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {item.total_number_of_employees}
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {item.number_of_shifts}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='relative inline-block'>
              <select
                value={item.status || 'on-schedule'}
                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                className={`px-4 py-2 rounded-lg text-sm font-bold ${getStatusColor(item.status || 'on-schedule')} border-0 focus:ring-0 disabled:opacity-50 appearance-none pr-8`}
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
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center">
            <div className="flex items-center justify-center space-x-2">
              <SmartButton
                id="edit-dole-annual-medical-report-btn"
                onClick={() =>
                  setIsEditAnnualMedicalReportModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
              >
                <EditIcon />
              </SmartButton>

              <SmartButton
                id="generate-dole-annual-medical-report-btn"
                onClick={() => handlePrintPDFLocal(item)}
                disabled={generatingItemId === item.id}
                className={generatingItemId === item.id ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {generatingItemId === item.id ? (
                  <div className="animate-spin inline-block w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full">
                  </div>
                ) : (
                  <PrintIcon />
                )}
              </SmartButton>
              <SmartButton
                id="edit-dole-annual-medical-report-btn"
                onClick={() =>
                  setIsDeleteAnnualMedicalReportModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={selectedReports.size > 1}
                className={selectedReports.size > 1 ? 'opacity-50 cursor-not-allowed' : ''}
              >
                <DeleteIcon />
              </SmartButton>
            </div>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={100}>
            <h4 className="text-center text-gray-300 text-sm mt-4">
              There{`'`}s no data yet.
            </h4>
            <h4 className="text-center text-gray-300 text-sm mb-4">
              Please click create to add data.
            </h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 min-h-[80vh] flex flex-col">
        <div className="flex p-4">
          <Link
            href="/dole"
            className="flex-none flex gap-3 items-center hover:bg-gray-200"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <h2 className="text-xl font-bold">DOLE</h2>
          </Link>
        </div>
        
        <div className="px-2 md:px-8 lg:px-4">
          <h2 className="text-xl font-bold text-indigo-dye">
            Annual Medical Report
          </h2>
        </div>

        {/* Content Section with flex-1 */}
        <div className="px-2 md:px-8 lg:px-4 mt-6 flex-1">
          <div className={classNames("flex flex-col lg:flex-row items-left gap-4", !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            {/* Desktop Layout */}
            <div className="hidden md:flex flex-none flex-col lg:flex-row items-left md:items-center gap-2">
              <div className="relative">
                <CustomDatePicker
                  id="from-datepicker"
                  placeholder={"mm/dd/yyyy"}
                  className={
                    "appearance-none block w-full rounded-md py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6"
                  }
                  selected={itemsFilter.from}
                  pickerOnChange={(date: any) => {
                    if (itemsFilter)
                      setItemsFilter({ ...itemsFilter, from: date });
                  }}
                  inputOnChange={(value: any) => {
                    setItemsFilter({
                      ...itemsFilter,
                      from: value,
                    });
                  }}
                />
              </div>
              <p className="text-gray-600">to</p>
              <div className="relative">
                <CustomDatePicker
                  id="to-datepicker"
                  placeholder={"mm/dd/yyyy"}
                  className={
                    "appearance-none block w-full rounded-md py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6"
                  }
                  selected={itemsFilter.to}
                  pickerOnChange={(date: any) => {
                    if (itemsFilter)
                      setItemsFilter({ ...itemsFilter, to: date });
                    if (!itemsFilter) setItemsFilter(date);
                  }}
                  inputOnChange={(value: any) => {
                    setItemsFilter({
                      ...itemsFilter,
                      to: value,
                    });
                  }}
                  minDate={itemsFilter.from}
                />
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex-none flex flex-col items-left gap-2">
              <div className="flex justify-start items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[140px]">
                  <CustomDatePicker
                    id="from-datepicker-mobile"
                    placeholder={"From Date"}
                    className="appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm leading-6"
                    selected={itemsFilter.from}
                    pickerOnChange={(date: any) => {
                      if (itemsFilter)
                        setItemsFilter({ ...itemsFilter, from: date });
                    }}
                    inputOnChange={(value: any) => {
                      setItemsFilter({
                        ...itemsFilter,
                        from: value,
                      });
                    }}
                  />
                </div>
                <p className="text-gray-600 text-sm">to</p>
                <div className="relative flex-1 min-w-[140px]">
                  <CustomDatePicker
                    id="to-datepicker-mobile"
                    placeholder={"To Date"}
                    className="appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm leading-6"
                    selected={itemsFilter.to}
                    pickerOnChange={(date: any) => {
                      if (itemsFilter)
                        setItemsFilter({ ...itemsFilter, to: date });
                      if (!itemsFilter) setItemsFilter(date);
                    }}
                    inputOnChange={(value: any) => {
                      setItemsFilter({
                        ...itemsFilter,
                        to: value,
                      });
                    }}
                    minDate={itemsFilter.from}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 lg:w-1/3">
              <button
                className="bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100"
                onClick={checkIfDateIsValid}
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 flex justify-start lg:justify-end">
              <SmartButton
                id="create-dole-annual-medical-report-btn"
                className="bg-green-500 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50"
                onClick={() => setIsCreateAnnualMedicalReportModalOpen(true)}
              >
                CREATE
              </SmartButton>
            </div>
          </div>

          {/* Bulk Actions Section */}
          {selectedReports.size > 1 && (
            <div className="mt-4 ">
              <div className="flex items-center gap-3">
                <SmartButton
                  id="edit-dole-annual-medical-report-btn"
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteMutation.isLoading || !hasActiveSubscription}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkDeleteMutation.isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Delete Selected'
                  )}
                </SmartButton>
                <span className="text-sm text-gray-700 font-medium">
                  {selectedReports.size} selected
                </span>
              </div>
            </div>
          )}

          <div className={classNames("mt-8 flow-root", !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="min-w-full py-2 sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300 text-center">
                  <thead>
                    <tr>
                      <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          disabled={!annualMedicalReportItems || annualMedicalReportItems.length === 0}
                          className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                        />
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Date of Report
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Number of Employees
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Number of Shifts
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {renderRows()}
                  </tbody>
                </table>
                <hr />
              </div>
            </div>
          </div>
        </div>
        
        {/* Sticky Pagination */}
        <div className="px-2 md:px-8 lg:px-4 mt-8 mb-0 md:sticky md:bottom-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t">
          <Pagination
            pagination={pagination}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageSizeChange={pageSizeChange}
            onPageChange={paginationChange}
          />
        </div>
      </div>
      {isCreateAnnualMedicalReportModalOpen && (
        <CreateAnnualMedicalReportModal
          refetch={annualMedicalReportRefetch}
          isOpen={isCreateAnnualMedicalReportModalOpen}
          setIsOpen={setIsCreateAnnualMedicalReportModalOpen}
          formMethods={createFormMethods}
        />
      )}
      {isEditAnnualMedicalReportModalOpen && (
        <EditAnnualMedicalReportModal
          refetch={annualMedicalReportRefetch}
          isOpen={isEditAnnualMedicalReportModalOpen}
          setIsOpen={setIsEditAnnualMedicalReportModalOpen}
          formMethods={editFormMethods}
        />
      )}
      {isDeleteAnnualMedicalReportModalOpen && (
        <DeleteModal
          isOpen={isDeleteAnnualMedicalReportModalOpen}
          setIsOpen={setIsDeleteAnnualMedicalReportModalOpen}
          onConfirm={() => {
            const callbackReq = {
              onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
                setIsDeleteAnnualMedicalReportModalOpen(null);
                annualMedicalReportRefetch();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
              },
            };
            deleteAnnualMedicalReport(isDeleteAnnualMedicalReportModalOpen.id, callbackReq);
          }}
          isLoading={isDeleteAnnualMedicalReportLoading}
        />
      )}
      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteConfirmModalOpen?.open && (
        <DeleteModal
          isOpen={isBulkDeleteConfirmModalOpen}
          setIsOpen={setIsBulkDeleteConfirmModalOpen}
          onConfirm={confirmBulkDeleteWarning}
          isLoading={false}
          customText={`${bulkDeleteCount} Annual Medical Report${bulkDeleteCount > 1 ? 's' : ''}`}
        />
      )}

      {/* Bulk Delete Progress Modal */}
      {isBulkDeleteModalOpen && (
        <ProgressModal
          isOpen={isBulkDeleteModalOpen}
          setIsOpen={setIsBulkDeleteModalOpen}
          onConfirm={confirmBulkDelete}
          title={`Deleting ${bulkDeleteCount} Annual Medical Report${bulkDeleteCount > 1 ? 's' : ''}...`}
          isProcessing={bulkDeleteMutation.isLoading}
          onSuccess={handleBulkDeleteSuccess}
        />
      )}
    </>
  );
}

export default Content;
