import React, { useMemo } from 'react';

import { 
  calculateAttritionRateData, 
  getAttritionRateColor 
} from './calculations/attritionRateCalc';

interface AttritionRateProps {
  separationData?: any;
  isLoading?: boolean;
  error?: any;
  dateFilter?: {
    from: string;
    to: string;
  };
}

const AttritionRate: React.FC<AttritionRateProps> = ({ 
  separationData, 
  isLoading = false, 
  error = null,
  dateFilter
}) => {
  // Calculate attrition rate data using shared utility
  const { dateRange, attritionData } = useMemo(() => {
    return calculateAttritionRateData(separationData, dateFilter);
  }, [separationData, dateFilter]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attrition Rate</h3>
        <div className="flex items-center justify-center h-32">
          <div role='status' className='text-center'>
            <svg
              aria-hidden='true'
              className='inline w-12 h-12 mr-2 text-gray-200 animate-spin fill-yellow-400'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='sr-only'>Loading...</span>
          </div>
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
