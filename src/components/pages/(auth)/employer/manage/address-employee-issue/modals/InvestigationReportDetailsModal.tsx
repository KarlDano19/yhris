import { Dispatch, Fragment, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import useGetInvestigationReportDetails from '../hooks/useGetInvestigationReportDetails';

import { XCircleIcon } from '@heroicons/react/24/solid';

function InvestigationReportDetailsModal({ isOpen, setIsOpen }: { isOpen: any; setIsOpen: Dispatch<any> }) {
  const cancelButtonRef = useRef(null);
  const { data: investigationReportData, remove: removeInvestigationReport } = useGetInvestigationReportDetails(
    isOpen.id
  );
  const [isSummaryView, setIsSummaryView] = useState(false);

  const customCloseModal = () => {
    removeInvestigationReport();
    setIsOpen(null);
    setIsSummaryView(false);
  };

  const toggleView = () => {
    setIsSummaryView(!isSummaryView);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Transition.Root show={isOpen ? true : false} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={customCloseModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>
          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Investigation Report</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={customCloseModal} />
                  </div>
                  <div>
                    <div className='flex flex-col gap-2 p-4'>
                      <div className='flex flex-wrap gap-2 justify-start'>
                        <button 
                          className={`px-4 py-2 rounded-md transition-colors ${
                            isSummaryView 
                              ? 'bg-savoy-blue text-white hover:bg-blue-700' 
                              : 'bg-savoy-blue text-white hover:bg-blue-700'
                          }`}
                          onClick={toggleView}
                        >
                          {isSummaryView ? 'Back' : 'View Summary'}
                        </button>
                      </div>
                      
                      <div className='mt-4'>
                        {isSummaryView ? (
                          <div className='space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <div>
                                <label htmlFor='date-of-investigation' className='block text-sm font-bold text-gray-700 mb-1'>
                                  Date of Investigation:
                                </label>
                                <input
                                  id='date-of-investigation'
                                  type='text'
                                  value={formatDate(investigationReportData?.date_of_investigation)}
                                  readOnly
                                  className='cursor-not-allowed w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm'
                                />
                              </div>
                              
                              <div>
                                <label htmlFor='witness' className='block text-sm font-bold text-gray-700 mb-1'>
                                  Witness:
                                </label>
                                <input
                                  id='witness'
                                  type='text'
                                  value={investigationReportData?.witness || 'N/A'}
                                  readOnly
                                  className='cursor-not-allowed w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm'
                                />
                              </div>
                              
                              <div>
                                <label htmlFor='presider' className='block text-sm font-bold text-gray-700 mb-1'>
                                  Presider:
                                </label>
                                <input
                                  id='presider'
                                  type='text'
                                  value={investigationReportData?.presider || 'N/A'}
                                  readOnly
                                  className='cursor-not-allowed w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm'
                                />
                              </div>
                              
                              <div>
                                <label htmlFor='has-attended-hearing' className='block text-sm font-bold text-gray-700 mb-1'>
                                  Has Attended Hearing:
                                </label>
                                <input
                                  id='has-attended-hearing'
                                  type='text'
                                  value={investigationReportData?.has_attended_hearing || 'N/A'}
                                  readOnly
                                  className='cursor-not-allowed w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm'
                                />
                              </div>
                              
                              <div>
                                <label htmlFor='decision' className='block text-sm font-bold text-gray-700 mb-1'>
                                  Decision:
                                </label>
                                <input
                                  id='decision'
                                  type='text'
                                  value={investigationReportData?.decision || 'N/A'}
                                  readOnly
                                  className='cursor-not-allowed w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm'
                                />
                              </div>
                              
                              {investigationReportData?.custom_decision && (
                                <div>
                                  <label htmlFor='custom-decision' className='block text-sm font-bold text-gray-700 mb-1'>
                                    Custom Decision:
                                  </label>
                                  <input
                                    id='custom-decision'
                                    type='text'
                                    value={investigationReportData.custom_decision}
                                    readOnly
                                    className='cursor-not-allowed w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm'
                                  />
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <label htmlFor='results' className='block text-sm font-bold text-gray-700 mb-1'>
                                Results:
                              </label>
                              <textarea
                                id='results'
                                value={investigationReportData?.results || 'N/A'}
                                readOnly
                                className='cursor-not-allowed w-full h-32 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm resize-none'
                              />
                            </div>
                          </div>
                        ) : (
                          investigationReportData?.attachments && (
                            <div className='mt-4'>
                            <object data={investigationReportData.attachments} width='100%' height='500px' />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default InvestigationReportDetailsModal;
