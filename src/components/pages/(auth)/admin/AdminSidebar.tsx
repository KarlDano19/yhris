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

import { Tooltip } from 'react-tooltip';

import CustomToast from '@/components/CustomToast';
import SendEmailModal from '@/components/SendEmailModal';
import MainLogo from '@/svg/MainLogo';
import MainIconOnly from '@/svg/MainIconOnly';

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

const AdminSidebar = ({ isOpen = true, onClose }: { isOpen?: boolean; onClose?: () => void }) => {
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

  // Shared nav item classes — icon always left-aligned with smooth padding transition
  const navLinkBase = `flex items-center gap-3 rounded-lg text-sm py-2 transition-all duration-300 ease-in-out`;
  // Icon padding: px-3 when open, px-[14px] when collapsed.
  // nav has px-2 (8px) container padding, so 8 + 14 = 22px from sidebar edge,
  // which centres a 20px icon in the 64px collapsed strip (same as the logo).
  const navPadding = isOpen ? 'px-3' : 'px-[14px]';

  return (
    <>
      <aside
        className={`min-h-screen flex flex-col shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? 'w-56 bg-white border-r border-gray-200'
            : 'w-0 md:w-16 bg-transparent border-r-0'
        }`}
      >
        {/* Logo — full when open, icon-only when collapsed — matches header h-16 */}
        <div className={`h-16 flex items-center shrink-0 mb-2 transition-all duration-300 ${isOpen ? 'px-4' : 'justify-center px-0'}`}>
          {isOpen ? <MainLogo /> : <MainIconOnly className='w-8 h-8' />}
        </div>

        {/* "Admin Panel" label — fades in when open */}
        <div
          className={`px-4 mt-4 mb-2 overflow-hidden transition-all duration-200 ${
            isOpen ? 'opacity-100 max-h-8' : 'opacity-0 max-h-0 mt-0 mb-0'
          }`}
        >
          <p className='text-xs font-semibold text-gray-400 uppercase tracking-widest'>Admin Panel</p>
        </div>

        {/* Nav items */}
        <nav className='flex-1 space-y-1 px-2 mt-2'>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${navLinkBase} ${navPadding} ${
                  isActive
                    ? 'bg-indigo-50 text-savoy-blue font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                data-tooltip-id='sidebar-nav-tooltip'
                data-tooltip-content={item.label}
                data-tooltip-place='right'
                data-tooltip-hidden={isOpen}
              >
                <Icon className='w-5 h-5 shrink-0' />
                {/* Label always in DOM — fades in with delay so it appears after sidebar widens */}
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-150 ${
                    isOpen ? 'opacity-100 max-w-xs delay-150' : 'opacity-0 max-w-0'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Advisory button */}
          <button
            onClick={() => { onClose?.(); setIsAdvisoryModalOpen(true); }}
            className={`w-full ${navLinkBase} ${navPadding} text-gray-600 hover:bg-gray-100`}
            data-tooltip-id='sidebar-nav-tooltip'
            data-tooltip-content='Advisory'
            data-tooltip-place='right'
            data-tooltip-hidden={isOpen}
          >
            <EnvelopeIcon className='w-5 h-5 shrink-0' />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-150 ${
                isOpen ? 'opacity-100 max-w-xs delay-150' : 'opacity-0 max-w-0'
              }`}
            >
              Advisory
            </span>
          </button>

          <Tooltip id='sidebar-nav-tooltip' positionStrategy='fixed' style={{ zIndex: 9999 }} />
        </nav>
      </aside>

      {isAdvisoryModalOpen && (
        <SendEmailModal
          title='Send Advisory'
          isOpen={isAdvisoryModalOpen}
          onClose={() => setIsAdvisoryModalOpen(false)}
          onSubmit={handleAdvisorySubmit}
          defaultRecipients={[]}
          showEmailTemplate={false}
          showAttachment={false}
          submitButtonText='Send Advisory'
          isLoading={isSendingAdvisory}
          emailFieldDataSource='clients'
        />
      )}
    </>
  );
};

export default AdminSidebar;
