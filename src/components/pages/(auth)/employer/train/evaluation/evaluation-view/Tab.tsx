'use client';
import { useState } from 'react';

import SelectChevronDown from '@/svg/SelectChevronDown';
import MinusIcon from '@/svg/MinusIcon';
import PlusIcon from '@/svg/PlusIcon';
import { useFormContext } from 'react-hook-form';
import GearIcon from '@/svg/GearIcon';
import classNames from '@/helpers/classNames';
import DropdownIcon from '@/svg/DropdownIcon';
import SliderIcon from '@/svg/SliderIcon';
const Tab = () => {
  const [viewStyle, setViewStyle] = useState('');
  const { setValue } = useFormContext();

  const handleClickViewStyle = (value: any) => {
    if (value === 'default' || value === 'dropdown' || value === 'slider') {
      setViewStyle(value);
      setValue('criteria_rating_view_type', value);
    }
  };

  return (
    <>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
        <div className='px-2 md:px-8 lg:px-4'>
          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8 space-y-6'>
                <label className='font-semibold text-xl'>How do you want your sheet/form to look like?</label>
                <div className='flex mt-2 w-full border rounded-xl border-[#ACB9CB] py-10 px-4 justify-center space-x-20'>
                  <div
                    onClick={() => handleClickViewStyle('default')}
                    className={classNames(
                      'flex flex-col items-center border rounded-xl space-y-2 py-6 px-7 shadow-md hover:cursor-pointer',
                      viewStyle === 'default' ? 'border-blue-600' : 'border-[#ACB9CB]'
                    )}
                  >
                    <GearIcon fill={viewStyle === 'default' ? '#355FD0' : '#ACB9CB'} />
                    <label className='text-sm'>Default</label>
                  </div>
                  <div
                    onClick={() => handleClickViewStyle('dropdown')}
                    className={classNames(
                      'flex flex-col items-center border rounded-xl space-y-2 py-6 px-4 shadow-md hover:cursor-pointer',
                      viewStyle === 'dropdown' ? 'border-blue-600' : 'border-[#ACB9CB]'
                    )}
                  >
                    <DropdownIcon fill={viewStyle === 'dropdown' ? '#355FD0' : '#ACB9CB'} />
                    <label className='text-sm'>Dropdown</label>
                  </div>
                  <div
                    onClick={() => handleClickViewStyle('slider')}
                    className={classNames(
                      'flex flex-col items-center border rounded-xl space-y-2 py-6 px-8 shadow-md hover:cursor-pointer',
                      viewStyle === 'slider' ? 'border-blue-600' : 'border-[#ACB9CB]'
                    )}
                  >
                    <SliderIcon fill={viewStyle === 'slider' ? '#355FD0' : '#ACB9CB'} />
                    <label className='text-sm'>Slider</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tab;
