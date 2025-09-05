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
        
        <div className="p-6 pb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-[#ACB9CB]">
                  <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                    Role
                  </th>
                  <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                    No. of Applicants
                  </th>
                  <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                    Date Job Opened
                  </th>
                  <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                    Date Job Closed
                  </th>
                  <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                    Turnaround Time
                  </th>
                  <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                    Current Pipeline
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((role, index) => (
                    <tr key={index} className="border-b border-[#CCD8EA] hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-sm text-gray-900 font-medium text-center">
                        {role.role}
                      </td>
                      <td className="py-4 text-sm text-gray-900 text-center">
                        {role.numberOfApplicants}
                      </td>
                      <td className="py-4 text-sm text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(role.status)}`}>
                          {role.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-900 text-center">
                        {role.dateJobOpened}
                      </td>
                      <td className="py-4 text-sm text-gray-900 text-center">
                        {role.dateJobClosed}
                      </td>
                      <td className="py-4 text-sm text-gray-900 text-center">
                        <span className="font-medium">{formatTurnaroundTime(role.turnaroundTime)}</span>
                      </td>
                      <td className="py-4 text-sm text-gray-900 text-center">
                        {formatPipelineInfo(role.currentPipeline, role.numberOfApplicants, role.jobId, pipelineData)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="text-gray-500 font-semibold mb-2">No data available</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
