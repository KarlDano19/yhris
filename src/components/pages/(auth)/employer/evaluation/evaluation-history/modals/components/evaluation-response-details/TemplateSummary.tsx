interface TemplateSummaryProps {
  template: any;
}

const TemplateSummary = ({ template }: TemplateSummaryProps) => {
  return (
    <div className='bg-gray-50 rounded-lg p-6 border border-gray-200'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <p className='text-sm text-gray-600'>Template Name</p>
          <p className='text-base font-medium text-gray-900'>{template?.name}</p>
        </div>
        <div>
          <p className='text-sm text-gray-600'>Total Responses</p>
          <p className='text-base font-medium text-gray-900'>{template?.total_responses}</p>
        </div>
        <div>
          <p className='text-sm text-gray-600'>Evaluation Type</p>
          <p className='text-base font-medium text-gray-900'>{template?.evaluation_type}</p>
        </div>
      </div>
    </div>
  );
};

export default TemplateSummary;


