import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import DateCalendar from '@/svg/DateCalendar';

import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePicker = ({
  name,
  selected,
  pickerOnChange,
  inputOnChange,
  minDate,
  placeholder,
  disabled,
  objectFilter,
  className,
  required,
}: {
  name: any;
  selected?: any;
  pickerOnChange: any;
  inputOnChange: any;
  minDate?: any;
  placeholder?: any;
  disabled?: any;
  objectFilter?: any;
  className?: any;
  required?: any;
}) => {
  const isGoodDate = (date: any) => {
    var regexGoodDate = /^(?:(0[1-9]|1[012])[\/.](0[1-9]|[12][0-9]|3[01])[\/.](19|20)[0-9]{2})$/;
    return regexGoodDate.test(date);
  };

  const CustomInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <>
      <input
        id={name}
        type='text'
        className={className}
        autoComplete='off'
        onChange={(event) => {
          let value: any = event.target.value;
          if (!isGoodDate(value)) return;
          if (objectFilter)
            inputOnChange({
              ...objectFilter,
              [name]: new Date(event.target.value),
            });
          if (!objectFilter) inputOnChange(new Date(event.target.value));
        }}
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        onClick={() => {
          onClick();
        }}
        ref={ref}
        required={required}
      />
      <div
        className='cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3'
        onClick={() => {
          onClick();
        }}
      >
        <DateCalendar />
      </div>
    </>
  ));

  return (
    <DatePicker
      wrapperClassName='w-full'
      selected={selected}
      onChange={(date) => {
        if (objectFilter) pickerOnChange({ ...objectFilter, [name]: date });
        if (!objectFilter) pickerOnChange(date);
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
