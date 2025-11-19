import Pagination from '@/components/Pagination';
import { PaginationState } from '../../../modals/types';

interface RespondentsTabProps {
  paginatedRespondents: any[];
  pagination: PaginationState;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: any) => void;
  onPageSizeChange: (value: number) => void;
  onRecipientsClick: (recipients: string, employeeName: string, department: string) => void;
  passingScore: number;
}

const RespondentsTab = ({
  paginatedRespondents,
  pagination,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRecipientsClick,
  passingScore,
}: RespondentsTabProps) => {
  return (
    <div className='space-y-4'>
      <h4 className='text-lg font-semibold text-gray-900'>List of Respondents</h4>
      <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
        <div className='overflow-x-auto overflow-y-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Recipients (Evaluators)
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Department
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Employee Evaluated
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date Completed
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Score
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {paginatedRespondents.length > 0 ? (
                paginatedRespondents.map((employee: any, index: number) => (
                  <tr key={index} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 text-sm font-medium text-gray-900 max-w-xs'>
                      <div 
                        className='truncate cursor-pointer text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium' 
                        title='Click to view full list of evaluators'
                        onClick={() => onRecipientsClick(
                          employee.recipients || 'N/A',
                          employee.name,
                          employee.department
                        )}
                      >
                        {employee.recipients || 'N/A'}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {employee.department}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {employee.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {employee.date_completed ? 
                        new Intl.DateTimeFormat('en-US').format(new Date(employee.date_completed)) : 
                        'N/A'
                      }
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {employee.score || 0}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.score >= passingScore
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.score >= passingScore ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className='px-6 py-4 text-center text-sm text-gray-500'>
                    No respondents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        pagination={pagination}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default RespondentsTab;

