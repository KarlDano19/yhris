'use client';

import React from 'react';

const OverallApplicantsSummary = () => {
  // Dummy data for applicant status summary
  const applicantData = [
    {
      status: 'Applied',
      count: '250',
      percentage: '100%',
      label: 'initial total applicants',
      color: 'text-blue-600'
    },
    {
      status: 'Ongoing',
      count: '132',
      percentage: '30%',
      label: 'of total applied',
      color: 'text-blue-600'
    },
    {
      status: 'Hired',
      count: 'HR', // Placeholder as shown in image
      percentage: '12%',
      label: 'of total applied',
      color: 'text-green-600'
    },
    {
      status: 'Rejected',
      count: 'IT', // Placeholder as shown in image
      percentage: '40%',
      label: 'of total applied',
      color: 'text-red-600'
    },
    {
      status: 'Withdrawn',
      count: 'IT', // Placeholder as shown in image
      percentage: '18%',
      label: 'of total applied',
      color: 'text-red-600'
    }
  ];

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
              <tr key={index} className="border-b border-gray-100">
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
