import { Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip } from 'react-tooltip';

import { XCircleIcon } from '@heroicons/react/24/solid';
import DeleteIcon from '@/svg/DeleteIcon';

import { T_JobPostingDraft } from '@/types/job_posting';

interface LoadDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: T_JobPostingDraft[];
  onLoadDraft: (draft: T_JobPostingDraft) => void;
  onDeleteDraft: (draftId: number) => void;
  isLoading?: boolean;
  isDeleting?: boolean;
}

export default function LoadDraftModal({
  isOpen,
  onClose,
  drafts,
  onLoadDraft,
  onDeleteDraft,
  isLoading = false,
  isDeleting = false,
}: LoadDraftModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="flex bg-savoy-blue p-2 items-center rounded-t-lg">
                  <h3 className="flex-1 text-white ml-2 font-semibold">Load Draft</h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={onClose}
                  />
                </div>

                <div className="px-4 pt-4 pb-4">

                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-savoy-blue"></div>
                    </div>
                  ) : drafts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No drafts found</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {drafts.map((draft) => (
                        <div
                          key={draft.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-savoy-blue transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {draft.job_title}
                              </h4>
                              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                <span>
                                  {formatDistanceToNow(new Date(draft.updated_at), {
                                    addSuffix: true,
                                  })}
                                </span>
                              </div>
                              {draft.source === 'session_expiry' && (
                                <span className="mt-2 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                  Saved from session expiry
                                </span>
                              )}
                              {draft.id === 0 && (
                                <span className="mt-2 inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-800 ring-1 ring-inset ring-orange-600/20">
                                  Local Draft (Not synced to server)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                type="button"
                                className="inline-flex items-center rounded-md bg-savoy-blue px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => onLoadDraft(draft)}
                                disabled={isDeleting}
                              >
                                Load
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteDraft(draft.id)}
                                data-tooltip-id="delete-draft-tooltip"
                                data-tooltip-content={draft.id === 0 ? "Clear local draft" : "Delete draft"}
                                disabled={isDeleting}
                                className={`inline-flex items-center p-1.5 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <DeleteIcon />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <hr />
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
        <Tooltip id="delete-draft-tooltip" />
      </Dialog>
    </Transition.Root>
  );
}
