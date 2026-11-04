'use client';

import { useRef } from 'react';

import TemplateQuill from '@/components/pages/(auth)/employer/manage/custom-document-generator/components/TemplateQuill';

import { TABLE_ACTIONS } from '@/helpers/quillTable';
import { richTextHtml, toEditorHtml } from '@/helpers/richText';

// The formatting the NTE's Brief Background prints: the backend sanitizer and both NTE stylesheets know these.
const RICH_TEXT_MODULES = {
  table: true,
  toolbar: [
    [{ header: [1, 2, 3, false] }, { size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ align: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['clean'],
  ],
};

type RichTextEditorProps = {
  id?: string;
  value?: string | null;
  onChange: (html: string) => void;
  disabled?: boolean;
  height?: string; // the writing area's height, e.g. '12rem' or '60vh'
};

// Rich text input (formatting and tables) for multi-line document fields such as the NTE's Brief Background.
const RichTextEditor = ({ id, value, onChange, disabled, height = '12rem' }: RichTextEditorProps) => {
  const quillRef = useRef<any>(null);

  if (disabled) return <RichTextView value={value} className='rounded-md bg-gray-100 p-3 ring-1 ring-inset ring-gray-300' />;

  const handleTableAction = (action: string) => {
    const table = quillRef.current?.getEditor?.()?.getModule('table');
    TABLE_ACTIONS.find((option) => option.value === action)?.run(table);
  };

  return (
    <div id={id} className='rich-text-editor'>
      <style>{`.rich-text-editor .ql-container { height: ${height}; font-size: 0.875rem; } .rich-text-editor .ql-editor td { border: 1px solid #9ca3af; }`}</style>
      <TemplateQuill
        ref={quillRef}
        theme='snow'
        // Older plain-text values open as one paragraph per line
        value={toEditorHtml(value)}
        onChange={(html: string) => onChange(html)}
        modules={RICH_TEXT_MODULES}
      />
      <select
        aria-label='Table'
        className='mt-1 rounded-md border-0 py-1 px-2 text-xs text-gray-700 ring-1 ring-inset ring-gray-300'
        value=''
        onChange={(event) => handleTableAction(event.target.value)}
      >
        <option value=''>Table…</option>
        {TABLE_ACTIONS.map((action) => (
          <option key={action.value} value={action.value}>
            {action.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Read-only display of a rich-text value with Quill's own alignment, list and table styles.
export const RichTextView = ({
  value,
  className = '',
  textClassName = 'text-sm text-gray-900',
}: {
  value?: string | null;
  className?: string;
  textClassName?: string;
}) => (
  <div className={`ql-snow ${className}`}>
    <div
      className={`ql-editor !h-auto !overflow-visible !p-0 ${textClassName}`}
      dangerouslySetInnerHTML={{ __html: richTextHtml(value) }}
    />
  </div>
);

export default RichTextEditor;
