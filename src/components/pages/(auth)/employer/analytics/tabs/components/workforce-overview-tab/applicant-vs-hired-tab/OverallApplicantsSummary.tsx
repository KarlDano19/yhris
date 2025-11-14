import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';

import { calculateOverallApplicantsSummary } from './calculations/overallApplicantsSummaryCalc';

interface OverallApplicantsSummaryProps {
  appliedApplicantsData?: any[];
  isLoading?: boolean;
  error?: any;
  selectedStatusFilter?: string;
  selectedJobFilter?: string;
}

const OverallApplicantsSummary: React.FC<OverallApplicantsSummaryProps> = ({ 
  appliedApplicantsData, 
  isLoading = false, 
  error = null,
  selectedStatusFilter = 'All Statuses',
  selectedJobFilter = 'All Jobs'
}) => {
  // Calculate applicant status summary using shared utility
  const applicantData = useMemo(() => {
    return calculateOverallApplicantsSummary(appliedApplicantsData);
  }, [appliedApplicantsData]);

  const filteredApplicantData = useMemo(() => {
    const shouldApplyStatusFilter = selectedStatusFilter !== 'All Statuses' && selectedJobFilter !== 'All Jobs';
    if (!shouldApplyStatusFilter) {
      return applicantData;
    }
    return applicantData.filter((item) => item.status === selectedStatusFilter);
  }, [applicantData, selectedStatusFilter, selectedJobFilter]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Applicants Status Summary</h3>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" color="yellow" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Applicants Status Summary</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">Error loading applicant data</div>
        </div>
      </div>
    );
  }

  // No data state
  if (!filteredApplicantData || filteredApplicantData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Applicants Status Summary</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">No applicant data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Applicants Status Summary</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[#ACB9CB]">
              <th className="text-center py-3 px-2 font-semibold text-gray-700">Status</th>
              <th className="text-center py-3 px-2 font-semibold text-gray-700">Count</th>
              <th className="text-center py-3 px-2 font-semibold text-gray-700">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicantData.map((item, index) => (
              <tr key={index} className="border-b border-[#CCD8EA]">
                <td className="text-center  py-3 px-2 text-gray-900 font-medium">{item.status}</td>
                <td className="text-center py-3 px-2 text-gray-700">{item.count}</td>
                <td className="text-center py-3 px-2">
                  <div className="flex flex-col">
                    <span className={`font-semibold ${item.color}`}>{item.percentage}</span>
                    <span className="text-xs text-gray-500">{item.label}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverallApplicantsSummary;
