'use client';

import React from 'react';

import MenuItem from '../../MenuItem';
import useGetAcceptanceMemo from '@/components/pages/(auth)/employer/manage/document-generator/hooks/useGetAcceptanceMemo';
import BackButton from '@/components/BackButton';
import UserLogo from '@/svg/UserIcon';
import CreateMemoLogo from '@/svg/CreateMemoLogo';
import GeneralSettingsLogo from '@/svg/GeneralSettingIcon';
import OrgStructureLogo from '@/svg/OrgStructureLogo';

const menus = [
  {
    icon: <GeneralSettingsLogo />,
    text: 'General Settings',
    link: '/settings/general-settings',
    isAvailable: true,
  },
  {
    icon: <UserLogo />,
    text: 'Users',
    link: '/settings/users',
    isAvailable: true,
  },
  {
    icon: <OrgStructureLogo />,
    text: <>Org Structure<br/>Settings</>,
    link: '/settings/org-structure',
    isAvailable: true,
  },
  {
    icon: <CreateMemoLogo />,
    text: 'Acceptance Form',
    link: '/settings/acceptance-form',
    isAvailable: true,
  },
];

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const { data: memoData } = useGetAcceptanceMemo();
  const visibleMenus = memoData
    ? menus
    : menus.filter((m) => m.link !== '/settings/acceptance-form');

  return (
    <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8'>
      <div className='flex p-4'>
        <BackButton label="Dashboard" />
      </div>
      <div className='px-2 md:px-8 lg:px-4'>
        <h2 className='text-xl font-bold text-indigo-dye'>Settings</h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6'>
          {visibleMenus.map((menu, index) => {
            return <MenuItem key={index} menu={menu} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Content;