"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useGetDisciplinaryRecords } from "../hooks/useGetDisciplinaryRecords";
import Section from "../common/Section";
import Pagination from "@/components/Pagination";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomToast from "@/components/CustomToast";
import LoadingSpinner from "@/components/LoadingSpinner";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function DisciplinaryRecordsForm({
  employeeId,
}: {
  employeeId: number | string;
}) {
  const {
    data: listData,
    isLoading,
    error,
    refetch,
    setPage,
    setPageSize,
    setOpts,
  } = useGetDisciplinaryRecords(employeeId, {
    current_page: 1,
    page_size: 10,
  });

  const [dateFilter, setDateFilter] = useState<{
    from: string | null;
    to: string | null;
  }>({
    from: null,
    to: null,
  });
  const [isSearching, setIsSearching] = useState(false);

  const currentPage = listData?.current_page ?? 1;
  const pageSize = listData?.page_size ?? 10;
  const totalRecords = listData?.total_records ?? 0;
  const totalPages = listData?.total_pages ?? 1;
  const records = listData?.records ?? [];

  const handleSearch = () => {
    const dateFrom = dateFilter.from ? Date.parse(dateFilter.from) : null;
    const dateTo = dateFilter.to ? Date.parse(dateFilter.to) : null;

    if (dateFrom && !dateTo) {
      return toast.custom(
        () => <CustomToast message="Please select an end date" type="error" />,
        { duration: 5000 }
      );
    }
    if (!dateFrom && dateTo) {
      return toast.custom(
        () => <CustomToast message="Please select a start date" type="error" />,
        { duration: 5000 }
      );
    }
    if (dateFrom && dateTo && dateFrom > dateTo) {
      return toast.custom(
        () => (
          <CustomToast
            message="You have entered an invalid date range. Please select again."
            type="error"
          />
        ),
        { duration: 5000 }
      );
    }

    setIsSearching(true);
    setOpts({
      current_page: 1,
      page_size: pageSize,
      start: dateFilter.from || undefined,
      end: dateFilter.to || undefined,
    });
  };

  useEffect(() => {
    if (!isLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isLoading, isSearching]);

  return (
    <Section>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-slate-700">
          Disciplinary Records
        </h3>
      </div>

      {/* Date Range Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Date Range Pickers */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 flex-wrap md:flex-nowrap">
            <div className="relative flex-1 md:flex-none min-w-[140px] md:min-w-0">
              <CustomDatePicker
                id="from-datepicker"
                placeholder="mm/dd/yyyy"
                className="appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 md:placeholder:text-black text-sm leading-6"
                selected={dateFilter.from}
                pickerOnChange={(date: any) => {
                  setDateFilter({ ...dateFilter, from: date });
                }}
                inputOnChange={(value: any) => {
                  setDateFilter({
                    ...dateFilter,
                    from: value?.target?.value === '' ? null : value,
                  });
                }}
              />
            </div>
            <p className="text-gray-600 text-sm md:text-base self-center">to</p>
            <div className="relative flex-1 md:flex-none min-w-[140px] md:min-w-0">
              <CustomDatePicker
                id="to-datepicker"
                placeholder="mm/dd/yyyy"
                className="appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 md:placeholder:text-black text-sm leading-6"
                selected={dateFilter.to}
                pickerOnChange={(date: any) => {
                  setDateFilter({ ...dateFilter, to: date });
                }}
                inputOnChange={(value: any) => {
                  setDateFilter({
                    ...dateFilter,
                    to: value?.target?.value === '' ? null : value,
                  });
                }}
                minDate={dateFilter.from}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              className="bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100"
              onClick={handleSearch}
              disabled={isSearching}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && !isLoading && (
        <div className="rounded-xl border bg-white p-6 text-sm text-red-600">
          {error.message}
        </div>
      )}

      {/* Table Section */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="min-w-full py-2 sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300 text-center">
              <thead>
                <tr>
                  <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    NTE ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    Incident Date
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    Place
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    NTE Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(isLoading || isSearching) ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="py-5">
                        <LoadingSpinner size="lg" color="yellow" />
                      </div>
                    </td>
                  </tr>
                ) : records.length > 0 ? (
                  records.map((record) => (
                    <tr key={record.id}>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 font-mono">
                        {record.nte_id || "NTE-000"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {new Date(record.incident_date).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {record.issue_type || "-"}
                      </td>
                      <td className="px-3 py-5 text-sm text-gray-500">
                        {record.place_of_incident}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-pre-line text-center ${
                            record.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : record.status === "disapproved"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-orange-600"
                          }`}
                        >
                          {record.status === "approved"
                            ? "Approved"
                            : record.status === "disapproved"
                            ? "Disapproved"
                            : "Pending"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {record.is_nte_received
                          ? "Received"
                          : record.is_nte_sent
                          ? "Sent"
                          : "Not Sent"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <h4 className="text-center text-gray-300 text-sm mt-4">
                        There&apos;s no data yet.
                      </h4>
                      <h4 className="text-center text-gray-300 text-sm mb-4">
                        No disciplinary records found.
                      </h4>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <hr />
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-8 mb-0">
        <Pagination
          pagination={{ totalPages, totalRecords }}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageSizeChange={(size: number) => setPageSize(size)}
          onPageChange={({ selected }) => setPage(selected + 1)}
          pageType="standard"
        />
      </div>
    </Section>
  );
}
