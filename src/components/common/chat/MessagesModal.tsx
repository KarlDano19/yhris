'use client';

import { Fragment, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { Tooltip } from 'react-tooltip';
import { XMarkIcon, BriefcaseIcon, UserIcon } from '@heroicons/react/24/outline';

import { useGetEmployerApplicantChatsList, type EmployerApplicantChatListItem } from '@/components/hooks/chat/employer/useGetEmployerApplicantChatsList';
import { useApplicantChatsList, type ApplicantChatListItem } from '@/components/hooks/chat/yahshua-connect/useApplicantChatsList';

// ============================================================================
// Helpers
// ============================================================================

function formatRelativeTime(iso?: string): string {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)}w ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
}

function formatFullDateTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

  // Today
  if (d.toDateString() === now.toDateString()) return time;

  // This week (Monday → today)
  const startOfWeek = new Date(now);
  const day = now.getDay();
  startOfWeek.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  startOfWeek.setHours(0, 0, 0, 0);
  if (d >= startOfWeek) {
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayName} ${time}`;
  }

  // Older
  const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return `${dateStr}, ${time}`;
}

// ============================================================================
// Types
// ============================================================================

type RoleType = 'employer' | 'applicant';
type TabType = 'personal' | 'business';

// Callback types for different chat selections
interface EmployerChatSelection {
  appliedJobId: number;
  jobTitle: string;
  applicantName: string;
  applicantPhoto?: string | null;
  applicantInitials: string;
}

interface PersonalChatSelection {
  appliedJobId: number;
  jobTitle: string;
  employerName: string;
  employerLogo?: string | null;
  employerInitials: string;
}

interface BusinessChatSelection {
  id: number;
  name: string;
  initials: string;
  recipientId: number;
  photo?: string | null;
  jobId?: number;
  jobTitle?: string;
}

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleType;

  // Employer role callback
  onSelectEmployerMessage?: (chat: EmployerChatSelection) => void;

  // Applicant role callbacks
  onSelectPersonalMessage?: (chat: PersonalChatSelection) => void;
  onSelectBusinessMessage?: (chat: BusinessChatSelection) => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

const getInitials = (name: string): string => {
  if (!name) return '?';
  const names = name.trim().split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// ============================================================================
// Main Component
// ============================================================================

const MessagesModal = ({
  isOpen,
  onClose,
  role,
  onSelectEmployerMessage,
  onSelectPersonalMessage,
  onSelectBusinessMessage,
}: MessagesModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');

  // Employer-Applicant chats (used by both roles)
  const { data: employerApplicantData, isLoading: isEmployerApplicantLoading, error: employerApplicantError } =
    useGetEmployerApplicantChatsList(undefined, isOpen);
  const employerApplicantChats = employerApplicantData?.records || [];

  // Applicant-to-Applicant chats (only for applicant role in business tab)
  const { data: applicantData, isLoading: isApplicantLoading, error: applicantError } =
    useApplicantChatsList(undefined, isOpen && role === 'applicant');
  const applicantChats = applicantData?.records || [];

  // Calculate unread counts
  const personalUnreadCount = employerApplicantChats.reduce((sum, chat) => sum + (chat.unread_count || 0), 0);
  const businessUnreadCount = applicantChats.reduce((sum, chat) => sum + (chat.unread_count || 0), 0);

  // Render empty state
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <p className="text-sm">No messages yet</p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-8 text-gray-500">
      <div className="text-sm">Loading messages...</div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex items-center justify-center py-8 text-red-500">
      <div className="text-sm">Failed to load messages</div>
    </div>
  );

  // Render employer chats (employer viewing applicant messages)
  const renderEmployerChats = () => {
    if (isEmployerApplicantLoading) return renderLoadingState();
    if (employerApplicantError) return renderErrorState();
    if (employerApplicantChats.length === 0) return renderEmptyState();

    return employerApplicantChats.map((chat: EmployerApplicantChatListItem) => {
      const initials = getInitials(chat.other_participant_name);
      const preview = chat.last_message || 'Start the conversation';

      return (
        <button
          key={chat.id}
          onClick={() => {
            onSelectEmployerMessage?.({
              appliedJobId: chat.applied_job_id,
              jobTitle: chat.job_title,
              applicantName: chat.other_participant_name,
              applicantPhoto: chat.other_participant_photo || null,
              applicantInitials: initials,
            });
            onClose();
          }}
          className="w-full flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 rounded-lg"
        >
          {chat.other_participant_photo && chat.other_participant_photo !== '/assets/no-user.png' ? (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
              <img src={chat.other_participant_photo} alt={chat.other_participant_name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-savoy-blue flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {initials}
            </div>
          )}
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-900 truncate">{chat.other_participant_name}</h4>
              {chat.unread_count > 0 && (
                <span className="ml-2 min-w-[24px] h-6 bg-savoy-blue text-white text-xs font-semibold rounded-full flex items-center justify-center px-2 flex-shrink-0">
                  {chat.unread_count}
                </span>
              )}
            </div>
            {chat.job_title && (
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs font-medium text-savoy-blue bg-savoy-blue/10 px-2 py-0.5 rounded">
                  {chat.job_title}
                </span>
              </div>
            )}
            <p className="text-sm text-gray-600 truncate">{preview}</p>
            {chat.last_message_at && (
              <p
                  className="text-xs text-gray-400 mt-1 cursor-default"
                  title={formatFullDateTime(chat.last_message_at)}
                >
                  {formatRelativeTime(chat.last_message_at)}
                </p>
            )}
          </div>
        </button>
      );
    });
  };

  // Render personal chats (applicant viewing employer messages)
  const renderPersonalChats = () => {
    if (isEmployerApplicantLoading) return renderLoadingState();
    if (employerApplicantError) return renderErrorState();
    if (employerApplicantChats.length === 0) return renderEmptyState();

    return employerApplicantChats.map((chat: EmployerApplicantChatListItem) => {
      const initials = getInitials(chat.other_participant_name);
      const preview = chat.last_message || 'Start the conversation';

      return (
        <button
          key={chat.id}
          onClick={() => {
            onSelectPersonalMessage?.({
              appliedJobId: chat.applied_job_id,
              jobTitle: chat.job_title,
              employerName: chat.other_participant_name,
              employerLogo: chat.other_participant_photo,
              employerInitials: initials,
            });
            onClose();
          }}
          className="w-full flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
        >
          {chat.other_participant_photo && chat.other_participant_photo !== '/assets/no-photo.png' ? (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
              <img src={chat.other_participant_photo} alt={chat.other_participant_name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-savoy-blue flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {initials}
            </div>
          )}
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-900 truncate">{chat.other_participant_name}</h4>
              {chat.unread_count > 0 && (
                <span className="ml-2 min-w-[24px] h-6 bg-savoy-blue text-white text-xs font-semibold rounded-full flex items-center justify-center px-2 flex-shrink-0">
                  {chat.unread_count}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs font-medium text-savoy-blue bg-savoy-blue/10 px-2 py-0.5 rounded">
                {chat.job_title}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate">{preview}</p>
            {chat.last_message_at && (
              <p
                  className="text-xs text-gray-400 mt-1 cursor-default"
                  title={formatFullDateTime(chat.last_message_at)}
                >
                  {formatRelativeTime(chat.last_message_at)}
                </p>
            )}
          </div>
        </button>
      );
    });
  };

  // Render business chats (applicant-to-applicant)
  const renderBusinessChats = () => {
    if (isApplicantLoading) return renderLoadingState();
    if (applicantError) return renderErrorState();
    if (applicantChats.length === 0) return renderEmptyState();

    return applicantChats.map((chat: ApplicantChatListItem) => {
      const initials = getInitials(chat.other_participant_name);
      const preview = chat.last_message || 'Start the conversation';

      return (
        <button
          key={chat.id}
          onClick={() => {
            onSelectBusinessMessage?.({
              id: chat.id,
              name: chat.other_participant_name,
              initials,
              recipientId: chat.other_participant_id,
              photo: chat.other_participant_photo || null,
              jobId: chat.business_job_posting_id || undefined,
              jobTitle: chat.business_job_posting_title || undefined,
            });
            onClose();
          }}
          className="w-full flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
        >
          {chat.other_participant_photo && chat.other_participant_photo !== '/assets/no-user.png' ? (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
              <img src={chat.other_participant_photo} alt={chat.other_participant_name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {initials}
            </div>
          )}
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-900 truncate">{chat.other_participant_name}</h4>
              {chat.unread_count > 0 && (
                <span className="ml-2 min-w-[24px] h-6 bg-green-600 text-white text-xs font-semibold rounded-full flex items-center justify-center px-2 flex-shrink-0">
                  {chat.unread_count}
                </span>
              )}
            </div>
            {chat.business_job_posting_title && (
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">
                  Job: {chat.business_job_posting_title}
                </span>
              </div>
            )}
            <p className="text-sm text-gray-600 truncate">{preview}</p>
            {chat.last_message_at && (
              <p
                  className="text-xs text-gray-400 mt-1 cursor-default"
                  title={formatFullDateTime(chat.last_message_at)}
                >
                  {formatRelativeTime(chat.last_message_at)}
                </p>
            )}
          </div>
        </button>
      );
    });
  };

  // Render tabs for applicant role
  const renderTabs = () => (
    <div className="flex border-b border-gray-200 mb-4">
      <button
        onClick={() => setActiveTab('personal')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
          activeTab === 'personal' ? 'text-savoy-blue' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <UserIcon className="h-5 w-5" />
        <span>Personal</span>
        {personalUnreadCount > 0 && (
          <span className="min-w-[20px] h-5 bg-savoy-blue text-white text-xs font-semibold rounded-full flex items-center justify-center px-1.5">
            {personalUnreadCount > 99 ? '99+' : personalUnreadCount}
          </span>
        )}
        {activeTab === 'personal' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-savoy-blue" />}
      </button>
      <button
        disabled
        data-tooltip-id="business-chat-tooltip"
        data-tooltip-content="Coming Soon"
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed opacity-50 relative"
      >
        <BriefcaseIcon className="h-5 w-5" />
        <span>Business</span>
      </button>
    </div>
  );

  // Render content based on role
  const renderContent = () => {
    if (role === 'employer') {
      return <div className="space-y-0 max-h-[400px] overflow-y-auto">{renderEmployerChats()}</div>;
    }

    // Applicant role with tabs
    return (
      <>
        {renderTabs()}
        <div className="space-y-0 max-h-[400px] overflow-y-auto">
          {activeTab === 'personal' ? renderPersonalChats() : renderBusinessChats()}
        </div>
      </>
    );
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-16">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
              className="w-full max-w-2xl"
            >
              <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                  <Dialog.Title as="h2" className="text-lg font-semibold text-gray-800">
                    Messages
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5">{renderContent()}</div>
                <Tooltip id="business-chat-tooltip" />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MessagesModal;
