"use client";

import React, { useEffect, useState, Fragment } from "react";

import Link from "next/link";

import { Menu, Transition } from "@headlessui/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import { Tooltip } from "react-tooltip";

import DocumentPageOne from "@/components/pages/(auth)/employer/dole/annual-medical-report/print/DocumentPageOne";
import DocumentPageTwo from "@/components/pages/(auth)/employer/dole/annual-medical-report/print/DocumentPageTwo";
import DocumentPageThree from "@/components/pages/(auth)/employer/dole/annual-medical-report/print/DocumentPageThree";
import DocumentPageFour from "@/components/pages/(auth)/employer/dole/annual-medical-report/print/DocumentPageFour";
import DocumentPageFive from "@/components/pages/(auth)/employer/dole/annual-medical-report/print/DocumentPageFive";
import DocumentPageSix from "@/components/pages/(auth)/employer/dole/annual-medical-report/print/DocumentPageSix";
import useFileforge from "@/components/hooks/useFileforge";
import CustomToast from "@/components/CustomToast";
import Pagination from "@/components/Pagination";
import CustomDatePicker from "@/components/CustomDatePicker";
import classNames from "@/helpers/classNames";

import useGetAnnualMedicalReportItems from "./hooks/useGetAnnualMedicalReportItems";
import useUpdateAnnualMedicalReport from "./hooks/useUpdateAnnualMedicalReport";
import ExportProgressModal from "./modals/ExportProgressModal";
import CreateAnnualMedicalReportModal from "./modals/CreateAnnualMedicalReportModal";
import EditAnnualMedicalReportModal from "./modals/EditAnnualMedicalReportModal";
import DeleteAnnualMedicalReportModal from "./modals/DeleteAnnualMedicalReportModal";

import SelectChevronDown from "@/svg/SelectChevronDown";
import EditIcon from "@/svg/EditIcon";
import PrintIcon from "@/svg/PrintIcon";
import DeleteIcon from "@/svg/DeleteIcon";


type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
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
  const [isExportProgressModalOpen, setIsExportProgressModalOpen] =
    useState<boolean>(false);
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
  const {
    data: annualMedicalReportData,
    isLoading: isAnnualMedicalReportLoading,
    refetch: annualMedicalReportRefetch,
  } = useGetAnnualMedicalReportItems({
    ...itemsFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });

  const queryClient = useQueryClient();
  const cachedRigths = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };

  const updateAnnualMedicalReport = useUpdateAnnualMedicalReport();

  const { generatePDFLocally, isGenerating } = useFileforge({
    onSuccess: () => {
      toast.custom(() => <CustomToast message='PDF generated successfully!' type='success' />, { duration: 3000 });
    },
    onError: (error) => {
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

  const handlePrintPDF = async (item: any) => {
    // Prepare data for Page 1
    const pageOneData = {
      establishmentName: "Sample Establishment Name", // Replace with actual data from your API
      address: "Sample Address", // Replace with actual data
      ownerManager: "Sample Owner/Manager", // Replace with actual data  
      natureOfBusiness: "Sample Business Nature", // Replace with actual data
      totalEmployees: item.total_number_of_employees,
      numberOfShifts: item.number_of_shifts,
      reportPeriod: {
        from: "January 1, 2024",
        to: "December 31, 2024"
      },
      shifts: {
        first: { male: 50, female: 30, total: 80 },
        second: { male: 45, female: 35, total: 80 },
        third: { male: 25, female: 15, total: 40 }
      },
      healthService: {
        organizedBy: 'establishment' as const,
        otherSpecify: undefined,
        serviceType: 'solely' as const
      },
      occupationalHealthStaff: {
        consultant: { name: 'Dr. Juan Dela Cruz', address: '123 Health St., Manila' },
        physician: { name: 'N/A', address: 'N/A' },
        dentist: { name: 'N/A', address: 'N/A' },
        nurse: { name: 'N/A', address: 'N/A' },
        inspectionFrequency: 'monthly' as const
      },
      emergencyServices: {
        hasTreatmentRoom: true,
        otherDetails: undefined
      },
      workSchedule: {
        physician: { hours: 8, shift: 'Day Shift' },
        dentist: { hours: 4, shift: 'Morning' },
        practitioner: { hours: 8, shift: 'Day Shift' },
        nurse: { hours: 8, shift: 'Day Shift' }
      }
    };

    // Prepare data for Page 2 - Medical conditions
    const pageTwoData = {
      respiratory: {
        laryngitis: { male: 2, female: 1 },
        bronchitis: { male: 1, female: 0 },
        bronchialAsthma: { male: 3, female: 2 },
        pneumonia: { male: 0, female: 1 },
        silicosis: { male: 0, female: 0 },
        pneumoconiosis: { male: 0, female: 0 },
        others: { male: 1, female: 0 }
      },
      heartAndBloodVessel: {
        hypertension: { male: 5, female: 3 },
        hypotension: { male: 2, female: 4 },
        anginaPectoris: { male: 1, female: 0 },
        myocardialInfarction: { male: 0, female: 0 },
        vascularDisturbances: { male: 1, female: 1 },
        others: { male: 0, female: 1 }
      }
      // Add more medical condition data as needed
    };

    // Prepare data for Page 3 - Health services and diseases
    const pageThreeData = {
      attendanceSchedule: {
        firstShift: 40,
        secondShift: 8,
        thirdShift: 0
      },
      occupationalHealthTraining: {
        physician: true,
        dentist: false,
        nurse: true,
        firstAider: true,
        othersSpecify: "Safety Officer"
      },
      medicalExamination: {
        prePlacement: 15,
        periodic: 200,
        returnToWork: 5,
        transfer: 3,
        special: 2,
        separation: 8
      }
      // Add disease report data as needed
    };

    // Prepare data for Page 4 - Infectious diseases and physical environment
    const pageFourData = {
      infectiousDiseases: {
        influenza: { male: 10, female: 8 },
        typhoidParatyphoid: { male: 0, female: 1 },
        cholera: { male: 0, female: 0 },
        measles: { male: 1, female: 1 },
        mumps: { male: 0, female: 0 },
        malaria: { male: 2, female: 1 },
        schistosomiasis: { male: 1, female: 0 },
        herpesZoster: { male: 0, female: 1 },
        chickenPox: { male: 2, female: 2 },
        germanMeasles: { male: 0, female: 0 },
        rabies: { male: 0, female: 0 },
        others: { male: 1, female: 0 }
      },
      physicalEnvironmentDiseases: {
        noiseVibration: {
          deafnessNoiseInduced: { male: 1, female: 0 },
          otosclerosis: { male: 0, female: 0 },
          musculoSkeletalDisturbances: { male: 3, female: 2 },
          fatigue: { male: 8, female: 6 }
        }
        // Add more physical environment data as needed
      },
      occupationalAccidents: {
        contusionBruises: { male: 5, female: 2 },
        abrasions: { male: 3, female: 1 },
        cuts: { male: 7, female: 3 },
        concussion: { male: 0, female: 0 },
        avulsion: { male: 1, female: 0 }
      }
    };

    // Prepare data for Page 5 - Additional sections
    const pageFiveData = {
      additionalInjuries: {
        amputation: { male: 0, female: 0 },
        crushingInjuries: { male: 1, female: 0 },
        spinalInjuries: { male: 0, female: 1 },
        cranialInjuries: { male: 1, female: 0 },
        sprains: { male: 4, female: 3 },
        dislocationFractures: { male: 2, female: 1 },
        burns: { male: 3, female: 1 }
      },
      immunizationProgram: {
        tetanusToxoid: { male: 50, female: 40 },
        tetanusAntitoxin: { male: 5, female: 3 },
        tetanusGlobulin: { male: 2, female: 1 },
        hepatitisB: { male: 60, female: 50 },
        rabiesVaccine: { male: 0, female: 0 },
        others: "COVID-19 Vaccine"
      },
      medicalRecordsKeeping: {
        done: true,
        notDone: false
      },
      healthEducation: {
        individual: true,
        groupDiscussions: true,
        visualDisplays: true
      },
      otherHealthPrograms: {
        nutrition: { seminar: true, visualAids: true, counselling: false },
        maternalChildCare: { seminar: false, visualAids: true, counselling: true },
        familyPlanning: { seminar: true, visualAids: false, counselling: true },
        mentalHealth: { seminar: false, visualAids: false, counselling: true },
        personalHealthMaintenance: { seminar: true, visualAids: true, counselling: false }
      },
      physicalFitnessProgram: {
        sportsActivities: { yes: true, no: false },
        calisthenics: { yes: false, no: true }
      },
      chemicalHazards: {
        dust: { substance: "Silica dust from construction", workers: 15 },
        liquids: { substance: "Cleaning solvents", workers: 8 },
        mistFumes: { substance: "Paint spray mist", workers: 5 },
        gas: { substance: "CO from vehicles", workers: 12 },
        others: { substance: "Adhesive fumes", workers: 3 }
      },
      physicalHazards: {
        noise: 25,
        temperatureHumidity: 30,
        pressure: 0,
        illumination: 45,
        radiationUltraviolet: 2,
        vibration: 8
      }
    };

    // Prepare data for Page 6 - Final sections
    const pageSixData = {
      biologicalHazards: {
        viral: { substance: "COVID-19, Influenza", workers: 10 },
        bacterial: { substance: "E.coli from food handling", workers: 5 },
        fungal: { substance: "Mold in storage areas", workers: 3 },
        parasitic: { substance: "", workers: 0 },
        others: { substance: "", workers: 0 }
      },
      ergonomicStress: {
        exhaustingPhysicalWork: { substance: "Heavy lifting", workers: 20 },
        prolongedStanding: { substance: "Assembly line work", workers: 35 },
        excessiveMentalEffort: { substance: "Computer programming", workers: 15 },
        unfavorableWorkPosture: { substance: "Prolonged sitting", workers: 40 },
        staticMonotonousWork: { substance: "Data entry", workers: 25 },
        othersSpecify: { substance: "Repetitive motions", workers: 18 }
      },
      submittedBy: {
        name: "Dr. Maria Santos",
        position: "Occupational Health Physician"
      },
      notedBy: {
        employer: "John Doe, CEO",
        date: new Date().toLocaleDateString()
      }
    };

    // Create complete document with all pages
    const documentComponent = (
      <div className="bg-white">
        <DocumentPageOne data={pageOneData} />
        <div className="page-break" style={{ pageBreakAfter: 'always' }}></div>
        <DocumentPageTwo data={pageTwoData} />
        <div className="page-break" style={{ pageBreakAfter: 'always' }}></div>
        <DocumentPageThree {...pageThreeData} />
        <div className="page-break" style={{ pageBreakAfter: 'always' }}></div>
        <DocumentPageFour {...pageFourData} />
        <div className="page-break" style={{ pageBreakAfter: 'always' }}></div>
        <DocumentPageFive {...pageFiveData} />
        <div className="page-break" style={{ pageBreakAfter: 'always' }}></div>
        <DocumentPageSix {...pageSixData} />
      </div>
    );
    
    const filename = `annual-medical-report-${item.id}-${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Generate PDF locally (opens print dialog)
    await generatePDFLocally(documentComponent, filename);
  };



  // const menuOptions = [
  //   {
  //     name: "Export",
  //     action: () => {
  //       setIsExportProgressModalOpen(true);
  //     },
  //     disabled: !cachedRigths?.state?.data?.export_dole_annual_medical_report,
  //   },
  //   {
  //     name: "Generate Report",
  //     action: () => {
  //       handlePrint();
  //     },
  //     disabled: !cachedRigths?.state?.data?.generate_dole_annual_medical_report,
  //   },
  // ];

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

  useEffect(() => {
    annualMedicalReportRefetch();
  }, [currentPage, pageSize]);

  const handlePrint = () => {
    // Create a new div element
    const printDiv = document.createElement("div");

    // Copy the content of the original printSection
    const originalPrintSection = document.getElementById("printSection");
    if (originalPrintSection) {
      printDiv.innerHTML = originalPrintSection.innerHTML;
    }

    // Style the new div to be off-screen
    printDiv.style.width = "1980px";
    printDiv.style.height = "100%";
    printDiv.style.position = "absolute";
    printDiv.style.left = "-9999px";
    printDiv.style.top = "-9999px";

    // Add the new div to the body
    document.body.appendChild(printDiv);

    // Use html2canvas on the new div
    html2canvas(printDiv).then((canvas) => {
      // Remove the temporary div
      document.body.removeChild(printDiv);

      const imgData = canvas.toDataURL("image/png");
      const newWindow = window.open("", "_blank");
      newWindow?.document.write(
        `<img src="${imgData}" style="width:100%;height:auto;">`
      );
      newWindow?.document.close();
      setTimeout(() => {
        newWindow?.print();
      }, 500);
    });
  };

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
            <div role="status" className="py-5 text-center">
              <svg
                aria-hidden="true"
                className="inline w-12 h-12 mr-2 text-gray-200 animate-spin fill-yellow-400"
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
                disabled={!cachedRigths?.state?.data?.edit_dole_annual_medical_report}
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
              <button
                onClick={() =>
                  setIsEditAnnualMedicalReportModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={!cachedRigths?.state?.data?.edit_dole_annual_medical_report}
              >
                <EditIcon />
              </button>

              <button
                onClick={() => handlePrintPDF(item)}
                disabled={isGenerating || !cachedRigths?.state?.data?.generate_dole_annual_medical_report}
                data-tooltip-id='print-tooltip'
                data-tooltip-content={isGenerating ? 'Generating PDF...' : 'Generate PDF'}
                data-tooltip-place='bottom'
                className={`${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 p-1 rounded'}`}
              >
                <PrintIcon />
              </button>
              <button
                onClick={() =>
                  setIsDeleteAnnualMedicalReportModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={!cachedRigths?.state?.data?.edit_dole_annual_medical_report}
              >
                <DeleteIcon />
              </button>
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          <div className="mt-6 flex flex-col lg:flex-row items-left gap-4">
            <div className="flex-none flex flex-col lg:flex-row items-left gap-2">
              <div className="relative">
                <CustomDatePicker
                  id="from-datepicker"
                  placeholder={"mm/dd/yyyy"}
                  className={
                    "appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6"
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
              <p>to</p>
              <div className="relative">
                <CustomDatePicker
                  id="to-datepicker"
                  placeholder={"mm/dd/yyyy"}
                  className={
                    "appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6"
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
            <div className="flex gap-2 lg:w-1/3">
              <button
                className="bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100"
                onClick={checkIfDateIsValid}
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 flex justify-start lg:justify-end">
              <button
                className="bg-green-500 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50"
                onClick={() => setIsCreateAnnualMedicalReportModalOpen(true)}
                disabled={!hasActiveSubscription || !cachedRigths?.state?.data?.create_dole_annual_medical_report}
              >
                CREATE
              </button>
              {/* <Menu as="div" className="relative">
                <Menu.Button className="bg-green-500 py-2.5 px-3 rounded-r-md text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50">
                  <span className="sr-only">Open options</span>
                  <div className="flex gap-4">
                    <ChevronDownIcon
                      className="flex-none h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-[8.6rem] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {menuOptions.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <span
                              className={classNames(
                                "block px-4 py-2 text-sm cursor-pointer text-center",
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                item.disabled ? "bg-gray-200 cursor-not-allowed opacity-50" : ""
                              )}
                              onClick={() => {
                                if (!item.disabled) {
                                  item.action();
                                }
                              }}
                            >
                              {item.name}
                            </span>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu> */}
            </div>
          </div>

          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="min-w-full py-2 sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300 text-center">
                  <thead>
                    <tr>
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
              <Pagination
                pagination={pagination}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageSizeChange={pageSizeChange}
                onPageChange={paginationChange}
              />
          </div>
        </div>
      </div>
      {isCreateAnnualMedicalReportModalOpen && (
        <CreateAnnualMedicalReportModal
          refetch={annualMedicalReportRefetch}
          isOpen={isCreateAnnualMedicalReportModalOpen}
          setIsOpen={setIsCreateAnnualMedicalReportModalOpen}
        />
      )}
      {isEditAnnualMedicalReportModalOpen && (
        <EditAnnualMedicalReportModal
          refetch={annualMedicalReportRefetch}
          isOpen={isEditAnnualMedicalReportModalOpen}
          setIsOpen={setIsEditAnnualMedicalReportModalOpen}
        />
      )}
      {isDeleteAnnualMedicalReportModalOpen && (
        <DeleteAnnualMedicalReportModal
          refetch={annualMedicalReportRefetch}
          isOpen={isDeleteAnnualMedicalReportModalOpen}
          setIsOpen={setIsDeleteAnnualMedicalReportModalOpen}
        />
      )}
      {isExportProgressModalOpen && (
        <ExportProgressModal
          isOpen={isExportProgressModalOpen}
          setIsOpen={setIsExportProgressModalOpen}
          itemsFilter={itemsFilter}
        />
      )}
      <Tooltip id='print-tooltip' />
    </>
  );
}

export default Content;
