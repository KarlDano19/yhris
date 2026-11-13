'use client';

import { useEffect, useRef, useState } from 'react';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import CustomToast from '@/components/CustomToast';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTour } from '@/components/tour/useTour';
import TemplateEditor from './components/TemplateEditor';
import FillForm from './components/FillForm';

import useGetDocumentTemplates from './hooks/useGetDocumentTemplates';
import useGetDocumentTemplate from './hooks/useGetDocumentTemplate';
import { useExtractDocumentTemplate } from './hooks/useExtractDocumentTemplate';
import { useDeleteDocumentTemplate } from './hooks/useDeleteDocumentTemplate';

import { STANDARD_DOCUMENTS, standardLabel } from './functions/standardTemplates';
import {
  TOUR_CLOSE_EDITOR,
  TOUR_EDITOR_OPEN,
  TOUR_FILL_OPEN,
  TOUR_LIST_OPEN,
  TOUR_OPEN_FILL,
  TOUR_OPEN_SAMPLE,
  buildCustomTemplatesTour,
} from './functions/customTemplatesTour';
import { T_DocumentTemplate } from '@/types/custom-document-generator';
import classNames from '@/helpers/classNames';

import {
  DocumentArrowUpIcon,
  DocumentPlusIcon,
  MagnifyingGlassIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline';

import DeleteIcon from '@/svg/DeleteIcon';
import EditIcon from '@/svg/EditIcon';
import PrintIcon from '@/svg/PrintIcon';
import SelectChevronDown from '@/svg/SelectChevronDown';

const ACCEPTED_UPLOADS = '.docx,.pdf,.png,.jpg,.jpeg';

type T_Mode =
  | { name: 'list' }
  | { name: 'edit'; template: T_DocumentTemplate; originalFile?: File }
  | { name: 'fill'; templateId: number };

const BLANK_TEMPLATE: T_DocumentTemplate = {
  title: 'Untitled document',
  html: '',
  fields: [],
};

// The "Custom Templates" tab of the Document Generator.
const CustomTemplatesTab = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [mode, setMode] = useState<T_Mode>({ name: 'list' });
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteModalData | null>(null);
  const [hintOpen, setHintOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startTour } = useTour();

  // The hint is a nudge, not a fixture: it shows for a few seconds after the tab opens
  useEffect(() => {
    const timer = setTimeout(() => setHintOpen(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const { data: templates, isLoading, refetch } = useGetDocumentTemplates(search);
  const sample = (templates?.records ?? []).find((template) => template.is_sample);
  const { data: editingTemplate } = useGetDocumentTemplate(editingId);
  const { mutateAsync: extractTemplate, isLoading: isExtracting } = useExtractDocumentTemplate();
  const { mutateAsync: deleteTemplate, isLoading: isDeleting } = useDeleteDocumentTemplate();

  // Editing an existing template waits for its full html/fields to load
  useEffect(() => {
    if (!editingId || !editingTemplate) return;
    setMode({ name: 'edit', template: editingTemplate });
    setEditingId(null);
  }, [editingId, editingTemplate]);

  // The tour clicks for the user (open the sample, back to the list, open the fill-in form) and the tab answers
  // with tour-action-complete once the new screen shows. No segmentKey, so nothing about the tour is saved.
  const sampleId = sample?.id;
  useEffect(() => {
    const openSample = () => sampleId && setEditingId(sampleId);
    const closeEditor = () => setMode({ name: 'list' });
    const openFill = () => sampleId && setMode({ name: 'fill', templateId: sampleId });
    window.addEventListener(TOUR_OPEN_SAMPLE, openSample);
    window.addEventListener(TOUR_CLOSE_EDITOR, closeEditor);
    window.addEventListener(TOUR_OPEN_FILL, openFill);
    return () => {
      window.removeEventListener(TOUR_OPEN_SAMPLE, openSample);
      window.removeEventListener(TOUR_CLOSE_EDITOR, closeEditor);
      window.removeEventListener(TOUR_OPEN_FILL, openFill);
    };
  }, [sampleId]);

  useEffect(() => {
    const action = {
      list: TOUR_LIST_OPEN,
      edit: TOUR_EDITOR_OPEN,
      fill: TOUR_FILL_OPEN,
    }[mode.name];
    const timer = setTimeout(
      () => window.dispatchEvent(new CustomEvent('tour-action-complete', { detail: { action } })),
      500
    );
    return () => clearTimeout(timer);
  }, [mode.name]);

  const handleStartTour = () => {
    setHintOpen(false);
    setSearch('');
    setMode({ name: 'list' });
    startTour(buildCustomTemplatesTour(Boolean(sample)));
  };

  // The AI result is only a draft: it opens in the editor and is saved by the user
  const handleUpload = async (file?: File) => {
    if (!file) return;
    try {
      const draft = await extractTemplate(file);
      setMode({ name: 'edit', template: draft, originalFile: file });
      toast.custom(() => <CustomToast message='Template ready. Review the fields, then save.' type='success' />, {
        duration: 4000,
      });
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error.message || 'Failed to read the document.'} type='error' />, {
        duration: 6000,
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (data?: DeleteModalData) => {
    try {
      await deleteTemplate(data?.id);
      toast.custom(() => <CustomToast message='Template deleted.' type='success' />, { duration: 3000 });
      setDeleteTarget(null);
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error.message || 'Failed to delete the template.'} type='error' />, {
        duration: 5000,
      });
    }
  };

  return (
    <div>
      <div className={classNames('space-y-6 pb-12', !hasActiveSubscription && 'pointer-events-none opacity-50')}>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='text-sm text-gray-500'>Turn your company&apos;s own documents into fill-in templates.</p>
          </div>

          {mode.name === 'list' && (
            <div className='flex flex-wrap gap-2'>
              <button
                type='button'
                onClick={handleStartTour}
                data-tooltip-id='ct-tour-hint'
                className='inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-300 hover:bg-blue-50'
              >
                <PlayCircleIcon className='h-5 w-5' />
                Take a tour
              </button>
              <div className='flex flex-wrap gap-2' data-tour-id='ct-tour-starts'>
                <button
                  type='button'
                  onClick={() => setMode({ name: 'edit', template: BLANK_TEMPLATE })}
                  className='inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50'
                >
                  <DocumentPlusIcon className='h-5 w-5' />
                  Blank template
                </button>
                <div className='relative'>
                  <select
                    aria-label='Start from a standard document'
                    value=''
                    onChange={(event) => {
                      const document = STANDARD_DOCUMENTS.find((item) => item.type === event.target.value);
                      if (document) setMode({ name: 'edit', template: document.starter });
                    }}
                    className='appearance-none rounded-md bg-white py-2 pl-4 pr-10 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50'
                  >
                    <option value=''>Start from standard document…</option>
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
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isExtracting}
                  data-tooltip-id='create-from-file-tooltip'
                  data-tooltip-content='Letterhead in the file is picked up from PDF or image only. For Word, upload the letterhead separately.'
                  data-tooltip-place='bottom'
                  data-tooltip-delay-show={300}
                  className='inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50'
                >
                  <DocumentArrowUpIcon className='h-5 w-5' />
                  {isExtracting ? 'Reading document…' : 'Create from file'}
                </button>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept={ACCEPTED_UPLOADS}
                  aria-label='Upload a document'
                  className='hidden'
                  onChange={(event) => handleUpload(event.target.files?.[0])}
                />
              </div>
            </div>
          )}
        </div>

        {mode.name === 'list' && (
          <>
            <p className='rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800'>
              Uploaded files are sent to Google Gemini to build the template. Remove real employee data from sample
              files first. Accepted: .docx, PDF, PNG, JPG up to 5 MB.
            </p>

            {isExtracting && (
              <div className='flex items-center gap-3 text-sm text-gray-600'>
                <LoadingSpinner />
                Reading your document and finding the fields. This can take up to a minute.
              </div>
            )}

            <div className='flex max-w-sm items-center gap-2'>
              <input
                type='text'
                name='search'
                className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                placeholder='Search ...'
                aria-label='Search templates'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button
                type='button'
                aria-label='Search'
                className='rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-100'
                onClick={() => refetch()}
              >
                <MagnifyingGlassIcon className='h-5 w-5' />
              </button>
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : (templates?.records ?? []).length === 0 ? (
              <p className='py-12 text-center text-sm text-gray-500'>
                No custom templates yet. Upload a document your company already uses to get started.
              </p>
            ) : (
              <ul className='divide-y divide-gray-200 rounded-md border border-gray-200 bg-white'>
                {(templates?.records ?? []).map((template) => (
                  <li
                    key={template.id}
                    className='flex items-center justify-between gap-4 px-4 py-3'
                    data-testid='template-row'
                    data-tour-id={template.is_sample ? 'ct-tour-sample-row' : undefined}
                  >
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium text-gray-900'>
                        {template.title}
                        {template.is_sample && (
                          <span className='ml-2 rounded bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700'>
                            Sample
                          </span>
                        )}
                        {template.standard_type && (
                          <span className='ml-2 rounded bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700'>
                            Replaces {standardLabel(template.standard_type)}
                          </span>
                        )}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {template.field_count} field
                        {template.field_count === 1 ? '' : 's'}
                        {template.has_letterhead ? ' · letterhead' : ''}
                      </p>
                    </div>
                    <div className='flex shrink-0 space-x-2'>
                      <button
                        type='button'
                        aria-label={`Generate ${template.title}`}
                        data-tour-id={template.is_sample ? 'ct-tour-sample-fill' : undefined}
                        data-tooltip-id='custom-template-tooltip'
                        data-tooltip-content='Generate document'
                        onClick={() => setMode({ name: 'fill', templateId: template.id })}
                      >
                        <PrintIcon />
                      </button>
                      <button
                        type='button'
                        aria-label={`Edit ${template.title}`}
                        data-tooltip-id='custom-template-tooltip'
                        data-tooltip-content='Edit template'
                        onClick={() => setEditingId(template.id)}
                      >
                        <EditIcon />
                      </button>
                      <button
                        type='button'
                        aria-label={`Delete ${template.title}`}
                        data-tooltip-id='custom-template-tooltip'
                        data-tooltip-content='Delete template'
                        onClick={() => setDeleteTarget({ open: true, id: template.id })}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {mode.name === 'edit' && (
          <TemplateEditor
            key={mode.template.id ?? 'new'}
            template={mode.template}
            originalFile={mode.originalFile}
            onSaved={() => setMode({ name: 'list' })}
            onCancel={() => setMode({ name: 'list' })}
          />
        )}

        {mode.name === 'fill' && <FillForm templateId={mode.templateId} onBack={() => setMode({ name: 'list' })} />}
      </div>

      <DeleteModal
        isOpen={deleteTarget ?? { open: false }}
        setIsOpen={setDeleteTarget}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        customText='this template'
      />
      <Tooltip id='custom-template-tooltip' />
      <Tooltip id='create-from-file-tooltip' style={{ maxWidth: 320 }} />
      <Tooltip
        id='ct-tour-hint'
        isOpen={mode.name === 'list' && hintOpen}
        place='bottom'
        content='New here? Take a quick tour'
      />
    </div>
  );
};

export default CustomTemplatesTab;
