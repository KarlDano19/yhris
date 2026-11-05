'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import TemplateQuill from './TemplateQuill';
import FieldsEditor from './FieldsEditor';
import LetterheadPanel, { T_LetterheadState } from './LetterheadPanel';
import DocumentPreview from './DocumentPreview';

import { useSaveDocumentTemplate } from '../hooks/useSaveDocumentTemplate';

import { DEFAULT_MARGIN_MM, detectLetterheadMargins } from '../functions/detectLetterheadMargins';
import { PAGE_SPACING_STYLE, drawPageSheets, removePageSheets, spaceEditorPages } from '../functions/spaceEditorPages';
import { PLACEHOLDER } from '../functions/renderTemplate';
import { TEMPLATE_SOURCES, newField } from '../functions/templateFields';
import { STANDARD_DOCUMENTS } from '../functions/standardTemplates';
import { T_DocumentTemplate, T_StandardType, T_TemplateField } from '@/types/custom-document-generator';
import { TABLE_ACTIONS } from '@/helpers/quillTable';
import classNames from '@/helpers/classNames';
import SelectChevronDown from '@/svg/SelectChevronDown';

// The full formatting toolbar: AI-extracted company documents rely on alignment, fonts and colour.
// Font and size use Quill's default whitelists, which the backend sanitizer and PDF stylesheet know.
// shortcut: Quill 2's table module handles simple grids only; merged cells (colspan) are flattened on edit.
const TEMPLATE_QUILL_MODULES = {
  table: true,
  history: { delay: 500, maxStack: 100, userOnly: true },
  toolbar: {
    container: [
      ['undo', 'redo'],
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['clean'],
    ],
    handlers: {
      undo: function undo(this: { quill: any }) {
        this.quill.history.undo();
      },
      redo: function redo(this: { quill: any }) {
        this.quill.history.redo();
      },
    },
  },
};

// Quill's editing area drawn as the A4 sheet, with the PDF's typography (see DocumentPreview's PREVIEW_STYLES).
// Lists are left to Quill: its editor markup draws bullets itself.
const PAGE_EDITOR_STYLES = `
.ql-template-field { background: #dbeafe; color: #1d4ed8; border-radius: 2px; }
.template-page-editor .ql-toolbar.ql-snow { position: sticky; top: 0; z-index: 10; background: #fff; border-radius: 6px 6px 0 0; }
.template-page-editor .ql-container.ql-snow { border: 1px solid #d1d5db; border-top: 0; background: #f3f4f6; padding: 24px 16px; overflow-x: auto; }
.template-page-editor .ql-editor {
  box-sizing: border-box; width: 210mm; min-height: 297mm; margin: 0 auto; position: relative; z-index: 1;
  font-family: Arial, Helvetica, sans-serif; font-size: 11pt; line-height: 1.6; color: #333; text-align: justify; overflow: visible;
}
.template-page-editor .ql-editor p { margin: 0.4em 0; }
.template-page-editor .ql-editor h1, .template-page-editor .ql-editor h2, .template-page-editor .ql-editor h3 { font-weight: bold; color: #222; margin: 0.8em 0 0.3em 0; }
.template-page-editor .ql-editor h1 { font-size: 13pt; } .template-page-editor .ql-editor h2 { font-size: 12pt; } .template-page-editor .ql-editor h3 { font-size: 11pt; }
.template-page-editor .ql-editor td { border: 1px dashed #d1d5db; padding: 4px 6px; }
`;

// Highlight spans are editor-only; they never go into the saved template
// as is the page spacing spaceEditorPages adds to blocks
const stripFieldHighlights = (html: string) =>
  html.replace(/<span class="ql-template-field">([^<]*)<\/span>/g, '$1').replace(PAGE_SPACING_STYLE, '');

type T_Tab = 'document' | 'preview' | 'original';

type TemplateEditorProps = {
  template: T_DocumentTemplate;
  originalFile?: File | null; // the upload this draft was just extracted from
  onSaved: (template: T_DocumentTemplate) => void;
  onCancel: () => void;
};

const TemplateEditor = ({ template, originalFile, onSaved, onCancel }: TemplateEditorProps) => {
  const { mutateAsync: saveTemplate, isLoading: isSaving } = useSaveDocumentTemplate();
  const quillRef = useRef<any>(null);

  const [tab, setTab] = useState<T_Tab>('document');
  const [title, setTitle] = useState(template.title);
  const [html, setHtml] = useState(template.html);
  const [fields, setFields] = useState<T_TemplateField[]>(template.fields ?? []);
  const [standardType, setStandardType] = useState<T_StandardType | ''>(template.standard_type ?? '');
  const isNteFormat = standardType === 'notice-to-explain';
  const [editorReady, setEditorReady] = useState(false);
  const setQuillRef = useCallback((instance: any) => {
    quillRef.current = instance;
    if (instance) setEditorReady(true);
  }, []);
  const [letterhead, setLetterhead] = useState<T_LetterheadState>({
    file: null,
    url: template.letterhead ?? null,
    removed: false,
    firstPageOnly: template.letterhead_first_page_only ?? false,
    topMm: template.margin_top_mm ?? DEFAULT_MARGIN_MM,
    bottomMm: template.margin_bottom_mm ?? DEFAULT_MARGIN_MM,
  });

  // A letterhead the AI lifted from the uploaded file becomes the template's letterhead, like a picked image
  useEffect(() => {
    if (!template.letterhead_image) return;
    (async () => {
      const blob = await (await fetch(template.letterhead_image as string)).blob();
      const file = new File([blob], 'letterhead.png', { type: 'image/png' });
      const url = URL.createObjectURL(file);
      const margins = await detectLetterheadMargins(url);
      setLetterhead((current) => ({ ...current, file, url, removed: false, ...margins }));
    })().catch(() => undefined); // the user can still upload the letterhead by hand
  }, [template.letterhead_image]);

  // The original document: the file just uploaded, or the one saved with the template
  const original = useMemo(() => {
    if (originalFile) return { name: originalFile.name, url: URL.createObjectURL(originalFile) };
    if (template.original_file)
      return { name: template.original_file_name ?? 'Original document', url: template.original_file };
    return null;
  }, [originalFile, template.original_file, template.original_file_name]);
  const originalKind = original?.name.toLowerCase().match(/\.(pdf|png|jpe?g)$/)?.[1];

  // Object URLs hold the whole file in memory; free them when replaced or unmounted
  useEffect(
    () => () => {
      if (original?.url.startsWith('blob:')) URL.revokeObjectURL(original.url);
    },
    [original]
  );
  useEffect(
    () => () => {
      if (letterhead.url?.startsWith('blob:')) URL.revokeObjectURL(letterhead.url);
    },
    [letterhead.url]
  );

  // Highlight every {{field}} in the editor. Silent changes do not reach onChange or the undo history.
  useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    const highlight = () => {
      const text: string = editor.getText();
      editor.formatText(0, text.length, 'template-field', false, 'silent');
      Array.from(text.matchAll(PLACEHOLDER)).forEach((match) =>
        editor.formatText(match.index ?? 0, match[0].length, 'template-field', true, 'silent')
      );
    };
    highlight();
    editor.on('text-change', highlight);
    return () => editor.off('text-change', highlight);
  }, [editorReady, tab]);

  // The editing surface is a stack of A4 sheets: the template's margins, the letterhead behind each sheet (or the
  // first only), and text that would cross a sheet's bottom margin starts on the next sheet, as in Page preview.
  useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    const root: HTMLElement = editor.root;
    root.style.padding = `${letterhead.topMm}mm 20mm ${letterhead.bottomMm}mm`;
    let frame = 0;
    const layout = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const pages = spaceEditorPages(root, letterhead.topMm, letterhead.bottomMm);
        drawPageSheets(root, pages, letterhead.url, letterhead.firstPageOnly);
      });
    };
    layout();
    editor.on('text-change', layout);
    return () => {
      cancelAnimationFrame(frame);
      editor.off('text-change', layout);
      removePageSheets(root);
    };
  }, [editorReady, tab, letterhead.url, letterhead.firstPageOnly, letterhead.topMm, letterhead.bottomMm]);

  // A {{key}} typed into the page becomes a field straight away, as in the prototype
  useEffect(() => {
    const typed = Array.from(stripFieldHighlights(html).matchAll(PLACEHOLDER), (match) => match[1]);
    const missing = Array.from(new Set(typed)).filter((key) => !fields.some((field) => field.key === key));
    if (missing.length === 0) return;
    setFields((current) => [...current, ...missing.map(newField)]);
  }, [html, fields]);

  // New fields and picked fields go where the cursor is, not at the end of the document
  const insertPlaceholder = (key: string) => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return setHtml((current) => `${current}<p>{{${key}}}</p>`);
    const range = editor.getSelection(true);
    const index = range ? range.index : editor.getLength() - 1;
    editor.insertText(index, `{{${key}}}`, 'user');
    editor.setSelection(index + key.length + 4, 0, 'user');
  };

  // A field only exists while its {{key}} is in the document, so removing one takes the code out of the page too
  const removeField = (key: string) => {
    const editor = quillRef.current?.getEditor?.();
    if (editor) {
      Array.from(editor.getText().matchAll(PLACEHOLDER))
        .filter((match: any) => match[1] === key)
        .reverse()
        .forEach((match: any) => editor.deleteText(match.index ?? 0, match[0].length, 'user'));
    } else {
      setHtml((current) => current.replace(PLACEHOLDER, (match, found) => (found === key ? '' : match)));
    }
    setFields((current) => current.filter((field) => field.key !== key));
  };

  const handleTableAction = (value: string) => {
    const table = quillRef.current?.getEditor?.()?.getModule('table');
    const action = TABLE_ACTIONS.find((option) => option.value === value);
    if (table && action) action.run(table);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.custom(() => <CustomToast message='Give the template a title.' type='error' />, { duration: 4000 });
      return;
    }
    try {
      const saved = await saveTemplate({
        id: template.id,
        title,
        html: stripFieldHighlights(html),
        fields,
        letterhead: letterhead.file,
        removeLetterhead: letterhead.removed && !letterhead.file,
        letterheadFirstPageOnly: letterhead.firstPageOnly,
        marginTopMm: letterhead.topMm,
        marginBottomMm: letterhead.bottomMm,
        originalFile: template.id ? null : originalFile,
        standardType,
      });
      toast.custom(() => <CustomToast message='Template saved.' type='success' />, { duration: 3000 });
      onSaved(saved);
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error.message || 'Failed to save the template.'} type='error' />, {
        duration: 5000,
      });
    }
  };

  const tabs: { id: T_Tab; label: string }[] = [
    { id: 'document', label: 'Document' },
    { id: 'preview', label: 'Page preview' },
    ...(original ? [{ id: 'original' as T_Tab, label: 'Original' }] : []),
  ];

  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]'>
      {/* On large screens the fields scroll in their own box, so the page scrollbar stays the document's */}
      <div className='space-y-6 lg:sticky lg:top-4 lg:flex lg:max-h-[calc(100vh-18rem)] lg:flex-col lg:space-y-0 lg:self-start'>
        <div className='space-y-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pb-4 lg:pr-3'>
          <div className='rounded-md border border-gray-200 p-3'>
            <label htmlFor='standard-type' className='block text-sm font-medium text-gray-900'>
              Use in place of a standard document
            </label>
            <div className='relative'>
              <select
                id='standard-type'
                value={standardType}
                onChange={(event) => setStandardType(event.target.value as T_StandardType | '')}
                className='appearance-none pr-9 mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
              >
                <option value=''>None</option>
                {STANDARD_DOCUMENTS.map((document) => (
                  <option key={document.type} value={document.type}>
                    {document.label}
                  </option>
                ))}
              </select>
              <div className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2'>
                <SelectChevronDown />
              </div>
            </div>
            <p className='mt-1 text-sm text-gray-600'>
              {isNteFormat
                ? 'Address Employee Issue will print every NTE with this template.'
                : 'Standard Documents will offer this template in place of the standard one. Only one template per document.'}
            </p>
          </div>

          <FieldsEditor
            fields={fields}
            onChange={setFields}
            onInsertPlaceholder={insertPlaceholder}
            onRemove={removeField}
            isNteFormat={isNteFormat}
          />

          <LetterheadPanel letterhead={letterhead} onChange={setLetterhead} />
        </div>

        <div className='flex justify-end gap-2 lg:shrink-0 lg:border-t lg:border-gray-200 lg:bg-white lg:pt-3'>
          <button
            type='button'
            onClick={onCancel}
            className='rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleSave}
            disabled={isSaving}
            data-tour-id='ct-tour-save'
            className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50'
          >
            {isSaving ? 'Saving…' : 'Save template'}
          </button>
        </div>
      </div>

      <div className='space-y-4'>
        <div>
          <label htmlFor='template-title' className='block text-sm font-medium text-gray-700'>
            Template title
          </label>
          <input
            id='template-title'
            className='mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className='flex gap-4 border-b border-gray-200' role='tablist'>
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type='button'
              role='tab'
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={classNames(
                '-mb-px border-b-2 px-1 pb-2 text-sm font-medium',
                tab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'document' && (
          <div className='space-y-2'>
            <div className='flex flex-wrap gap-2'>
              <div className='relative'>
                <select
                  aria-label='Insert field'
                  className='appearance-none pr-9 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
                  value=''
                  onChange={(event) => event.target.value && insertPlaceholder(event.target.value)}
                >
                  <option value=''>Insert field at cursor…</option>
                  {fields.map((field) => (
                    <option key={field.key} value={field.key}>
                      {field.label}
                    </option>
                  ))}
                  {isNteFormat && (
                    <optgroup label='NTE fields'>
                      {TEMPLATE_SOURCES.filter(
                        (source) =>
                          source.value.startsWith('nte.') && !fields.some((field) => field.key === source.value)
                      ).map((source) => (
                        <option key={source.value} value={source.value}>
                          {source.label}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <div className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2'>
                  <SelectChevronDown />
                </div>
              </div>
              <div className='relative'>
                <select
                  aria-label='Table'
                  className='appearance-none pr-9 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
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
                <div className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2'>
                  <SelectChevronDown />
                </div>
              </div>
            </div>
            <p className='text-xs text-gray-500'>
              Click into the page and type. Type <span className='ql-template-field'>{'{{field_name}}'}</span> or use
              Insert field to add a field.            </p>
            <style>{PAGE_EDITOR_STYLES}</style>
            <div className='template-page-editor' data-testid='template-editor' data-tour-id='ct-tour-page'>
              <TemplateQuill
                ref={setQuillRef}
                theme='snow'
                value={html}
                onChange={setHtml}
                modules={TEMPLATE_QUILL_MODULES}
              />
            </div>
          </div>
        )}

        {tab === 'preview' && (
          <DocumentPreview
            html={stripFieldHighlights(html)}
            values={{}}
            signatureKeys={fields.filter((field) => field.type === 'signature').map((field) => field.key)}
            layout={{
              letterheadUrl: letterhead.url,
              firstPageOnly: letterhead.firstPageOnly,
              topMm: letterhead.topMm,
              bottomMm: letterhead.bottomMm,
            }}
          />
        )}

        {tab === 'original' && original && (
          <div className='space-y-2'>
            <p className='text-xs text-gray-500'>{original.name}</p>
            {originalKind === 'pdf' ? (
              <iframe src={original.url} title='Original document' className='h-[75vh] w-full rounded border' />
            ) : originalKind ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={original.url} alt='Original document' className='w-full rounded border' />
            ) : (
              <p className='text-sm text-gray-500'>
                A .docx cannot be shown here.{' '}
                <a href={original.url} download={original.name} className='text-blue-600 hover:underline'>
                  Download it
                </a>{' '}
                to compare in Word.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateEditor;
