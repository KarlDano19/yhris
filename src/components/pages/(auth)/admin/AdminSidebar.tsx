'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  HomeIcon,
  UsersIcon,
  UserCircleIcon,
  CogIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  EnvelopeIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import SendEmailModal from '@/components/SendEmailModal';

import useSendAdvisoryEmail from './hooks/useSendAdvisoryEmail';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { label: 'Clients', href: '/admin/client-monitoring', icon: UsersIcon },
  { label: 'Applicants', href: '/admin/applicant-monitoring', icon: UserCircleIcon },
  { label: 'Client Onboarding', href: '/admin/employer-onboarding', icon: UserGroupIcon },
  { label: 'Kickoff Management', href: '/admin/kickoff-management', icon: RocketLaunchIcon },
  { label: 'Partners', href: '/admin/kickoff-management/partners', icon: BriefcaseIcon },
  { label: 'Management', href: '/admin/management', icon: CogIcon },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isAdvisoryModalOpen, setIsAdvisoryModalOpen] = useState(false);
  const { mutate: sendAdvisory, isLoading: isSendingAdvisory } = useSendAdvisoryEmail();

  const handleAdvisorySubmit = (data: any) => {
    if (!isAdvisoryModalOpen) return;

    sendAdvisory(data, {
      onSuccess: (res: any) => {
        setIsAdvisoryModalOpen(false);
        toast.custom(<CustomToast message={res?.message} type="success" />);
      },
      onError: (err: any) => {
        const errorMessage =
          err?.message || err?.response?.data?.message || 'Failed to send advisory. Please try again.';
        toast.custom(<CustomToast message={errorMessage} type="error" />);
      },
    });
  };

  return (
    <>
      <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col py-6 shrink-0">
        <div className="px-4 mb-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-savoy-blue font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => setIsAdvisoryModalOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-gray-600 hover:bg-gray-100"
          >
            <EnvelopeIcon className="w-5 h-5 shrink-0" />
            Advisory
          </button>
        </nav>
      </aside>

      {isAdvisoryModalOpen && (
        <SendEmailModal
          title="Send Advisory"
          isOpen={isAdvisoryModalOpen}
          onClose={() => setIsAdvisoryModalOpen(false)}
          onSubmit={handleAdvisorySubmit}
          defaultRecipients={[]}
          showEmailTemplate={false}
          showAttachment={false}
          submitButtonText="Send Advisory"
          isLoading={isSendingAdvisory}
        />
      )}
    </>
  );
};

export default AdminSidebar;
