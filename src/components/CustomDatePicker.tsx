import React, { forwardRef } from 'react';

import DatePicker from 'react-datepicker';
import DateCalendar from '@/svg/DateCalendar';

import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePicker = ({
  id,
  selected = new Date(),
  pickerOnChange,
  inputOnChange,
  minDate,
  placeholder,
  disabled,
  className,
  required,
}: {
  id: string;
  pickerOnChange: any;
  inputOnChange: any;
  selected?: any;
  minDate?: any;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}) => {
  const isGoodDate = (date: any) => {
    var regexGoodDate = /^(?:(0[1-9]|1[012])[\/.](0[1-9]|[12][0-9]|3[01])[\/.](19|20)[0-9]{2})$/;
    return regexGoodDate.test(date);
  };

  // eslint-disable-next-line react/display-name
  const CustomInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <>
      <input
        ref={ref}
        // defaultValue={value || new Date().toLocaleDateString()}
        value={value || new Date().toLocaleDateString()}
        onClick={() => {
          onClick();
        }}
        onChange={(e) => {
          if (e.target.value) {
            if (!isGoodDate(e.target.value)) return;
            inputOnChange(new Date(e.target.value));
          } else {
            inputOnChange('');
          }
        }}
        id={id}
        type='text'
        autoComplete='off'
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
      <button
        id={`${id}-datepicker-button`}
        type='button'
        className='cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 disabled:pointer-events-none disabled:opacity-50'
        onClick={() => {
          onClick();
        }}
        disabled={disabled}
      >
        <DateCalendar />
      </button>
    </>
  ));

  return (
    <DatePicker
      wrapperClassName='w-full'
      popperClassName='!z-20'
      selected={selected}
      onChange={(date) => pickerOnChange(date)}
      minDate={minDate}
      customInput={<CustomInput />}
      popperModifiers={[
        {
          name: 'arrow',
          options: { padding: 24 },
        },
      ]}
    />
  );
};

export default CustomDatePicker;
