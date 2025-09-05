import WarningRed from '@/svg/WarningRed';

interface DeleteVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  versionNumber: string;
  isLoading?: boolean;
  isBulkDelete?: boolean;
  selectedCount?: number;
}

export default function DeleteVersionModal({
  isOpen,
  onClose,
  onConfirm,
  versionNumber,
  isLoading = false,
  isBulkDelete = false,
  selectedCount = 0
}: DeleteVersionModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all my-4 w-full max-w-full mx-2 md:my-8 md:w-[500px]">
          <div className='flex justify-center py-6 md:py-8 px-2'>
            <WarningRed />
          </div>
          <div className='px-4 md:px-20 text-center'>
            {isBulkDelete ? (
              <>
                <p className='text-lg md:text-xl text-gray-600 font-bold'>
                  Are you sure you want to <span className='text-red-500'>delete</span>{' '}
                  <span className='text-red-500'>{selectedCount} version(s)</span>?
                </p>
                <p className='text-sm md:text-base text-gray-500 mt-2'>
                  This action cannot be undone.
                </p>
                {versionNumber && (
                  <p className='text-sm md:text-base text-gray-600 mt-1'>
                    Versions: {versionNumber}
                  </p>
                )}
              </>
            ) : (
              <p className='text-lg md:text-xl text-gray-600 font-bold'>
                Are you sure you want to <span className='text-red-500'>delete</span> version{' '}
                <span className='text-red-500'>{versionNumber}</span>?
              </p>
            )}
          </div>
          <div className='flex flex-row justify-center w-full gap-3 md:gap-8 px-4 pt-8 md:pt-10 pb-5 md:pb-7'>
            <button
              type='button'
              className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-blue-600 px-6 md:px-20 py-2 text-sm md:text-base bg-white leading-6 font-bold text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150'
              onClick={onClose}
              disabled={isLoading}
            >
              No
            </button>
            <button
              type='button'
              className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-transparent px-6 md:px-20 py-2 text-sm md:text-base bg-blue-600 leading-6 font-bold text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150'
              onClick={() => {
                onConfirm();
              }}
              disabled={isLoading}
            >
              {isLoading ? (isBulkDelete ? 'Deleting...' : 'Deleting...') : 'Yes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 