import React, { Dispatch, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Tooltip } from 'react-tooltip';

import classNames from '@/helpers/classNames';
import { T_NTEAttachmentViewModal, T_SendNTEModal, T_UploadEmployeeIssueAttachmentModal } from '@/types/globals';

import ClipIcon from '@/svg/ClipIcon';

const SendNTE = ({
  id,
  isNTESent,
  isNTEReceived,
  incidentReceivedDate,
  employeeIssueDetails,
  setIsSendNTEModalOpen,
  setIsUploadEmployeeIssueAttachmentModalOpen,
  setNTEAttachmentViewModalOpen,
  setReleased,
  isLoading,
  setIsRedirectingToDocumentGenerator,
  userRights,
}: {
  id: number;
  isNTESent: boolean;
  isNTEReceived: boolean;
  incidentReceivedDate?: string;
  employeeIssueDetails?: any;
  setIsSendNTEModalOpen: Dispatch<T_SendNTEModal>;
  setIsUploadEmployeeIssueAttachmentModalOpen: Dispatch<T_UploadEmployeeIssueAttachmentModal>;
  setNTEAttachmentViewModalOpen: Dispatch<T_NTEAttachmentViewModal>;
  setReleased: any;
  isLoading: boolean;
  setIsRedirectingToDocumentGenerator: Dispatch<boolean>;
  userRights?: any;
}) => {
  const router = useRouter();
  const [checkingAttachment, setCheckingAttachment] = useState(false);
  
  // const customOnclick = () => {
  //   setIsUploadEmployeeIssueAttachmentModalOpen({
  //     isOpen: true,
  //     id,
  //   });
  // };

  const handleSendClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if status is approved before proceeding
    if (employeeIssueDetails?.status !== 'approved') {
      return; // Do nothing if status is not approved
    }
    
    setCheckingAttachment(true);
    try {
      // Check if there's an attachment
      if (employeeIssueDetails && employeeIssueDetails.nte_attachment) {
        setIsSendNTEModalOpen({
          id,
          attachment: employeeIssueDetails.nte_attachment
        });
      } else {
        // If no attachment, redirect to document generator
        setIsRedirectingToDocumentGenerator(true);
        router.push('/manage/document-generator?type=notice-to-explain&employee=' + id);
      }
    } finally {
      setCheckingAttachment(false);
    }
  };

  // Format incident_received_date as MM/DD/YYYY
  let formattedReceivedDate = '';
  if (employeeIssueDetails && employeeIssueDetails.incident_received_date) {
    const date = new Date(employeeIssueDetails.incident_received_date);
    formattedReceivedDate = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  }

  return (
    <div className='flex flex-col gap-2 items-center justify-center min-h-[80px]'>
      <div>
        <button
          className={classNames(
            employeeIssueDetails && employeeIssueDetails.nte_attachment
              ? 'bg-red-500 border-[1px] border-red-500 text-white'
              : 'bg-transparent border-[1.5px] border-red-400 text-red-400',
            'items-center rounded-md px-2 py-1 focus:z-10 w-24 disabled:opacity-50'
          )}
          disabled={checkingAttachment || !userRights?.generate_employee_issue_nte || employeeIssueDetails?.status !== 'approved'}
          onClick={handleSendClick}
          title={!userRights?.generate_employee_issue_nte 
            ? 'No permission to generate NTE'
            : employeeIssueDetails?.status !== 'approved'
            ? 'NTE can only be generated when status is approved'
            : (employeeIssueDetails && employeeIssueDetails.nte_attachment
              ? (isNTESent ? 'Resend Notice to Explain' : 'Send Notice to Explain')
              : 'Click to Generate NTE')}
        >
          {checkingAttachment
            ? 'Checking...'
            : (isNTESent ? 'Resend' : 'Send')}
        </button>
      </div>
      <div>
        <button
          className={classNames(
            isNTEReceived ? 'bg-savoy-blue text-white' : 'bg-blue-100 text-blue-400',
            'items-center rounded-md px-2 py-1 focus:z-10 w-24 disabled:opacity-75'
          )}
          disabled={true}
          data-tooltip-id='nte-received-tooltip'
          data-tooltip-html={isNTEReceived ?
            'Marked as <span style="background-color: #4A90E2; color: white; padding: 1px 4px; border-radius: 3px; font-weight: 600;">received</span> when email is sent successfully' :
            'Will be marked as <span style="background-color: #4A90E2; color: white; padding: 1px 4px; border-radius: 3px; font-weight: 600;">received</span> when email is sent successfully'}
          data-tooltip-place='bottom'
          onClick={() => setReleased(id, 'nte')}
        >
          {isLoading && (
            <div role='status'>
              <svg
                aria-hidden='true'
                className='inline w-6 h-6 mr-2 text-gray-200 animate-spin fill-blue-600'
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
          )}
          {!isLoading && (isNTEReceived ? 'Received' : 'Receive')}
        </button>
      </div>
      {isNTEReceived && (
        <div className='flex gap-1 items-center justify-center'>
          <div className='relative'>
            <div
              className='cursor-pointer'
              data-tooltip-id='nte-clip-tooltip'
              data-tooltip-content='Click to view NTE attachment'
              data-tooltip-place='bottom'
              onClick={() =>
                setNTEAttachmentViewModalOpen({
                  isOpen: true,
                  id,
                })
              }
            >
              <ClipIcon hasFile={true} />
            </div>
            {/* Notification badge for response */}
            {employeeIssueDetails && employeeIssueDetails.is_responded && employeeIssueDetails.response && (
              <div className="absolute -top-2 -right-2.5 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                !
              </div>
            )}
          </div>
          <p className='text-xs ml-1'>{formattedReceivedDate}</p>
        </div>
      )}

      <Tooltip id='nte-received-tooltip' />
      <Tooltip id='nte-clip-tooltip' />
    </div>
  );
};

export default SendNTE;
