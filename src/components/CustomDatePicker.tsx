'use client';

import React, { forwardRef, useState, useEffect, useRef } from 'react';

import DatePicker from 'react-datepicker';
import DateCalendar from '@/svg/DateCalendar';

import 'react-datepicker/dist/react-datepicker.css';

// Custom styles for year and month dropdowns
const customStyles = `
  .react-datepicker__year-select,
  .react-datepicker__month-select {
    padding: 2px 12px 2px 12px !important;
  }
`;

const CustomDatePicker = ({
  id,
  selected = new Date(),
  pickerOnChange,
  inputOnChange,
  minDate,
  maxDate,
  excludeDates,
  placeholder,
  disabled,
  className,
  required,
  tabIndex,
  usePortal = false,
}: {
  id: string;
  pickerOnChange: any;
  inputOnChange: any;
  selected?: any;
  minDate?: any;
  maxDate?: any;
  excludeDates?: Date[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  tabIndex?: number;
  usePortal?: boolean;
}) => {
  const isGoodDate = (date: any) => {
    const regexGoodDate = /^(?:(0[1-9]|1[012])[\/.](0[1-9]|[12][0-9]|3[01])[\/.](19|20)\d{2})$/;
    return regexGoodDate.test(date);
  };

  // eslint-disable-next-line react/display-name
  const CustomInput = forwardRef(({ value, onClick, onChange }: any, ref: any) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
      setInputValue(value ?? '');
    }, [value]);
    
    return (
      <>
        <input
          ref={ref}
          value={inputValue}
          onClick={onClick}
          onKeyDown={(e) => {
            const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
            const isDigit = e.key >= '0' && e.key <= '9';
            const isSlash = e.key === '/';
            if (!isDigit && !isSlash && !allowed.includes(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const typedValue = e.target.value;
            setInputValue(typedValue);
            if (typedValue === '') {
              onChange({ target: { value: '' } }); // propagate clear to DatePicker
              if (pickerOnChange) pickerOnChange(null); // clear the selected date in parent
            } else if (isGoodDate(typedValue)) {
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
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick(e);
          }}
          disabled={disabled}
          tabIndex={-1}
        >
          <DateCalendar />
        </button>
      </>
    );
  });

  return (
    <>
      <style>{customStyles}</style>
      {/* @ts-ignore */}
      <DatePicker
        wrapperClassName='w-full relative'
        popperClassName='!z-[9999]'
        selected={selected}
        onChange={date => {
          if (date) {
            pickerOnChange(date);
            inputOnChange(date);
          }
        }}
        minDate={minDate}
        maxDate={maxDate}
        excludeDates={excludeDates}
        customInput={<CustomInput />}
        popperModifiers={[
          {
            name: 'arrow',
            options: { padding: 24 },
          },
        ]}
        showYearDropdown
        showMonthDropdown
        dropdownMode='select'
        withPortal={usePortal}
        portalId={usePortal ? 'datepicker-portal' : undefined}
      />
    </>
  );
};

export default CustomDatePicker;
