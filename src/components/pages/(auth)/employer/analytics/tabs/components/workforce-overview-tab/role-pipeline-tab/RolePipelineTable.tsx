import React from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';

import { 
  RolePipelineData, 
  PipelineData, 
  formatTurnaroundTime, 
  formatPipelineInfo, 
  getStatusColor 
} from './calculation/rolePipelineTableCalc';

interface PaginationData {
  totalRecords: number;
  totalPages: number;
}

interface RolePipelineTableProps {
  data?: RolePipelineData[];
  pagination?: PaginationData;
  isLoading?: boolean;
  error?: any;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: any) => void;
  onPageSizeChange: (value: number) => void;
  pipelineData?: PipelineData;
}

const RolePipelineTable: React.FC<RolePipelineTableProps> = ({
  data = [],
  pagination,
  isLoading = false,
  error,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pipelineData = {}
}) => {

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-[#A8B5C7] shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="lg" color="yellow" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-[#A8B5C7] shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-red-500">Error loading role pipeline data</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-[#A8B5C7] shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Filter button removed */}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div 
            className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#2d3e58 #f1f1f1'
            }}
          >
            <div className='min-w-full py-2 sm:px-6 lg:px-8'>
              <table className="min-w-full divide-y divide-gray-300 text-center">
              <thead>
                <tr className="border-b-2 border-[#ACB9CB]">
                  <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Role
                  </th>
                  <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                    No. of Applicants
                  </th>
                  <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Date Job Opened
                  </th>
                  <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Date Job Closed
                  </th>
                  <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Turnaround Time
                  </th>
                  <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Current Pipeline
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((role, index) => (
                    <tr key={index} className="border-b border-[#CCD8EA] hover:bg-gray-50 transition-colors">
                      <td className="px-2 sm:px-3 py-3 md:py-4 text-xs sm:text-sm md:text-sm text-gray-900 font-medium text-center whitespace-nowrap">
                        {role.role}
                      </td>
                      <td className="px-2 sm:px-3 py-3 md:py-4 text-xs sm:text-sm md:text-sm text-gray-900 text-center whitespace-nowrap">
                        {role.numberOfApplicants}
                      </td>
                      <td className="px-2 sm:px-3 py-3 md:py-4 text-xs sm:text-sm md:text-sm text-center">
                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(role.status)}`}>
                          {role.status}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-3 md:py-4 text-xs sm:text-sm md:text-sm text-gray-900 text-center whitespace-nowrap">
                        {role.dateJobOpened}
                      </td>
                      <td className="px-2 sm:px-3 py-3 md:py-4 text-xs sm:text-sm md:text-sm text-gray-900 text-center whitespace-nowrap">
                        {role.dateJobClosed}
                      </td>
                      <td className="px-2 sm:px-3 py-3 md:py-4 text-xs sm:text-sm md:text-sm text-gray-900 text-center whitespace-nowrap">
                        <span className="font-medium">{formatTurnaroundTime(role.turnaroundTime)}</span>
                      </td>
                      <td className="px-2 sm:px-3 py-3 md:py-4 text-xs sm:text-sm md:text-sm text-gray-900 text-center">
                        <div className="whitespace-nowrap">
                          {formatPipelineInfo(role.currentPipeline, role.numberOfApplicants, role.jobId, pipelineData)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-2 sm:px-3 py-8 md:py-8 text-center font-semibold text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
              </table>
            </div>
          </div>
          {pagination && pagination.totalRecords > 0 && (
            <Pagination
              pagination={pagination}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>


    </>
  );
};

export default RolePipelineTable;
