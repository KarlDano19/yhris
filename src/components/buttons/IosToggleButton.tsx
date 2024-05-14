import { ChangeEvent, useState } from 'react';

import classNames from '@/helpers/classNames';

interface IOSToggleButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const IOSToggleButton = ({ checked, onChange }: IOSToggleButtonProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setIsChecked(newValue);
    onChange(newValue);
  };

  return (
    <div className='relative inline-block w-10 align-middle select-none transition duration-200 ease-in'>
      <input
        type='checkbox'
        id='toggle'
        name='toggle'
        className={classNames(
          'toggle-ios-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer',
          isChecked ? 'bg-blue-500' : 'bg-gray-300'
        )}
        checked={isChecked}
        onChange={handleInputChange}
      />
      <label
        htmlFor='toggle'
        className='toggle-ios-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer'
      ></label>
    </div>
  );
};

export default IOSToggleButton;
