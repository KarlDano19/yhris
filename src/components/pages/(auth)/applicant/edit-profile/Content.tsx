'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useGetApplicantProfile from '@/components/hooks/useGetApplicantProfile';
import classNames from '@/helpers/classNames';
import ProfileTab from './profile/Tab';
import ContactsTab from './contacts/Tab';
import useSaveApplicantProfile from './hooks/useSaveApplicantProfile';

import { T_ApplicantProfile } from '@/types/globals';

const Content = () => {
  const history = useRouter();
  const [tabs, setTabs] = useState([
    { name: 'Profile', current: true },
    { name: 'Contacts', current: false },
  ]);
  const { register, setValue, watch, handleSubmit, control } = useForm<T_ApplicantProfile>();
  const { data: applicantProfileData, isLoading: isApplicantProfileLoading } = useGetApplicantProfile();
  const { mutate, isLoading } = useSaveApplicantProfile();

  useEffect(() => {
    if (applicantProfileData) {
      setValue('imagePath', applicantProfileData.photo);
      setValue('firstname', applicantProfileData.firstname);
      setValue('middlename', applicantProfileData.middlename);
      setValue('lastname', applicantProfileData.lastname);
      setValue('email', applicantProfileData.email);
      setValue('birthDay', new Date(applicantProfileData.birth_date));
      setValue('age', applicantProfileData.age);
      setValue('gender', applicantProfileData.gender);
      setValue('religion', applicantProfileData.religion);
      setValue('nationality', applicantProfileData.nationality);
      setValue('civilStatus', applicantProfileData.civil_status);
      setValue('address', applicantProfileData.address);
      setValue('mobile', applicantProfileData.mobile);
      setValue('landLineNo', applicantProfileData.landline);
      setValue('contactPersonName', applicantProfileData.contact_person_name);
      setValue('contactPersonAddress', applicantProfileData.contact_person_address);
      setValue('contactPersonContactNo', applicantProfileData.contact_person_mobile);
      setValue('contactPersonRelationship', applicantProfileData.contact_person_relationship);
      setValue('contactPersonAge', applicantProfileData.contact_person_age);
    }
  }, [applicantProfileData]);


  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: async (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
        history.push('/apply-for-a-job');
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
      },
    };
    mutate(data, callbackReq);
  });

  const handleTabChange = (selectedTabName: string) => {
    const updatedTabs = tabs.map((tab) => {
      if (tab.name === selectedTabName) {
        return { ...tab, current: true };
      } else {
        return { ...tab, current: false };
      }
    });

    setTabs(updatedTabs);
  };

  const classNames = (...classes: any) => {
    return classes.filter(Boolean).join(' ');
  };

  const currentTab = tabs.find((tab) => tab.current);

  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 `}>
      <div className='p-4'>
        <h3 className='text-2xl text-indigo-dye font-semibold'>Edit Profile</h3>
        <div>
          {/* Tab header section */}
          <div className='mt-5'>
            <div className='sm:hidden'>
              <label htmlFor='tabs' className='sr-only'>
                Select a tab
              </label>
              {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
              <select
                id='tabs'
                name='tabs'
                className='block py-2 px-4 w-full rounded-md border border-gray-300'
                // @ts-expect-error
                defaultValue={tabs.find((tab) => tab.current).name}
                onChange={(event) => handleTabChange(event.target.value)}
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className='hidden sm:block'>
              <nav className='-mb-px flex md:space-x-4 lg:space-x-14' aria-label='Tabs'>
                {tabs.map((tab) => (
                  <li
                    key={tab.name}
                    className={classNames(
                      tab.current
                        ? 'border-savoy-blue text-savoy-blue'
                        : 'text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'w-1/2 border-b-4 py-4 px-1 text-center text-sm font-semibold list-none cursor-pointer'
                    )}
                    aria-current={tab.current ? 'page' : undefined}
                    onClick={() => handleTabChange(tab.name)}
                  >
                    {tab.name}
                  </li>
                ))}
              </nav>
            </div>
          </div>
          <div>
            {
              // @ts-expect-error
              currentTab.name === 'Contacts' ? (
                <ContactsTab
                  {...{
                    register,
                    onSubmit,
                    isLoading,
                  }}
                />
              ) : (
                <ProfileTab
                  {...{
                    register,
                    watch,
                    setValue,
                    control,
                    Controller,
                    onSubmit,
                    isLoading,
                  }}
                />
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
