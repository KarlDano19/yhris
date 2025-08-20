import React from 'react';

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
                        <div className="text-gray-400 text-lg mb-2">No job postings found</div>
                        <div className="text-gray-500 text-sm">Create your first job posting to see role pipeline data</div>
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
