'use client';

import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import LoadingSpinner from '@/components/LoadingSpinner';
import CustomToast from '@/components/CustomToast';
import SendEmailModal from '@/components/SendEmailModal';
import SeparationLetterAttachmentSection from '../components/SeparationLetterAttachmentSection';
import CreateSeparationLetterModal from '../modals/CreateSeparationLetterModal';
import PlaceholderAvatar from '@/components/common/PlaceholderAvatar';

import useGetSeparationCase from './hooks/useGetSeparationCase';
import useExportSeparation from './hooks/useExportSeparation';
import useGetUserDetails from '@/components/hooks/useGetUserDetails';
import usePatchSeparation from '../hooks/usePatchSeparation';
import { handleEmailSending, handleLetterSending } from '../functions/emailHandlers';
import { getSeparationPhase, getSeparationProgress, PHASE_COLORS, PHASE_BAR_COLORS, SeparationPhase } from '../functions/separationPhase';

import StageStepper from '../components/StageStepper';
import ActivityLog from '../components/ActivityLog';
import InitiationStage from './stages/InitiationStage';
import RenderingStage from './stages/RenderingStage';
import ClearanceStage from './stages/ClearanceStage';
import FinalPayStage from './stages/FinalPayStage';
import LegalDocsStage from './stages/LegalDocsStage';
import ExitInterviewStage from './stages/ExitInterviewStage';
import CompletedStage from './stages/CompletedStage';

import BackButton from '@/components/BackButton';

import { T_DocumentsModal, T_LastPayModal, T_LetterModal } from '@/types/globals';
import { formatDateToLocal } from '@/helpers/date';
import classNames from '@/helpers/classNames';

type Props = {
  id: string;
  hasActiveSubscription: boolean;
};

const CaseDetailContent = ({ id, hasActiveSubscription }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: rawCase, isLoading, refetch } = useGetSeparationCase(id);
  const { mutate, isLoading: isMutating } = usePatchSeparation();

  const [localCase, setLocalCase] = useState<any>(null);
  const [activeStage, setActiveStage] = useState<SeparationPhase | null>(null);

  const [isGenerateLetterModalOpen, setIsGenerateLetterModalOpen] = useState<T_LetterModal | null>(null);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState<T_LetterModal | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState<T_DocumentsModal | null>(null);
  const [isLastPayModalOpen, setIsLastPayModalOpen] = useState<T_LastPayModal | null>(null);
  const [isLegalDocsModalOpen, setIsLegalDocsModalOpen] = useState<{ id: number } | null>(null);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [renderingTasksBlocked, setRenderingTasksBlocked] = useState(true);
  const [clearanceTasksBlocked, setClearanceTasksBlocked] = useState(true);
  const [finalPayTasksBlocked, setFinalPayTasksBlocked] = useState(true);
  const [legalDocsTasksBlocked, setLegalDocsTasksBlocked] = useState(true);
  const [freeNavigation, setFreeNavigation] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const { exportSeparation, isExporting } = useExportSeparation();
  const { data: usersData } = useGetUserDetails() as { data: any };
  const isDeveloper = usersData?.is_developer === true;

  const separation = localCase ?? rawCase;

  const basePhase: SeparationPhase = separation ? getSeparationPhase(separation) : 'Initiation';
  // Task gates: each gate only applies at its specific transition point.
  // Old data already past the gate (higher basePhase) passes through unaffected.
  let currentPhase: SeparationPhase;
  if (basePhase === 'Rendering') {
    currentPhase = renderingTasksBlocked ? 'Rendering' : 'Clearance';
  } else if (basePhase === 'Legal Docs' && clearanceTasksBlocked) {
    currentPhase = 'Clearance';
  } else if (basePhase === 'Legal Docs') {
    currentPhase = legalDocsTasksBlocked ? 'Legal Docs' : 'Exit Interview';
  } else if (basePhase === 'Final Settlement' && finalPayTasksBlocked) {
    currentPhase = 'Final Pay';
  } else {
    currentPhase = basePhase;
  }
  const displayStage: SeparationPhase = activeStage ?? currentPhase;
  const progress = separation ? getSeparationProgress(separation) : 0;
  const phaseColor = PHASE_COLORS[currentPhase];
  const barColor = PHASE_BAR_COLORS[currentPhase];

  // Sync localCase when rawCase arrives and no local override yet
  React.useEffect(() => {
    if (rawCase && !localCase) setLocalCase(rawCase);
  }, [rawCase]);

  const setReceived = (caseId: string, emailType: string) => {
    const loadingKey = `${caseId}-${emailType}`;
    setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));

    const copy = { ...separation, id: caseId, actionType: 'received', emailType, dateReceived: new Date() };
    const now = new Date().toISOString();
    if (emailType === 'letters') { copy.is_letter_received = true; copy.letter_received_date = now; }
    if (emailType === 'sign documents') { copy.is_documents_received = true; copy.documents_received_date = now; }

    mutate(copy, {
      onSuccess: (data: any) => {
        setLocalCase(copy);
        setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
        if (emailType === 'quit claim') queryClient.invalidateQueries(['employeePaginatedSelectCache']);
        refetch();
      },
      onError: (err: any) => {
        setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 7000 });
      },
    });
  };

  const handleLetterSubmit = (data: any) => {
    if (!isLetterModalOpen?.id || !separation) return;
    const items = [separation];
    const updatedItem = handleLetterSending(data, items, isLetterModalOpen.id, isLetterModalOpen.type);
    mutate(updatedItem, {
      onSuccess: (res: any) => {
        setIsLetterModalOpen(null);
        toast.custom(() => <CustomToast message={res.message} type='success' />, { duration: 5000 });
        refetch().then(() => setLocalCase(null));
      },
      onError: (err: any) => toast.custom(() => <CustomToast message={err} type='error' />, { duration: 7000 }),
    });
  };

  const handleDocumentsSubmit = (data: any) => {
    if (!isDocumentModalOpen?.id || !separation) return;
    const items = [separation];
    const updatedItem = handleEmailSending(data, 'sign documents', items, isDocumentModalOpen.id);
    mutate(updatedItem, {
      onSuccess: (res: any) => {
        setIsDocumentModalOpen(null);
        toast.custom(() => <CustomToast message={res.message} type='success' />, { duration: 5000 });
        refetch().then(() => setLocalCase(null));
      },
      onError: (err: any) => toast.custom(() => <CustomToast message={err} type='error' />, { duration: 7000 }),
    });
  };

  const handleLastPaySubmit = (data: any) => {
    if (!isLastPayModalOpen?.id || !separation) return;
    const items = [separation];
    const updatedItem = handleEmailSending(data, 'last pay', items, isLastPayModalOpen.id);
    mutate(updatedItem, {
      onSuccess: (res: any) => {
        setIsLastPayModalOpen(null);
        toast.custom(() => <CustomToast message={res.message} type='success' />, { duration: 5000 });
        refetch().then(() => setLocalCase(null));
      },
      onError: (err: any) => toast.custom(() => <CustomToast message={err} type='error' />, { duration: 7000 }),
    });
  };

  const handleLegalDocsSubmit = (data: any) => {
    if (!isLegalDocsModalOpen?.id || !separation) return;
    const items = [separation];
    const updatedItem = handleEmailSending(data, 'legal docs', items, isLegalDocsModalOpen.id);
    mutate(updatedItem, {
      onSuccess: (res: any) => {
        setIsLegalDocsModalOpen(null);
        toast.custom(() => <CustomToast message={res.message} type='success' />, { duration: 5000 });
      },
      onError: (err: any) => toast.custom(() => <CustomToast message={err} type='error' />, { duration: 7000 }),
    });
  };

  const letterDefaultRecipients = useMemo(() => {
    if (!separation) return [];
    return separation.email ? [separation.email] : [];
  }, [separation]);

  const memoPrePopulatedData = useMemo(() => {
    if (!isLetterModalOpen || !separation) return undefined;
    const name = separation.name || 'Employee';
    const subject = separation.separation_subject?.trim()
      ? separation.separation_subject
      : `Letter of ${isLetterModalOpen.type} - ${name}`;
    const message = separation.separation_message?.trim()
      ? separation.separation_message
      : `<p>Dear ${name},</p><p>Please find attached your Letter of ${isLetterModalOpen.type}.</p><p>Best regards,<br>HR Department</p>`;
    let toEmails: string[] = [];
    if (separation.separation_to) {
      try {
        const parsed = JSON.parse(separation.separation_to);
        toEmails = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        toEmails = separation.separation_to ? [separation.separation_to] : [];
      }
    } else {
      toEmails = separation.email ? [separation.email] : [];
    }
    return { subject, message, to: toEmails, cc: [], bcc: [] };
  }, [isLetterModalOpen, separation]);

  if (isLoading) {
    return (
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-10'>
        <LoadingSpinner size="lg" color="yellow" />
      </div>
    );
  }

  if (!separation) {
    return (
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-10'>
        <p className='text-center text-gray-400'>Separation case not found.</p>
      </div>
    );
  }

  const nameParts = (separation.name || '').split(' ');
  const hasValidPhoto = !!separation.photo && !separation.photo.includes('no-photo.png') && !photoError;

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 pb-20'>
        {/* Back Navigation */}
        <div className='pt-4 pb-2'>
          <BackButton label="Employee Separation" onClick={() => router.push('/employee-separation')} />
        </div>

        {/* Employee Header Card */}
        <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
            {hasValidPhoto ? (
              <img
                src={separation.photo}
                alt={separation.name}
                className='w-14 h-14 rounded-full object-cover flex-shrink-0'
                onError={() => setPhotoError(true)}
              />
            ) : (
              <PlaceholderAvatar
                width={56}
                height={56}
                firstName={nameParts[0] || ''}
                lastName={nameParts.slice(1).join(' ')}
                className='flex-shrink-0'
              />
            )}
            <div className='flex-1'>
              <div className='flex flex-wrap items-center gap-3'>
                <h1 className='text-xl font-bold text-gray-900'>{separation.name}</h1>
                {separation.employee_id && (
                  <span className='text-sm font-semibold text-indigo-600'>{separation.employee_id}</span>
                )}
                <span className={classNames('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', phaseColor)}>
                  {currentPhase}
                </span>
                {isDeveloper && (
                  <button
                    onClick={() => setFreeNavigation(prev => !prev)}
                    className='text-xs px-2 py-1 rounded border border-red-400 text-red-500 bg-red-50 hover:bg-red-100 transition-colors'
                  >
                    [Test] {freeNavigation ? 'Stage Nav: Free' : 'Stage Nav: Restricted'}
                  </button>
                )}
              </div>
              <p className='text-sm text-gray-500 mt-0.5'>{separation.email || '—'}</p>
            </div>
            <div className='sm:text-right flex-shrink-0'>
              <p className='text-xs text-gray-400 uppercase tracking-wide'>Last Working Day</p>
              <p className='text-sm font-semibold text-gray-800 mt-0.5'>
                {separation.effective_date ? formatDateToLocal(separation.effective_date) : formatDateToLocal(separation.date_of_separation)}
              </p>
              <div className='mt-2'>
                <p className='text-xs text-gray-400 mb-1'>Overall Progress</p>
                <div className='flex items-center gap-2'>
                  {displayStage === 'Final Settlement' && (
                    <button
                      onClick={() => exportSeparation(separation.id)}
                      disabled={isExporting}
                      className='flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-indigo-dye rounded-md hover:bg-opacity-90 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isExporting ? (
                        <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-white' />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      )}
                      {isExporting ? 'Exporting...' : 'Export'}
                    </button>
                  )}
                  <div className='w-28 bg-gray-200 rounded-full h-2'>
                    <div className={classNames('h-2 rounded-full transition-all', barColor)} style={{ width: `${progress}%` }} />
                  </div>
                  <span className='text-xs font-semibold text-gray-700'>{progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5'>
          <StageStepper
            currentPhase={currentPhase}
            onStageClick={(phase) => setActiveStage(phase)}
            freeNavigation={freeNavigation}
          />
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
          {/* Stage Panel */}
          <div className='lg:col-span-2'>
            {displayStage === 'Initiation' && (
              <InitiationStage
                separation={separation}
                onOpenLetterModal={(modal) => setIsGenerateLetterModalOpen(modal)}
                onOpenSendLetterModal={(modal) => setIsLetterModalOpen(modal)}
                onMarkReceived={setReceived}
                isLoading={loadingStates[`${separation.id}-letters`] || false}
              />
            )}
            {displayStage === 'Rendering' && (
              <RenderingStage
                separation={separation}
                currentPhase={currentPhase}
                onTasksChange={(hasAny, allComplete) => setRenderingTasksBlocked(!hasAny || !allComplete)}
                onSave={() => refetch().then(() => setLocalCase(null))}
              />
            )}
            {displayStage === 'Clearance' && (
              <ClearanceStage
                separation={separation}
                onOpenDocumentsModal={(modal) => setIsDocumentModalOpen(modal)}
                onMarkReceived={setReceived}
                isLoading={loadingStates[`${separation.id}-sign documents`] || false}
                onTasksChange={(hasAny, allComplete) => setClearanceTasksBlocked(!hasAny || !allComplete)}
              />
            )}
            {displayStage === 'Final Pay' && (
              <FinalPayStage
                separation={separation}
                onOpenLastPayModal={(modal) => setIsLastPayModalOpen(modal)}
                onTasksChange={(hasAny, allComplete) => setFinalPayTasksBlocked(!hasAny || !allComplete)}
              />
            )}
            {displayStage === 'Legal Docs' && (
              <LegalDocsStage
                separation={separation}
                onTasksChange={(hasAny, allComplete) => setLegalDocsTasksBlocked(!hasAny || !allComplete)}
                onOpenLegalDocsEmail={(modal) => setIsLegalDocsModalOpen(modal)}
              />
            )}
            {displayStage === 'Exit Interview' && (
              <ExitInterviewStage
                separation={separation}
                refetch={() => refetch().then(() => setLocalCase(null))}
              />
            )}
            {displayStage === 'Final Settlement' && (
              <CompletedStage separation={separation} />
            )}

          </div>

          {/* Activity Log */}
          <div className='lg:col-span-1'>
            <ActivityLog separation={separation} />
          </div>
        </div>
      </div>

      {/* Generate Letter Modal */}
      {isGenerateLetterModalOpen && (
        <CreateSeparationLetterModal
          isOpen={!!isGenerateLetterModalOpen}
          setIsOpen={(val) => !val && setIsGenerateLetterModalOpen(null)}
          separationId={isGenerateLetterModalOpen.id}
          letterType={isGenerateLetterModalOpen.type as 'Acceptance' | 'Separation'}
          refetch={() => refetch().then(() => setLocalCase(null))}
          employerName={separation?.employer_name}
          dateOfSeparation={separation?.date_of_separation}
          onSuccess={() => {
            refetch().then(() => setLocalCase(null));
            const type = isGenerateLetterModalOpen.type;
            const sepId = isGenerateLetterModalOpen.id;
            setIsGenerateLetterModalOpen(null);
            setIsLetterModalOpen({ id: sepId, type });
          }}
        />
      )}

      {/* Email Modals */}
      {isLetterModalOpen && (
        <SendEmailModal
          title={`Letter of ${isLetterModalOpen.type}`}
          isOpen={!!isLetterModalOpen}
          onClose={() => setIsLetterModalOpen(null)}
          onSubmit={handleLetterSubmit}
          defaultRecipients={letterDefaultRecipients}
          showDragDropAttachment={true}
          allowMultipleAttachments={true}
          showAttachment={true}
          customAttachmentSection={
            <SeparationLetterAttachmentSection
              pdfAttachment={separation?.letter_attachment ?? null}
              letterType={isLetterModalOpen.type as 'Acceptance' | 'Separation'}
              onViewAttachment={(url: string) => window.open(url, '_blank')}
              canShowPreview={true}
            />
          }
          submitButtonText="Send Letter"
          isLoading={isMutating}
          prePopulatedData={memoPrePopulatedData}
        />
      )}
      {isDocumentModalOpen && (
        <SendEmailModal
          title="Sign Documents"
          isOpen={!!isDocumentModalOpen}
          onClose={() => setIsDocumentModalOpen(null)}
          onSubmit={handleDocumentsSubmit}
          defaultRecipients={letterDefaultRecipients}
          showDragDropAttachment={true}
          allowMultipleAttachments={true}
          submitButtonText="Send"
          isLoading={isMutating}
        />
      )}
      {isLastPayModalOpen && (
        <SendEmailModal
          title="Send Last Pay"
          isOpen={!!isLastPayModalOpen}
          onClose={() => setIsLastPayModalOpen(null)}
          onSubmit={handleLastPaySubmit}
          defaultRecipients={letterDefaultRecipients}
          showDragDropAttachment={true}
          allowMultipleAttachments={true}
          submitButtonText="Send"
          isLoading={isMutating}
        />
      )}
      {isLegalDocsModalOpen && (
        <SendEmailModal
          title="Send Legal Docs Files"
          isOpen={!!isLegalDocsModalOpen}
          onClose={() => setIsLegalDocsModalOpen(null)}
          onSubmit={handleLegalDocsSubmit}
          defaultRecipients={letterDefaultRecipients}
          showDragDropAttachment={false}
          showAttachment={false}
          submitButtonText="Send Files"
          isLoading={isMutating}
        />
      )}
    </>
  );
};

export default CaseDetailContent;
