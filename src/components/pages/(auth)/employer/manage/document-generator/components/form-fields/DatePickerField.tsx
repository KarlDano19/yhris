import { ChangeEvent } from 'react';
import CustomDatePicker from '@/components/CustomDatePicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerFieldProps {
  id: string;
  label: string;
  name: string;
  value: string | null | undefined;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  placeholder?: string;
}

const DatePickerField = ({ 
  id, 
  label, 
  name, 
  value, 
  handleInputChange, 
  required = false,
  placeholder = "mm/dd/yyyy"
}: DatePickerFieldProps) => {
  
  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const e = {
      target: {
        name,
        value: `${year}-${month}-${day}`
      }
    } as ChangeEvent<HTMLInputElement>;
    
    handleInputChange(e);
  };
  
  const selectedDate = value ? new Date(value + 'T00:00:00') : null;
  
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-black">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <CustomDatePicker
          id={id}
          placeholder={placeholder}
          className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
          selected={selectedDate}
          pickerOnChange={handleDateChange}
          inputOnChange={handleDateChange}
          required={required}
        />
      </div>
    </div>
  );
};

export default DatePickerField; 