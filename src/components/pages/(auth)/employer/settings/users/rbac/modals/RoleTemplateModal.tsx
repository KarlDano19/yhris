import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useCreateRoleFromTemplate from '../hooks/useCreateRoleFromTemplate';
import useGetRoleTemplates from '../hooks/useGetRoleTemplates';

import { XCircleIcon, DocumentDuplicateIcon, CheckIcon, UserGroupIcon } from '@heroicons/react/24/solid';

type T_ModalData = {
  open: boolean;
};

interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  permissions: Array<{
    name: string;
    codename: string;
    category: string;
  }>;
  role_type: string;
}

export default function RoleTemplateModal({
  refetch, 
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customRoleName, setCustomRoleName] = useState<string>('');
  
  const { data: templatesData } = useGetRoleTemplates();
  const { mutate: createRoleFromTemplate, isLoading: isLoadingCreateRole } = useCreateRoleFromTemplate();

  const watchedTemplate = watch('template_id');

  const onSubmit = handleSubmit((data) => {
    if (!selectedTemplate) {
      toast.custom(() => <CustomToast message='Please select a role template' type='error' />, {
        duration: 5000,
      });
      return;
    }

    const callbackReq = {
      onSuccess: (responseData: any) => {
        toast.custom(() => <CustomToast message={responseData.message} type='success' />, {
          duration: 5000,
        });
        setIsOpen(null);
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };

    const templateData = {
      template_id: selectedTemplate,
      custom_name: customRoleName || undefined,
    };

    createRoleFromTemplate(templateData, callbackReq);
  });

  const selectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setValue('template_id', templateId);
    
    // Auto-fill role name from template if no custom name
    const template = templatesData?.find((t: RoleTemplate) => t.id === templateId);
    if (template && !customRoleName) {
      setCustomRoleName(template.name);
    }
  };

  const customCloseModal = () => {
    reset();
    setSelectedTemplate(null);
    setCustomRoleName('');
    setIsOpen(null);
  };

  const selectedTemplateData = templatesData?.find((t: RoleTemplate) => t.id === selectedTemplate);

  return (
    <>
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:mx-8 sm:w-full sm:max-w-4xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <DocumentDuplicateIcon className='w-6 h-6 text-white mr-2' />
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Create Role from Template</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                  </div>
                  <div className='md:mx-6 my-4'>
                    <form onSubmit={onSubmit}>
                      <div className='px-4 pt-4 pb-6'>
                        <div className={`${Object.keys(errors).length > 0 || !selectedTemplate ? 'block' : 'hidden'} rounded-md bg-red-50 p-4 mb-3`}>
                          <div className='flex'>
                            <div className='flex-shrink-0'>
                              <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
                            </div>
                            <div className='ml-3'>
                              <h3 className='text-sm font-medium text-red-800'>
                                {!selectedTemplate ? 'Please select a template to continue.' : 'You cannot proceed due to incomplete fields. Please review.'}
                              </h3>
                            </div>
                          </div>
                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                          {/* Template Selection */}
                          <div className='lg:col-span-1'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200'>
                              Select Template
                            </h3>
                            <div className='space-y-3 max-h-96 overflow-y-auto'>
                              {templatesData?.map((template: RoleTemplate) => (
                                <div
                                  key={template.id}
                                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                    selectedTemplate === template.id
                                      ? 'border-savoy-blue bg-blue-50'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                  onClick={() => selectTemplate(template.id)}
                                >
                                  <div className='flex items-start'>
                                    <div className='flex-shrink-0 mr-3'>
                                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                        selectedTemplate === template.id
                                          ? 'bg-savoy-blue border-savoy-blue'
                                          : 'border-gray-300'
                                      }`}>
                                        {selectedTemplate === template.id && (
                                          <CheckIcon className='w-3 h-3 text-white' />
                                        )}
                                      </div>
                                    </div>
                                    <div className='flex-1'>
                                      <div className='flex items-center mb-1'>
                                        <UserGroupIcon className='w-4 h-4 text-gray-500 mr-2' />
                                        <h4 className='text-sm font-medium text-gray-900'>{template.name}</h4>
                                      </div>
                                      <p className='text-xs text-gray-600 mb-2'>{template.description}</p>
                                      <div className='flex items-center text-xs text-blue-600'>
                                        <span className='capitalize'>{template.role_type} Role</span>
                                        <span className='mx-1'>•</span>
                                        <span>{template.permissions?.length || 0} permissions</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {(!templatesData || templatesData.length === 0) && (
                                <div className='text-center py-8 text-gray-500'>
                                  <DocumentDuplicateIcon className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                                  <p>No templates available</p>
                                  <p className='text-sm'>Contact your administrator to set up role templates</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Template Preview & Customization */}
                          <div className='lg:col-span-1'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200'>
                              {selectedTemplate ? 'Template Preview' : 'Select a template to preview'}
                            </h3>
                            
                            {selectedTemplate && selectedTemplateData ? (
                              <div className='space-y-4'>
                                {/* Custom Role Name */}
                                <div>
                                  <label
                                    htmlFor='custom_name'
                                    className='block text-sm font-medium leading-6 text-gray-900 mb-2'
                                  >
                                    Custom Role Name (optional)
                                  </label>
                                  <input
                                    type='text'
                                    id='custom_name'
                                    value={customRoleName}
                                    onChange={(e) => setCustomRoleName(e.target.value)}
                                    className='block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
                                    placeholder={selectedTemplateData.name}
                                  />
                                  <p className='text-xs text-gray-500 mt-1'>
                                    Leave empty to use template name: &quot;{selectedTemplateData.name}&quot;
                                  </p>
                                </div>

                                {/* Template Info */}
                                <div className='bg-gray-50 p-4 rounded-lg'>
                                  <h4 className='text-sm font-medium text-gray-900 mb-2'>Template Information</h4>
                                  <dl className='space-y-2'>
                                    <div>
                                      <dt className='text-xs text-gray-500'>Name</dt>
                                      <dd className='text-sm text-gray-900'>{selectedTemplateData.name}</dd>
                                    </div>
                                    <div>
                                      <dt className='text-xs text-gray-500'>Type</dt>
                                      <dd className='text-sm text-gray-900 capitalize'>{selectedTemplateData.role_type}</dd>
                                    </div>
                                    <div>
                                      <dt className='text-xs text-gray-500'>Description</dt>
                                      <dd className='text-sm text-gray-900'>{selectedTemplateData.description}</dd>
                                    </div>
                                  </dl>
                                </div>

                                {/* Permissions Preview */}
                                <div>
                                  <h4 className='text-sm font-medium text-gray-900 mb-2'>
                                    Included Permissions ({selectedTemplateData.permissions?.length || 0})
                                  </h4>
                                  <div className='max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3'>
                                    {selectedTemplateData.permissions?.length > 0 ? (
                                      <div className='space-y-2'>
                                        {selectedTemplateData.permissions.map((permission: any, index: number) => (
                                          <div key={index} className='flex items-start text-sm'>
                                            <CheckIcon className='w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                                            <div className='min-w-0 flex-1'>
                                              <div className='text-gray-900'>{permission.name}</div>
                                              <div className='text-xs text-gray-500'>
                                                {permission.category} • {permission.codename}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className='text-center text-gray-500 text-sm'>
                                        No permissions included in this template
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className='text-center py-12 text-gray-400'>
                                <DocumentDuplicateIcon className='w-16 h-16 mx-auto mb-4 text-gray-300' />
                                <p>Select a template to see its details and permissions</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                        <button
                          type='submit'
                          className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                          disabled={isLoadingCreateRole || !selectedTemplate}
                        >
                          {isLoadingCreateRole && (
                            <div role='status'>
                              <svg
                                aria-hidden='true'
                                className='inline w-6 h-6 mr-2 text-gray-200 animate-spin fill-blue-600'
                                viewBox='0 0 100 101'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                  fill='currentColor'
                                />
                                <path
                                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                  fill='currentFill'
                                />
                              </svg>
                              <span className='sr-only'>Loading...</span>
                            </div>
                          )}
                          {!isLoadingCreateRole && 'Create Role from Template'}
                        </button>
                        <button
                          type='button'
                          className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:mt-0 sm:w-auto'
                          onClick={() => customCloseModal()}
                          ref={cancelButtonRef}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
