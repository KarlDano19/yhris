'use client';

import React, { forwardRef, useState, useEffect } from 'react';

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
  tabIndex,
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
  tabIndex?: number;
}) => {
  const isGoodDate = (date: any) => {
    const regexGoodDate = /^(?:(0[1-9]|1[012])[\/.](0[1-9]|[12][0-9]|3[01])[\/.](19|20)\d{2})$/;
    return regexGoodDate.test(date);
  };

  // eslint-disable-next-line react/display-name
  const CustomInput = forwardRef(({ value, onClick, onChange }: any, ref: any) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
      setInputValue(value);
    }, [value]);
    
    return (
      <>
        <input
          ref={ref}
          value={inputValue}
          onClick={onClick}
          onChange={(e) => {
            const typedValue = e.target.value;
            setInputValue(typedValue);
            if (isGoodDate(typedValue)) {
              onChange(e); // This will sync with DatePicker
            }
          }}
          id={id}
          type='text'
          autoComplete='off'
          className={className}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          tabIndex={tabIndex}
        />
        <button
          id={`${id}-datepicker-button`}
          type='button'
          className='cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 disabled:pointer-events-none disabled:opacity-50'
          onClick={onClick}
          disabled={disabled}
          tabIndex={-1}
        >
          <DateCalendar />
        </button>
      </>
    );
  });

  return (
    <DatePicker
      wrapperClassName='w-full'
      popperClassName='!z-20'
      selected={selected}
      onChange={date => {
        if (date) {
          pickerOnChange(date);
          inputOnChange(date);
        }
      }}
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
