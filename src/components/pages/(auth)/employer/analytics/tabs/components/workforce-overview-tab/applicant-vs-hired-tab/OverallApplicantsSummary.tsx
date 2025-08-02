'use client';

import React, { useMemo } from 'react';

interface OverallApplicantsSummaryProps {
  appliedApplicantsData?: any[];
  isLoading?: boolean;
  error?: any;
}

const OverallApplicantsSummary: React.FC<OverallApplicantsSummaryProps> = ({ 
  appliedApplicantsData, 
  isLoading = false, 
  error = null 
}) => {
  // Calculate applicant status summary from real data
  const applicantData = useMemo(() => {
    if (!appliedApplicantsData || !Array.isArray(appliedApplicantsData)) {
      return [];
    }

    const totalApplied = appliedApplicantsData.length;
    
    // Count applicants by status
    const statusCounts = appliedApplicantsData.reduce((acc: any, applicant: any) => {
      const status = applicant.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Define all possible statuses with their display names and colors
    const allStatuses = {
      'applied': { label: 'Applied', color: 'text-blue-600' },
      'ongoing': { label: 'Ongoing', color: 'text-blue-600' },
      'hired': { label: 'Hired', color: 'text-green-600' },
      'rejected': { label: 'Rejected', color: 'text-red-600' },
      'withdrawn': { label: 'Withdrawn', color: 'text-red-600' },
    };

    const result = [];

    // Add counts for each status (including zero counts)
    Object.entries(allStatuses).forEach(([status, config]) => {
      const count = statusCounts[status] || 0;
      const percentage = totalApplied > 0 ? (count / totalApplied * 100).toFixed(0) : '0';
      
      result.push({
        status: config.label,
        count: count.toString(),
        percentage: `${percentage}%`,
        label: 'of total applied',
        color: config.color
      });
    });

    // Add total applied count as a summary row at the bottom
    result.push({
      status: 'Total Applicants',
      count: totalApplied.toString(),
      percentage: '100%',
      label: 'total applicants',
      color: 'text-gray-800 font-bold'
    });

    return result;
  }, [appliedApplicantsData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Applicants Status Summary</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading applicant data...</div>
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
  if (!applicantData || applicantData.length === 0) {
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
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Count</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {applicantData.map((item, index) => (
              <tr key={index} className={`border-b border-gray-100 ${index === applicantData.length - 1 ? 'bg-gray-50 font-semibold' : ''}`}>
                <td className="py-3 px-2 text-gray-900 font-medium">{item.status}</td>
                <td className="py-3 px-2 text-gray-700">{item.count}</td>
                <td className="py-3 px-2">
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
