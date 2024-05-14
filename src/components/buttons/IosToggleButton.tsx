import { ChangeEvent, useState, useEffect } from 'react';
import classNames from '@/helpers/classNames';

interface IOSToggleButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const IOSToggleButton = ({ checked, onChange }: IOSToggleButtonProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setIsChecked(newValue);
    onChange(newValue);
  };

  return (
    <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        id="toggle"
        name="toggle"
        className="toggle-ios-checkbox hidden"
        checked={isChecked}
        onChange={handleInputChange}
      />
      <label
        htmlFor="toggle"
        className='toggle-ios-label block overflow-hidden border-2 bg-white border-blue-500 h-5 rounded-full cursor-pointer transition-colors'
      >
        <span
          className={classNames(
            'toggle-ios-handle absolute block w-2 h-2 rounded-full bg-blue-500 transition-transform',
            isChecked ? 'transform translate-x-5' : 'transform translate-x-0'
          )}
        ></span>
      </label>
    </div>
  );
};

export default IOSToggleButton;