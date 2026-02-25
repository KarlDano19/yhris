import React, { useState } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import PipelineInfoModal from '../../../../modals/PipelineInfoModal';

export interface RolePipelineData {
  role: string;
  numberOfApplicants: number;
  status: string;
  dateJobOpened: string;
  dateJobClosed: string;
  turnaroundTime: number | null;
  currentPipeline: string;
  jobId?: number;
}

export type PipelineData = { [jobId: number]: { [stageTitle: string]: number } };

const formatTurnaroundTime = (days: number | null): string => {
  if (!days && days !== 0) return '—';
  if (days === 0) return 'Today';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  if (remainingDays === 0) return `${months} month${months > 1 ? 's' : ''}`;
  return `${months} month${months > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
};

const formatPipelineInfo = (
  currentPipeline: string,
  numberOfApplicants: number,
  jobId: number | undefined,
  pipelineData: PipelineData
): string => {
  if (jobId && pipelineData[jobId]) {
    const stages = pipelineData[jobId];
    const stageEntries = Object.entries(stages);
    if (stageEntries.length > 0) {
      return stageEntries.map(([stage, count]) => `${stage}: ${count}`).join(', ');
    }
  }
  return currentPipeline || (numberOfApplicants > 0 ? `${numberOfApplicants} applicants` : 'No applicants yet');
};

const getStatusColor = (status: string): string =>
  status === 'Ongoing'
    ? 'text-blue-600 bg-blue-50 border-blue-200'
    : 'text-red-600 bg-red-50 border-red-200';

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
  const [selectedRole, setSelectedRole] = useState<{
    role: string;
    pipelineInfo: string;
    numberOfApplicants: number;
    pipelineData?: { [stageTitle: string]: number };
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePipelineClick = (role: RolePipelineData) => {
    const pipelineInfo = formatPipelineInfo(role.currentPipeline, role.numberOfApplicants, role.jobId, pipelineData);
    const rolePipelineData = pipelineData[role.jobId!] || {};
    
    setSelectedRole({
      role: role.role,
      pipelineInfo,
      numberOfApplicants: role.numberOfApplicants,
      pipelineData: rolePipelineData
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

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
          <div className='overflow-x-auto -mx-6 sm:-mx-0'>
            <div className='min-w-full px-6 sm:px-0'>
              <table className="min-w-full divide-y divide-gray-300 text-center">
              <thead>
                <tr className="border-b-2 border-[#ACB9CB]">
                  <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap min-w-[120px]">
                    Role
                  </th>
                  <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap min-w-[80px]">
                    No. of Applicants
                  </th>
                  <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap min-w-[80px]">
                    Status
                  </th>
                  <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap min-w-[100px]">
                    Date Job Opened
                  </th>
                  <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap min-w-[100px]">
                    Date Job Closed
                  </th>
                  <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap min-w-[100px]">
                    Turnaround Time
                  </th>
                  <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap min-w-[150px]">
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
                      <td className="px-2 sm:px-3 py-3 md:py-4 text-xs sm:text-sm md:text-sm text-gray-900 text-center min-w-[150px] max-w-[250px]">
                        <div 
                          className="truncate cursor-pointer text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium px-1" 
                          title="Click to view detailed pipeline information"
                          onClick={() => handlePipelineClick(role)}
                        >
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

      {/* Pipeline Info Modal */}
      {selectedRole && (
        <PipelineInfoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          role={selectedRole.role}
          pipelineInfo={selectedRole.pipelineInfo}
          numberOfApplicants={selectedRole.numberOfApplicants}
          pipelineData={selectedRole.pipelineData}
        />
      )}
    </>
  );
};

export default RolePipelineTable;
