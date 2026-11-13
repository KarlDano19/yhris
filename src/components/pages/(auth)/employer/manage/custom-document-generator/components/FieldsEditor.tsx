'use client';

import { useState } from 'react';

import { FIELD_TYPES, TEMPLATE_SOURCES, toFieldKey } from '../functions/templateFields';

import { T_TemplateField } from '@/types/custom-document-generator';

import SelectChevronDown from '@/svg/SelectChevronDown';

type FieldsEditorProps = {
  fields: T_TemplateField[];
  onChange: (fields: T_TemplateField[]) => void;
  onInsertPlaceholder: (key: string) => void;
  onRemove: (key: string) => void;
  isNteFormat?: boolean;
};

const INPUT_CLASS =
  'block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6';
const SELECT_CLASS = `${INPUT_CLASS} appearance-none pr-9`;

const FieldsEditor = ({ fields, onChange, onInsertPlaceholder, onRemove, isNteFormat = false }: FieldsEditorProps) => {
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldError, setNewFieldError] = useState('');
  const [openKey, setOpenKey] = useState<string | null>(null);

  const updateField = (index: number, changes: Partial<T_TemplateField>) => {
    onChange(fields.map((field, fieldIndex) => (fieldIndex === index ? { ...field, ...changes } : field)));
  };

  // A new field is added to the list and its {{key}} dropped into the document
  const handleAddField = () => {
    const key = toFieldKey(newFieldName);
    if (!key) return setNewFieldError('Use letters and numbers, starting with a letter.');
    if (fields.some((field) => field.key === key)) return setNewFieldError('That field already exists.');

    onChange([...fields, { key, label: newFieldName.trim(), type: 'text', required: false, source: '' }]);
    onInsertPlaceholder(key);
    setNewFieldName('');
    setNewFieldError('');
  };

  const renderControls = (field: T_TemplateField, index: number) => (
    <div className='space-y-3'>
      <div>
        <label className='mb-1 block text-sm font-medium text-gray-700'>Name of this field</label>
        <input
          className={INPUT_CLASS}
          value={field.label}
          aria-label={`Label for ${field.key}`}
          onChange={(event) => updateField(index, { label: event.target.value })}
        />
      </div>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700'>What goes here?</label>
          <div className='relative'>
            <select
              className={SELECT_CLASS}
              value={field.type}
              aria-label={`Type for ${field.key}`}
              onChange={(event) => updateField(index, { type: event.target.value as T_TemplateField['type'] })}
            >
              {FIELD_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2'>
              <SelectChevronDown />
            </div>
          </div>
        </div>
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700'>Fill from</label>
          <div className='relative'>
            <select
              className={SELECT_CLASS}
              value={field.source}
              aria-label={`Source for ${field.key}`}
              onChange={(event) => updateField(index, { source: event.target.value })}
            >
              {TEMPLATE_SOURCES.map((source) => (
                <option key={source.value} value={source.value}>
                  {source.label}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2'>
              <SelectChevronDown />
            </div>
          </div>
        </div>
      </div>
      <label className='flex items-center gap-2 text-sm text-gray-700'>
        <input
          type='checkbox'
          className='h-4 w-4'
          checked={field.required}
          onChange={(event) => updateField(index, { required: event.target.checked })}
        />
        Required
      </label>
      <p className='text-sm text-gray-500'>
        Code in the document: <code className='text-blue-700'>{`{{${field.key}}}`}</code>
      </p>
      {!isNteFormat && (
        <button
          type='button'
          onClick={() => onRemove(field.key)}
          className='text-sm font-medium text-red-600 hover:underline'
          aria-label={`Remove ${field.key}`}
        >
          Remove field
        </button>
      )}
    </div>
  );

  return (
    <div className='space-y-3' data-tour-id='ct-tour-fields'>
      <div>
        <h3 className='text-base font-semibold text-gray-900'>Fields</h3>
        <p className='text-sm text-gray-600'>
          {isNteFormat
            ? 'These fill in by themselves from the issue record. Keep them all in the document.'
            : 'Fields that say “Filled automatically” come from your records. The others are blanks to type in when printing.'}
        </p>
      </div>

      {fields.length === 0 && <p className='text-sm text-gray-600'>No fields yet.</p>}

      <ul className='space-y-2'>
        {fields.map((field, index) => {
          const isLinked = !!field.source;
          const isOpen = !isLinked || openKey === field.key;
          return (
            <li key={field.key} className='rounded-md border border-gray-200 p-3' data-testid='template-field'>
              {isLinked && (
                <div className='flex min-h-[2.75rem] items-center justify-between gap-2'>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-medium text-gray-900'>{field.label.replace(/^NTE — /, '')}</p>
                    <span className='inline-block rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700'>
                      Filled automatically
                    </span>
                  </div>
                  <button
                    type='button'
                    onClick={() => setOpenKey(openKey === field.key ? null : field.key)}
                    className='whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50'
                  >
                    {isOpen ? 'Done' : 'Change'}
                  </button>
                </div>
              )}
              {isOpen && <div className={isLinked ? 'mt-3 border-t border-gray-100 pt-3' : ''}>{renderControls(field, index)}</div>}
            </li>
          );
        })}
      </ul>

      {!isNteFormat && (
        <>
          <div data-tour-id='ct-tour-add-blank'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>Add a blank to fill in</label>
            <div className='flex gap-2'>
              <input
                className={INPUT_CLASS}
                placeholder='e.g. Start Date'
                value={newFieldName}
                onChange={(event) => setNewFieldName(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), handleAddField())}
              />
              <button
                type='button'
                onClick={handleAddField}
                className='whitespace-nowrap rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200'
              >
                Add
              </button>
            </div>
          </div>
          {newFieldError && <p className='text-sm text-red-500'>{newFieldError}</p>}
        </>
      )}
    </div>
  );
};

export default FieldsEditor;
