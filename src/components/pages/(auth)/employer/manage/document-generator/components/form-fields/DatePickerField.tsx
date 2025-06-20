import { ChangeEvent } from 'react';
import CustomDatePicker from '@/components/CustomDatePicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerFieldProps {
  id: string;
  label: string;
  name: string;
  value: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const DatePickerField = ({
  id,
  label,
  name,
  value,
  handleInputChange,
  required = false,
  placeholder = "mm/dd/yyyy",
  disabled = false,
  className = ''
}: DatePickerFieldProps) => {
  // Create a custom handler to adapt the CustomDatePicker to the field's handleInputChange
  const handleDateChange = (date: Date | null) => {
    if (date) {
      // Format date in local time to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      const e = {
        target: {
          name,
          value: formattedDate
        }
      } as ChangeEvent<HTMLInputElement>;
      handleInputChange(e);
    }
  };
  
  const selectedDate = value ? new Date(value) : null;
  
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <CustomDatePicker
          id={id}
          selected={selectedDate}
          pickerOnChange={handleDateChange}
          inputOnChange={handleDateChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md ${
            disabled ? 'bg-gray-100 text-gray-700' : 'bg-white'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          required={required}
        />
      </div>
    </div>
  );
}; 