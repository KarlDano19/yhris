'use client';

import { useEffect, useMemo, useState } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import ModalLayout from '@/components/ModalLayout';
import DocumentPreview from './DocumentPreview';
import SignatureModal from '@/components/pages/(auth)/employer/manage/document-generator/modals/SignatureModal';

import useGetDocumentTemplate from '../hooks/useGetDocumentTemplate';
import { useRenderDocumentTemplate } from '../hooks/useRenderDocumentTemplate';
import useGetDocumentTemplateEmployeeValues from '../hooks/useGetDocumentTemplateEmployeeValues';
import useGetEmployeePaginatedSelect from '@/components/hooks/useGetEmployeePaginatedSelect';
import { TEMPLATE_SOURCES } from '../functions/templateFields';
import { DEFAULT_MARGIN_MM } from '../functions/detectLetterheadMargins';
import { isSignatureImage } from '../functions/renderTemplate';

import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import SelectChevronDown from '@/svg/SelectChevronDown';

type FillFormProps = {
  templateId: number;
  onBack: () => void;
};

const FillForm = ({ templateId, onBack }: FillFormProps) => {
  const { data: template, isLoading } = useGetDocumentTemplate(templateId);
  const { mutateAsync: renderTemplate, isLoading: isRendering } = useRenderDocumentTemplate();

  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState('');
  const [signatureKey, setSignatureKey] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: employees } = useGetEmployeePaginatedSelect({
    current_page: 1,
    page_size: 50,
    search: employeeSearch,
  });
  const { data: employeeValues } = useGetDocumentTemplateEmployeeValues(templateId, employeeId);

  // Same precedence as the PDF: a typed value wins, blanks come from the company and employee records
  const previewValues = useMemo(() => {
    const merged: Record<string, string> = { ...(employeeValues ?? {}) };
    Object.entries(values).forEach(([key, value]) => {
      if (value.trim()) merged[key] = value;
    });
    return merged;
  }, [employeeValues, values]);

  // The object URL holds the whole PDF in memory; free it when replaced or unmounted
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  const sourceLabel = (source: string) => TEMPLATE_SOURCES.find((option) => option.value === source)?.label;

  // Required fields need a value, typed or from a linked record
  const missingRequired = (template?.fields ?? []).filter(
    (field) => field.required && !previewValues[field.key]?.trim()
  );

  // Same validation as the standard documents: block, toast, and flag each empty required field
  const handleGenerate = async () => {
    setIsSubmitted(true);
    if (missingRequired.length > 0) {
      toast.custom(() => <CustomToast message='Please fill in all required fields' type='error' />);
      return;
    }
    try {
      const url = await renderTemplate({ id: templateId, employeeId, values });
      setPreviewUrl(url);
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error.message || 'Failed to generate the document.'} type='error' />, {
        duration: 5000,
      });
    }
  };

  // Drawn signatures arrive as a PNG data URI, uploads as a File; the PDF needs a data URI either way
  const handleSignatureSave = (signature: string | File) => {
    const key = signatureKey;
    if (!key) return;
    const save = (dataUri: string) => {
      if (!isSignatureImage(dataUri)) {
        toast.custom(() => (
          <CustomToast message='The signature must be a PNG or JPEG image under 500 KB.' type='error' />
        ));
        return;
      }
      setValues((current) => ({ ...current, [key]: dataUri }));
    };
    if (typeof signature === 'string') {
      save(signature);
    } else {
      const reader = new FileReader();
      reader.onload = () => save(String(reader.result));
      reader.readAsDataURL(signature);
    }
  };

  const signatureKeys = useMemo(
    () => (template?.fields ?? []).filter((field) => field.type === 'signature').map((field) => field.key),
    [template?.fields]
  );

  if (isLoading || !template) return <LoadingSpinner />;

  return (
    <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto]'>
      {/* On wide screens the fields scroll in their own box, so the page scrollbar stays the document's */}
      <div className='space-y-6 xl:sticky xl:top-4 xl:flex xl:max-h-[calc(100vh-18rem)] xl:flex-col xl:space-y-0 xl:self-start'>
        <div className='space-y-6 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:pb-4 xl:pr-3'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>{template.title}</h2>
            <p className='text-sm text-gray-500'>
              Pick an employee to fill linked fields automatically. Anything you type replaces the employee record.
            </p>
          </div>

          <div className='space-y-2' data-tour-id='ct-tour-fill-employee'>
            <label htmlFor='employee-search' className='block text-sm font-medium text-gray-700'>
              Employee (optional)
            </label>
            <input
              id='employee-search'
              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
              placeholder='Search employee name'
              value={employeeSearch}
              onChange={(event) => setEmployeeSearch(event.target.value)}
            />
            <div className='relative'>
              <select
                aria-label='Employee'
                className='appearance-none pr-9 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
                value={employeeId ?? ''}
                onChange={(event) => setEmployeeId(event.target.value ? Number(event.target.value) : null)}
              >
                <option value=''>No employee</option>
                {(employees?.records ?? []).map((employee: any) => (
                  <option key={employee.id} value={employee.id}>
                    {[employee.firstname, employee.lastname].filter(Boolean).join(' ')}
                    {employee.position ? ` — ${employee.position}` : ''}
                  </option>
                ))}
              </select>
              <div className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2'>
                <SelectChevronDown />
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            {template.fields.map((field) => (
              <div key={field.key}>
                <label htmlFor={`field-${field.key}`} className='block text-sm font-medium text-gray-700'>
                  {field.label}
                  {field.required && <span className='text-red-500'> *</span>}
                </label>
                {field.type === 'signature' ? (
                  <div className='mt-1 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-4'>
                    {values[field.key] ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={values[field.key]}
                          alt={`${field.label} preview`}
                          className='mb-3 max-h-24 w-auto object-contain'
                        />
                        <div className='flex gap-4 text-sm'>
                          <button
                            type='button'
                            onClick={() => setSignatureKey(field.key)}
                            className='text-blue-500 hover:underline'
                          >
                            Change Signature
                          </button>
                          <button
                            type='button'
                            onClick={() => setValues({ ...values, [field.key]: '' })}
                            className='text-red-500 hover:underline'
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        type='button'
                        id={`field-${field.key}`}
                        onClick={() => setSignatureKey(field.key)}
                        className='flex flex-col items-center gap-1 py-2 text-blue-500'
                      >
                        <ArrowRightEndOnRectangleIcon className='h-9 w-9 text-gray-400' />
                        <span className='text-sm hover:underline'>Click to add signature</span>
                      </button>
                    )}
                  </div>
                ) : field.type === 'longtext' ? (
                  <textarea
                    id={`field-${field.key}`}
                    rows={3}
                    className='mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
                    value={values[field.key] ?? employeeValues?.[field.key] ?? ''}
                    onChange={(event) => setValues({ ...values, [field.key]: event.target.value })}
                  />
                ) : (
                  <input
                    id={`field-${field.key}`}
                    type={field.type === 'number' ? 'number' : 'text'}
                    className='mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
                    placeholder={field.type === 'date' ? 'e.g. October 14, 2026' : ''}
                    value={values[field.key] ?? employeeValues?.[field.key] ?? ''}
                    onChange={(event) => setValues({ ...values, [field.key]: event.target.value })}
                  />
                )}
                {field.type !== 'signature' && employeeValues?.[field.key] && values[field.key] === undefined && (
                  <p className='mt-1 text-xs text-gray-500'>
                    From {sourceLabel(field.source || field.key)}. Type to replace it.
                  </p>
                )}
                {isSubmitted && missingRequired.includes(field) && (
                  <p className='mt-1 text-xs text-red-500'>This field is required.</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='flex justify-end gap-2 xl:shrink-0 xl:border-t xl:border-gray-200 xl:bg-white xl:pt-3'>
          <button
            type='button'
            onClick={onBack}
            className='rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50'
          >
            Back
          </button>
          <button
            type='button'
            onClick={handleGenerate}
            disabled={isRendering}
            className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50'
          >
            {isRendering ? 'Generating…' : 'Generate PDF'}
          </button>
        </div>
      </div>

      <div className='min-w-0' data-tour-id='ct-tour-fill-preview'>
        <p className='mb-2 text-sm font-medium text-gray-700'>Live preview</p>
        <DocumentPreview
          html={template.html}
          values={previewValues}
          signatureKeys={signatureKeys}
          layout={{
            letterheadUrl: template.letterhead ?? null,
            firstPageOnly: template.letterhead_first_page_only ?? false,
            topMm: template.margin_top_mm ?? DEFAULT_MARGIN_MM,
            bottomMm: template.margin_bottom_mm ?? DEFAULT_MARGIN_MM,
          }}
        />
      </div>

      {signatureKey && (
        <SignatureModal
          isOpen
          onClose={() => setSignatureKey(null)}
          onSave={handleSignatureSave}
          currentSignature={values[signatureKey] || null}
        />
      )}

      <ModalLayout
        isOpen={Boolean(previewUrl)}
        handleClose={() => setPreviewUrl('')}
        title={template.title}
        maxWidth='max-w-5xl'
      >
        <iframe src={previewUrl} title={`${template.title} PDF`} className='h-[75vh] w-full rounded border' />
      </ModalLayout>
    </div>
  );
};

export default FillForm;
