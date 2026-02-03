import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { Switch } from '@headlessui/react';

import useGetAuditLogDetails from '../hooks/useGetAuditLogDetails';
import { formatDateTimeSeparate } from '@/helpers/date';

import {
  ClockIcon,
  InformationCircleIcon,
  ArrowsRightLeftIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

import 'react-quill/dist/quill.snow.css';

type T_ModalData = {
  id: number;
  open: boolean;
};

export default function EditEmployeeCompensationLogModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const [auditLogDetails, setAuditLogDetails] = useState<any>({});
  const [showOnlyChanges, setShowOnlyChanges] = useState(true);
  const { data: auditLogData, refetch: refetchAuditLog, remove: removeAuditLog } = useGetAuditLogDetails(isOpen?.id || null);

  // Trigger refetch when modal opens with a valid ID
  useEffect(() => {
    if (isOpen?.id && isOpen?.open) {
      refetchAuditLog();
    }
  }, [isOpen?.id, isOpen?.open, refetchAuditLog]);

  // Update state when data arrives
  useEffect(() => {
    if (auditLogData) {
      setAuditLogDetails(auditLogData);
    }
  }, [auditLogData]);

  const customCloseModal = () => {
    removeAuditLog();
    setIsOpen(null);
  };

  // Format field name from snake_case to Title Case
  const formatFieldName = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .trim();
  };

  // Get action badge colors
  const getActionBadgeColor = (action: string): string => {
    const colors: { [key: string]: string } = {
      create: 'bg-green-100 text-green-800',
      update: 'bg-yellow-100 text-yellow-800',
      delete: 'bg-red-100 text-red-800',
    };
    return colors[action?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  // Get all unique field keys from both old and new data
  const getAllFields = (oldData: any, newData: any): string[] => {
    const oldKeys = oldData ? Object.keys(oldData) : [];
    const newKeys = newData ? Object.keys(newData) : [];
    const allKeys = new Set([...oldKeys, ...newKeys]);
    return Array.from(allKeys).filter(key => key !== 'id');
  };

  // Determine which fields have changed
  const getChangedFields = (oldData: any, newData: any): Set<string> => {
    const changed = new Set<string>();
    const allFields = getAllFields(oldData, newData);

    allFields.forEach(field => {
      const oldValue = oldData?.[field];
      const newValue = newData?.[field];

      // Deep comparison for objects/arrays
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changed.add(field);
      }
    });

    return changed;
  };

  // Render value (keep existing logic from original renderAuditData)
  const renderValue = (val: any): React.ReactNode => {
    try {
      if (val === null || val === undefined) return "N/A";

      if (typeof val === "string") {
        // Check if the string contains HTML tags
        if (val.includes('<') && val.includes('>')) {
          const markup = { __html: val };
          return <span className='ql-editor !p-0' dangerouslySetInnerHTML={markup}></span>;
        }

        // Check if the string is an ISO datetime (e.g., "2026-02-03T05:24:15.972000+00:00")
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}:\d{2})?$/;
        if (isoDateRegex.test(val)) {
          const { formattedDate, formattedTime } = formatDateTimeSeparate(val);
          return (
            <div>
              <div className="font-medium">{formattedDate}</div>
              <div className="text-xs text-gray-600">{formattedTime}</div>
            </div>
          );
        }

        // Check if the string is a URL
        if (val.startsWith('http://') || val.startsWith('https://')) {
          // Check if it's an image URL
          const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
          const isImage = imageExtensions.some(ext => val.toLowerCase().includes(ext));

          if (isImage) {
            return (
              <div className="space-y-2">
                <a
                  href={val}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-xs break-all"
                >
                  View Image
                </a>
                <div className="mt-2">
                  <img
                    src={val}
                    alt="Attachment"
                    className="max-w-full h-auto max-h-48 rounded border border-gray-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-xs text-gray-500">Image failed to load</div>
                </div>
              </div>
            );
          }

          // For non-image files (PDFs, documents, etc.)
          const fileName = val.split('/').pop() || 'Download';
          return (
            <a
              href={val}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline text-sm break-all"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="break-all">{fileName}</span>
            </a>
          );
        }

        return String(val);
      }

      if (typeof val === "number" || typeof val === "boolean") {
        return String(val);
      }

      if (Array.isArray(val)) {
        return (
          <ul className="list-disc ml-4">
            {val.map((item, idx) => (
              <li key={idx}>{renderValue(item)}</li>
            ))}
          </ul>
        );
      }

      if (typeof val === "object") {
        return (
          <div className="ml-4">
            {Object.entries(val).map(([k, v]) => (
              <div key={k}>
                <span className="font-semibold">
                  {k.charAt(0).toUpperCase() + k.slice(1)}:
                </span>{" "}
                {renderValue(v)}
              </div>
            ))}
          </div>
        );
      }

      return String(val);
    } catch (err) {
      console.error("renderValue error:", err);
      return JSON.stringify(val) ?? "[object Object]";
    }
  };

  // Render individual field with highlighting
  const renderField = (
    key: string,
    value: any,
    isChanged: boolean,
    type: 'old' | 'new'
  ) => {
    const bgColor = isChanged
      ? (type === 'old' ? 'bg-red-100' : 'bg-green-100')
      : 'bg-transparent';

    const textColor = isChanged
      ? (type === 'old' ? 'text-red-900' : 'text-green-900')
      : 'text-gray-900';

    return (
      <div key={key} className='space-y-1'>
        <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide'>
          {formatFieldName(key)}
        </label>
        <div className={`px-3 py-2 rounded ${bgColor}`}>
          <div className={`text-sm font-medium break-words whitespace-pre-line ${textColor}`}>
            {renderValue(value)}
          </div>
        </div>
      </div>
    );
  };

  // Render all fields for one side
  const renderFieldsList = (
    data: any,
    changedFields: Set<string>,
    type: 'old' | 'new'
  ) => {
    if (!data) return <div className='text-sm text-gray-500'>No data</div>;

    const allFields = getAllFields(
      auditLogDetails.old_data,
      auditLogDetails.new_data
    );

    // Filter to show only changed fields if toggle is on
    const fieldsToShow = showOnlyChanges
      ? allFields.filter(field => changedFields.has(field))
      : allFields;

    if (fieldsToShow.length === 0 && showOnlyChanges) {
      return <div className='text-sm text-gray-500'>No changes detected</div>;
    }

    return fieldsToShow.map(field => {
      const value = data[field];
      const isChanged = changedFields.has(field);
      return renderField(field, value, isChanged, type);
    });
  };

  // Calculate changed fields
  const changedFields = getChangedFields(auditLogDetails.old_data, auditLogDetails.new_data);

  return (
    <Transition.Root show={isOpen.open} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => customCloseModal()}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl'>
                {/* Header */}
                <div className='flex bg-savoy-blue p-4 items-center'>
                  <h3 className='flex-1 text-white text-lg font-semibold'>
                    Audit Log Details: #{auditLogDetails.id}
                  </h3>
                  <XMarkIcon
                    className='w-6 h-6 text-white cursor-pointer hover:text-gray-200'
                    onClick={() => customCloseModal()}
                  />
                </div>

                {/* Log Information Section */}
                <div className='px-6 py-4 bg-gray-50'>
                  {/* Section Header */}
                  <div className='flex items-center gap-2 mb-4'>
                    <InformationCircleIcon className='w-5 h-5 text-blue-500' />
                    <h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>
                      Log Information
                    </h3>
                  </div>

                  {/* 4-Column Grid */}
                  <div className='grid grid-cols-4 gap-4'>
                    {/* USER */}
                    <div>
                      <label className='text-xs text-gray-500 uppercase'>User</label>
                      <div className='mt-1'>
                        <div className='text-sm font-medium text-gray-900'>
                          {auditLogDetails.user}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {auditLogDetails.email}
                        </div>
                      </div>
                    </div>

                    {/* DATE & TIME */}
                    <div>
                      <label className='text-xs text-gray-500 uppercase'>Date & Time</label>
                      <div className='mt-1'>
                        <div className='text-sm font-medium text-gray-900'>
                          {formatDateTimeSeparate(auditLogDetails.created_at).formattedDate}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {formatDateTimeSeparate(auditLogDetails.created_at).formattedTime}
                        </div>
                      </div>
                    </div>

                    {/* ACTION */}
                    <div>
                      <label className='text-xs text-gray-500 uppercase'>Action</label>
                      <div className='mt-1'>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold uppercase rounded ${getActionBadgeColor(auditLogDetails.action)}`}>
                          {auditLogDetails.action}
                        </span>
                      </div>
                    </div>

                    {/* MODULE */}
                    <div>
                      <label className='text-xs text-gray-500 uppercase'>Module</label>
                      <div className='text-sm font-medium text-gray-900 mt-1'>
                        {auditLogDetails.model_name}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Comparison Section */}
                <div className='px-6 py-4'>
                  {/* Section Header */}
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center gap-2'>
                        <ArrowsRightLeftIcon className='w-5 h-5 text-blue-500' />
                        <h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>
                          Data Comparison
                        </h3>
                      </div>

                      {/* Toggle for Show Only Changes */}
                      <div className='flex items-center gap-2'>
                        <Switch
                          checked={showOnlyChanges}
                          onChange={setShowOnlyChanges}
                          className={`${
                            showOnlyChanges ? 'bg-savoy-blue' : 'bg-gray-200'
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              showOnlyChanges ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </Switch>
                        <div className='flex items-center gap-1'>
                          <SparklesIcon className='w-4 h-4 text-gray-500' />
                          <span className='text-xs text-gray-600 font-medium'>
                            Show Only Changes
                          </span>
                        </div>
                      </div>
                    </div>
                    {auditLogDetails.action === 'update' && (
                      <span className='inline-flex px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded uppercase'>
                        Success
                      </span>
                    )}
                  </div>

                  {/* Side-by-Side Comparison */}
                  <div className='grid grid-cols-2 gap-6'>
                    {/* PREVIOUS DATA */}
                    <div className='border-2 border-red-200 rounded-lg p-4 bg-red-50'>
                      <div className='flex items-center gap-2 mb-3'>
                        <XCircleIcon className='w-5 h-5 text-red-500' />
                        <h4 className='text-sm font-semibold text-red-700 uppercase'>
                          Previous Data
                        </h4>
                      </div>
                      <div className='space-y-3'>
                        {renderFieldsList(auditLogDetails.old_data, changedFields, 'old')}
                      </div>
                    </div>

                    {/* NEW DATA */}
                    <div className='border-2 border-green-200 rounded-lg p-4 bg-green-50'>
                      <div className='flex items-center gap-2 mb-3'>
                        <CheckCircleIcon className='w-5 h-5 text-green-500' />
                        <h4 className='text-sm font-semibold text-green-700 uppercase'>
                          New Data
                        </h4>
                      </div>
                      <div className='space-y-3'>
                        {renderFieldsList(auditLogDetails.new_data, changedFields, 'new')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className='border-t border-gray-200 px-6 py-4 mt-2'>
                  <div className='flex justify-end'>
                    {/* Right: Buttons */}
                    <div className='flex gap-3'>
                      <button
                        onClick={customCloseModal}
                        className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-savoy-blue rounded-md hover:bg-blue-700'
                        ref={cancelButtonRef}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
