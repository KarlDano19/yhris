import { Controller, Control, RegisterOptions, FieldError } from 'react-hook-form';
import Field from './Field';

type FormFieldProps = {
  name: string;
  control: Control<any>;
  label: string;
  type?: "text" | "number" | "date" | "file";
  placeholder?: string;
  rules?: RegisterOptions;
  hint?: string;
  disabled?: boolean;
  readOnly?: boolean;
  dataTestid?: string;
  className?: string;
  step?: string;
};

export default function FormField({
  name,
  control,
  label,
  type = "text",
  rules,
  ...fieldProps
}: FormFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Field
          label={label}
          type={type}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message || null}
          required={!!rules?.required}
          {...fieldProps}
        />
      )}
    />
  );
}
