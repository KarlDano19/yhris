import React from 'react';

import { Controller } from 'react-hook-form';
import Select, { components, StylesConfig, GroupBase, OptionsOrGroups } from 'react-select';

import SelectChevronDown from '@/svg/SelectChevronDown';

// Custom MenuList component to hide scrollbar arrows and show 5 items
const MenuList = (props: any) => {
  return (
    <components.MenuList
      {...props}
      className="custom-menu-list"
      style={{
        ...props.style,
        maxHeight: '175px',
      }}
    >
      {props.children}
    </components.MenuList>
  );
};

interface ReactSelectProps {
  name: string;
  control: any;
  rules?: any;
  options: OptionsOrGroups<any, GroupBase<any>>;
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  noOptionsMessage?: (obj: { inputValue: string }) => React.ReactNode;
  className?: string;
  width?: string;
  menuListComponent?: any;
}

export default function ReactSelect({
  name,
  control,
  rules,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isDisabled = false,
  isClearable = false,
  noOptionsMessage = () => 'No options available',
  className = '',
  width,
  menuListComponent = MenuList,
}: ReactSelectProps) {
  const defaultStyles: StylesConfig<any, false, GroupBase<any>> = {
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    control: (base, state) => ({
      ...base,
      backgroundColor: state.isDisabled ? '#f3f4f6' : base.backgroundColor,
      cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    }),
  };

  return (
    <div className={width ? `relative ${width}` : 'relative'}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange: fieldOnChange, value: fieldValue } }) => {
          const currentValue = value !== undefined ? value : fieldValue;
          const selectedOption = options.find((item: any) => item.value === String(currentValue));

          return (
            <Select
              className={`text-sm ${className}`}
              classNamePrefix='select'
              options={options}
              value={selectedOption}
              onChange={(val) => {
                const selectedValue = val?.value || '';
                if (onChange) {
                  onChange(selectedValue);
                } else {
                  fieldOnChange(selectedValue);
                }
              }}
              isDisabled={isDisabled}
              isClearable={isClearable}
              placeholder={placeholder}
              noOptionsMessage={noOptionsMessage}
              menuPortalTarget={document.body}
              components={{
                DropdownIndicator: () => (
                  <div className='pointer-events-none px-2'>
                    <SelectChevronDown />
                  </div>
                ),
                IndicatorSeparator: () => null,
                MenuList: menuListComponent,
              }}
              styles={defaultStyles}
            />
          );
        }}
      />
    </div>
  );
}

