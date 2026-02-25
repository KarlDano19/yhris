import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';

export interface AttritionRateData {
  month: string;
  attritionRate: string;
  totalExits: number;
}

const getAttritionRateColor = (rateString: string): string => {
  const rate = parseFloat(rateString.replace('%', ''));

  if (rate < 10) {
    return 'text-green-600 font-semibold';
  } else if (rate >= 11 && rate <= 15) {
    return 'text-blue-600 font-semibold';
  } else if (rate >= 16 && rate <= 20) {
    return 'text-orange-600 font-semibold';
  } else if (rate > 20) {
    return 'text-red-600 font-semibold';
  } else {
    return 'text-gray-600 font-semibold';
  }
};


interface AttritionRateProps {
  isLoading?: boolean;
  error?: any;
  dateFilter?: {
    from: string;
    to: string;
  };
  precomputedTrend?: AttritionRateData[];
  precomputedDateRange?: string;
}

const AttritionRate: React.FC<AttritionRateProps> = ({
  isLoading = false,
  error = null,
  dateFilter,
  precomputedTrend,
  precomputedDateRange,
}) => {
  const { dateRange, attritionData } = useMemo(() => {
    if (precomputedTrend) {
      return { dateRange: precomputedDateRange || '', attritionData: precomputedTrend };
    }
    return { dateRange: '', attritionData: [] };
  }, [precomputedTrend, precomputedDateRange]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attrition Rate</h3>
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner size="lg" color="yellow" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attrition Rate</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-red-500">Error loading attrition data</div>
        </div>
      </div>
    );
  }

  const title = attritionData.length > 0 
    ? `Attrition Rate for ${dateRange}`
    : 'Attrition Rate';

  return (
    <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
      <h3 className="text-lg font-semibold text-gray-900 mb-8">{title}</h3>
      
      {attritionData.length > 0 ? (
        <>
          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#ACB9CB]">
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Month</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Attrition Rate</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Total Exits</th>
                </tr>
              </thead>
              <tbody>
                {attritionData.map((item, index) => (
                  <tr key={index} className="border-b border-[#CCD8EA]">
                    <td className="text-center py-3 px-2 text-gray-900 font-medium">{item.month}</td>
                    <td className={`text-center py-3 px-2 ${getAttritionRateColor(item.attritionRate)}`}>
                      {item.attritionRate}
                    </td>
                    <td className="text-center py-3 px-2 text-gray-700">{item.totalExits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Guidelines Section */}
          <div className="bg-yellow-50 border-2 border-dashed border-yellow-400 rounded-lg p-4">
            <h4 className="text-md font-semibold text-yellow-800 mb-3">Attrition Rate Guidelines</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <span className="text-green-600 font-medium w-40 flex-shrink-0">0-10% - <span className="font-bold">Healthy</span>:</span>
                <span className="text-gray-700">Indicates strong employee retention and stable work culture.</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 font-medium w-40 flex-shrink-0">11-15% - <span className="font-bold">Manageable</span>:</span>
                <span className="text-gray-700">Still within normal range but worth monitoring for trends.</span>
              </div>
              <div className="flex items-start">
                <span className="text-orange-600 font-medium w-40 flex-shrink-0">16-20% - <span className="font-bold">Concerning</span>:</span>
                <span className="text-gray-700">May reflect issues in employee satisfaction, engagement, or job fit.</span>
              </div>
              <div className="flex items-start">
                <span className="text-red-600 font-medium w-40 flex-shrink-0">Above 20% - <span className="font-bold">High</span>:</span>
                <span className="text-gray-700">Signals potential problems in management, culture, workload, or compensation that may require attention.</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-gray-500 font-semibold mb-2">No data available</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttritionRate;
