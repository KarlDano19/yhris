import Pagination from '@/components/Pagination';
import FrequentlyEvaluatedPieChart from '../../modals/charts-and-graphs/FrequentlyEvaluatedPieChart';

interface PaginationState {
  totalRecords: number;
  totalPages: number;
}

interface DateFilter {
  from: any;
  to: any;
}

interface AnalyticsTabProps {
  frequentlyEvaluatedEmployees: any[];
  paginatedAnalytics: any[];
  pagination: PaginationState;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: any) => void;
  onPageSizeChange: (value: number) => void;
  dateFilter: DateFilter;
  totalScore: number;
}

const AnalyticsTab = ({
  frequentlyEvaluatedEmployees,
  paginatedAnalytics,
  pagination,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  dateFilter,
  totalScore,
}: AnalyticsTabProps) => {
  return (
    <div className='space-y-6'>
      <div>
        <h4 className='text-lg font-semibold text-gray-900'>Analytics</h4>
        {(dateFilter.from || dateFilter.to) && (
          <p className='text-xs text-blue-600 mt-1'>
            Showing analytics for filtered date range
          </p>
        )}
      </div>
      
      {/* Frequently Evaluated Employees Pie Chart */}
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <h5 className='text-lg font-medium text-gray-900 mb-4'>Frequently Evaluated Employees</h5>
        {frequentlyEvaluatedEmployees.length > 0 ? (
          <div className='h-80'>
            <FrequentlyEvaluatedPieChart 
              frequentlyEvaluatedEmployees={frequentlyEvaluatedEmployees}
            />
          </div>
        ) : (
          <div className='h-80 flex items-center justify-center'>
            <div className='text-center'>
              <p className='text-sm text-gray-500 italic mb-1'>
                No employee data available
              </p>
              {(dateFilter.from || dateFilter.to) && (
                <p className='text-xs text-gray-400'>
                  Try adjusting your date range to see more data
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Analytics Table */}
      {frequentlyEvaluatedEmployees.length > 0 && (
        <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
          <div className='px-6 py-4 bg-gray-50 border-b border-gray-200'>
            <h5 className='text-lg font-medium text-gray-900'>Employee Evaluation Details</h5>
            <p className='text-sm text-gray-600 mt-1'>Detailed breakdown of employee evaluation frequency and performance</p>
          </div>
          <div className='overflow-x-auto overflow-y-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Employee Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Department
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Evaluation Count
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Average Score
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {paginatedAnalytics.length > 0 ? (
                  paginatedAnalytics.map((employee: any, index: number) => (
                    <tr key={index} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {employee.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {employee.department}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                          {employee.evaluation_count} evaluation{employee.evaluation_count !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        <div className='flex flex-col'>
                          <span className={`font-medium ${
                            employee.average_score >= 80 ? 'text-green-600' :
                            employee.average_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {employee.average_score}%
                          </span>
                          <span className='text-xs text-gray-400'>
                            Avg: {employee.average_raw_score || 0} / {totalScore || 1}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className='px-6 py-4 text-center text-sm text-gray-500'>
                      No employee evaluation data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            pagination={pagination}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AnalyticsTab;

