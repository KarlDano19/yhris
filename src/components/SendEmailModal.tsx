import { useEffect, useMemo, useState, useRef, useCallback } from "react";

import dynamic from "next/dynamic";

import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';

import CustomToast from "@/components/CustomToast";
import UnsavedChangesModal from "@/components/UnsavedChangesModal";
import ModalLayout from "@/components/ModalLayout";
import CreateEditEmailTemplateModal from "@/components/pages/(auth)/employer/settings/general-settings/email-template/modal/CreateEditEmailTemplateModal";
import EmailField from "@/components/common/EmailField";
import useGetEmailTemplateItems from "@/components/hooks/useGetEmailTemplateItems";
import useTagTo from "@/components/hooks/useTagTo";
import useTagCc from "@/components/hooks/useTagCc";
import useTagBcc from "@/components/hooks/useTagBcc";

import SelectChevronDown from "@/svg/SelectChevronDownDummy";
import DeleteIcon from "@/svg/DeleteIcon";
import EyePassword from "@/svg/EyePassword";

import { QUILL_FORMATS, QUILL_MODULES } from "@/helpers/constants";
import "react-quill/dist/quill.snow.css";

interface Field {
  onChange: (value: any) => void;
  value: any;
}

type T_EmailTemplateModalData = {
  id: number | null;
  open: boolean;
  mode: 'create' | 'edit';
};

// Helper function to check if HTML content is empty
const isHtmlEmpty = (html: string | null | undefined): boolean => {
  if (!html) return true;                 
  const trimmed = html.trim();
  return trimmed === '' || trimmed === '<p><br></p>' || trimmed === '<p></p>';
};

export interface SendEmailModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultRecipients?: string[];
  showAttachment?: boolean;
  customAttachmentSection?: React.ReactNode;
  customContentAboveAttachment?: React.ReactNode;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  customFooter?: React.ReactNode;
  showEmailTemplate?: boolean;
  showSubject?: boolean;
  showDragDropAttachment?: boolean;
  allowMultipleAttachments?: boolean;  // Enable multiple file attachments (default: false for single attachment)
  // Pre-populated data props
  prePopulatedData?: {
    subject?: string;
    message?: string;
    to?: string[];
    cc?: string[];
    bcc?: string[];
  };
}

export default function SendEmailModal({
  title,
  isOpen,
  onClose,
  onSubmit,
  defaultRecipients = [],
  showAttachment = true,
  customAttachmentSection,
  customContentAboveAttachment,
  onSuccess,
  onError,
  isLoading = false,
  submitButtonText = "Send",
  customFooter,
  showEmailTemplate = true,
  showSubject = true,
  showDragDropAttachment = false,
  allowMultipleAttachments = false,  // Default to single attachment mode
  prePopulatedData
}: SendEmailModalProps) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    [isOpen]
  );
  
  const [isCCOpen, setIsCCOpen] = useState(false);
  const [isBCCOpen, setIsBCCOpen] = useState(false);
  const [inputTo, setInputTo] = useState("");
  const [inputCc, setInputCc] = useState("");
  const [inputBcc, setInputBcc] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [templateAttachments, setTemplateAttachments] = useState<Array<{id?: number; attachment: string; created_at?: string}>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  // Internal state to track if multiple attachments should be enabled (based on template or prop)
  const [effectiveAllowMultiple, setEffectiveAllowMultiple] = useState(allowMultipleAttachments);
  // Simple state for tooltip visibility
  const [showTooltip, setShowTooltip] = useState(true);
  const [isToFocused, setIsToFocused] = useState(false);
  const [isCcFocused, setIsCcFocused] = useState(false);
  const [isBccFocused, setIsBccFocused] = useState(false);
  
  // Don't manage attachment state when using custom attachment section
  const shouldManageAttachment = showAttachment && !customAttachmentSection && !showDragDropAttachment;
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState<boolean>(false);
  const isInitialized = useRef(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<(() => void) | null>(null);
  const [emailTemplateModal, setEmailTemplateModal] = useState<T_EmailTemplateModalData | null>({ id: null, open: false, mode: 'create' });
  
  const { tagsTo, setTagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(
    inputTo,
    setInputTo
  );
  const { tagsCc, setTagsCc, handleKeyDown, handleRemoveTag } = useTagCc(
    inputCc,
    setInputCc
  );
  const { tagsBcc, setTagsBcc, handleKeyDownBcc, handleRemoveTagBcc } =
    useTagBcc(inputBcc, setInputBcc);
    
  const { register, handleSubmit, setValue, watch, trigger, control, formState: { errors }, setError, clearErrors } = useForm({
    defaultValues: {
      bcc: "",
      cc: "",
      email: "",
      template: "",
      subject: "",
      message: "",
    },
  });
  
  const { data: dataEmailTemplate, refetch: refetchEmailTemplates } = useGetEmailTemplateItems();



  // Handle employee selection for TO field
  const handleEmployeeSelectTo = (employee: any) => {
    if (employee.type === 'individual_select') {
      setTagsTo([...tagsTo, employee.email]);
    } else if (employee.type === 'department_select') {
      setTagsTo([...tagsTo, ...employee.emails]);
    } else if (employee.type === 'department_remove') {
      setTagsTo(employee.remainingTags);
    }
  };

  // Handle employee selection for CC field
  const handleEmployeeSelectCc = (employee: any) => {
    if (employee.type === 'individual_select') {
      setTagsCc([...tagsCc, employee.email]);
    } else if (employee.type === 'department_select') {
      setTagsCc([...tagsCc, ...employee.emails]);
    } else if (employee.type === 'department_remove') {
      setTagsCc(employee.remainingTags);
    }
  };

  // Handle employee selection for BCC field
  const handleEmployeeSelectBcc = (employee: any) => {
    if (employee.type === 'individual_select') {
      setTagsBcc([...tagsBcc, employee.email]);
    } else if (employee.type === 'department_select') {
      setTagsBcc([...tagsBcc, ...employee.emails]);
    } else if (employee.type === 'department_remove') {
      setTagsBcc(employee.remainingTags);
    }
  };

  // Helper function to check if an item was created within 24 hours
  const isWithin24Hours = (createdAt: string | Date): boolean => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24;
  };

  // Transform email template data for react-select with separation for newly added templates
  const emailTemplateOptions = useMemo(() => {
    if (!dataEmailTemplate) return [];
    
    // Helper function to count attachments for a template
    const getAttachmentCount = (template: any): number => {
      if (template.attachments && Array.isArray(template.attachments)) {
        return template.attachments.length;
      } else if (template.attachment) {
        return 1;
      }
      return 0;
    };
    
    const allTemplates = dataEmailTemplate.map((template: any) => ({
      value: template.id,
      label: template.subject,
      createdAt: template.created_at,
      template: template,
      attachmentCount: getAttachmentCount(template)
    }));
    
    // Filter templates based on attachment mode
    // In single attachment mode, only show templates with 0 or 1 attachment
    // In multiple attachment mode, show all templates
    const filteredTemplates = effectiveAllowMultiple
      ? allTemplates  // Show all templates in multiple mode
      : allTemplates.filter((t: any) => t.attachmentCount <= 1);  // Only 0 or 1 attachment in single mode
    
    // Filter and sort newly added templates (within 24 hours of creation)
    const newTemplates = filteredTemplates
      .filter((template: any) => isWithin24Hours(template.createdAt))
      .sort((a: any, b: any) => {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return bDate.getTime() - aDate.getTime(); // Most recent first
      });
    
    // Filter and sort regular templates alphabetically
    const regularTemplates = filteredTemplates
      .filter((template: any) => !isWithin24Hours(template.createdAt))
      .sort((a: any, b: any) => a.label.localeCompare(b.label)); // Alphabetical order
    
    // Create options with separation
    const options = [];
    
    // Add newly added templates at the top with "New" label
    if (newTemplates.length > 0) {
      options.push({
        label: "New Email Templates",
        options: newTemplates.map((template: any) => ({
          ...template,
          label: `${template.label}`
        })),
        isDisabled: true
      });
    }
    
    // Add separator if there are both new and regular templates
    if (newTemplates.length > 0 && regularTemplates.length > 0) {
      options.push({
        label: "───────────────",
        options: [],
        isDisabled: true
      });
    }
    
    // Add regular templates
    if (regularTemplates.length > 0) {
      options.push({
        label: "All Email Templates",
        options: regularTemplates,
        isDisabled: true
      });
    }
    
    return options;
  }, [dataEmailTemplate, effectiveAllowMultiple]);

  // Function to check if there are unsaved changes
  const hasUnsavedChanges = () => {
    const formData = watch();
    // Check if tagsTo has more than just the default recipients
    const hasAdditionalRecipients = tagsTo.length > defaultRecipients.length || 
      (tagsTo.length === defaultRecipients.length && !defaultRecipients.every(email => tagsTo.includes(email)));
    
    return (
      (showEmailTemplate && formData.template && formData.template !== '') ||
      (showSubject && formData.subject && formData.subject.trim() !== '') ||
      hasAdditionalRecipients ||
      (tagsCc.length > 0) ||
      (tagsBcc.length > 0) ||
      (formData.message && !isHtmlEmpty(formData.message)) ||
      ((shouldManageAttachment || showDragDropAttachment) && (files.length > 0 || templateAttachments.length > 0)) ||
      (effectiveAllowMultiple !== allowMultipleAttachments)  // Track if mode changed due to template
    );
  };

  // Function to handle confirmation modal close (cancel)
  const handleUnsavedChangesCancel = () => {
    setIsUnsavedChangesModalOpen(false);
    setPendingCloseAction(null);
  };

  // Function to handle confirmation modal confirm (proceed with close)
  const handleUnsavedChangesConfirm = () => {
    setIsUnsavedChangesModalOpen(false);
    const action = pendingCloseAction;
    setPendingCloseAction(null);
    
    // Execute the pending close action
    if (action) {
      action();
    }
  };

  // Function to reset all form data
  const resetFormData = () => {
    setValue('template', '');
    setValue('subject', '');
    setValue('message', '');
    setTagsTo(defaultRecipients);
    setTagsCc([]);
    setTagsBcc([]);
    setInputTo('');
    setInputCc('');
    setInputBcc('');
    setCustomSubject('');
    setIsCCOpen(false);
    setIsBCCOpen(false);
    setShowTooltip(true);
    if (shouldManageAttachment || showDragDropAttachment) {
      setFiles([]);
      setTemplateAttachments([]);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
    // Reset effective multiple attachment mode to prop value
    setEffectiveAllowMultiple(allowMultipleAttachments);
    clearErrors();
  };

  // Function to handle modal close with unsaved changes check
  const handleModalClose = (closeAction: () => void) => {
    if (hasUnsavedChanges()) {
      setPendingCloseAction(() => closeAction);
      setIsUnsavedChangesModalOpen(true);
    } else {
      closeAction();
    }
  };

  // Sync effectiveAllowMultiple with prop when modal opens
  useEffect(() => {
    if (isOpen) {
      setEffectiveAllowMultiple(allowMultipleAttachments);
    }
  }, [isOpen, allowMultipleAttachments]);

  useEffect(() => {
    if (isOpen) {
      // Use pre-populated data if available, otherwise use default recipients
      if (prePopulatedData) {
        // Set form fields from pre-populated data
        if (prePopulatedData.subject) {
          setValue('subject', prePopulatedData.subject);
          setCustomSubject(prePopulatedData.subject);
        }
        if (prePopulatedData.message) {
          setValue('message', prePopulatedData.message);
        }
        
        // Set recipient fields
        if (prePopulatedData.to && prePopulatedData.to.length > 0) {
          setTagsTo(prePopulatedData.to);
        } else {
          setTagsTo(defaultRecipients);
        }
        
        if (prePopulatedData.cc && prePopulatedData.cc.length > 0) {
          setTagsCc(prePopulatedData.cc);
          setIsCCOpen(true);
        }
        
        if (prePopulatedData.bcc && prePopulatedData.bcc.length > 0) {
          setTagsBcc(prePopulatedData.bcc);
          setIsBCCOpen(true);
        }
      } else {
        setTagsTo(defaultRecipients);
      }
    }
  }, [isOpen, defaultRecipients, setTagsTo, prePopulatedData, setValue]);

  // Clear errors when tagsTo changes
  useEffect(() => {
    if (tagsTo.length > 0) {
      clearErrors('email');
    }
  }, [tagsTo, clearErrors]);

  // Clear errors when subject changes
  useEffect(() => {
    const subjectContent = watch('subject');
    if (subjectContent && subjectContent.trim() !== '') {
      clearErrors('subject');
    }
  }, [watch('subject'), clearErrors]);

  // Clear errors when message changes
  useEffect(() => {
    const messageContent = watch('message');
    // Only clear errors when message has actual content
    if (!isHtmlEmpty(messageContent)) {
      clearErrors('message');
    }
  }, [watch('message'), clearErrors]);


  const handleClose = () => {
    handleModalClose(() => {
      resetFormData();
      onClose();
    });
  };

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Don't handle attachment upload if using custom attachment section
    if (!shouldManageAttachment && !showDragDropAttachment) {
      return;
    }
    
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files);
      const validFiles: File[] = [];
      
      // If multiple attachments not allowed, only take the first file
      const filesToProcess = effectiveAllowMultiple ? selectedFiles : [selectedFiles[0]];
      
      for (const file of filesToProcess) {
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          toast.custom(() => <CustomToast message={`${file.name} exceeds 10MB limit.`} type='error' />, { duration: 2000 });
          continue;
        }
        validFiles.push(file);
      }
      
      if (validFiles.length > 0) {
        if (effectiveAllowMultiple) {
          // Multiple mode: append to existing files
          setFiles(prev => [...prev, ...validFiles]);
        } else {
          // Single mode: replace existing file
          setFiles(validFiles);
        }
      }
      
      // Clear the file input
      event.target.value = '';
    }
  };

  const handleDrag = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e?.dataTransfer?.files || []);
    
    if (droppedFiles.length > 0) {
      const validFiles: File[] = [];
      // If multiple attachments not allowed, only take the first file
      const filesToProcess = effectiveAllowMultiple ? droppedFiles : [droppedFiles[0]];
      
      for (const file of filesToProcess) {
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          toast.custom(() => <CustomToast message={`${file.name} exceeds 10MB limit.`} type='error' />, { duration: 2000 });
          continue;
        }
        validFiles.push(file);
      }
      if (validFiles.length > 0) {
        if (effectiveAllowMultiple) {
          // Multiple mode: append to existing files
          setFiles(prev => [...prev, ...validFiles]);
        } else {
          // Single mode: replace existing file
          setFiles(validFiles);
        }
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Check total attachments (template + files) to determine if we should keep multiple mode
      const totalAttachments = templateAttachments.length + updated.length;
      // If we have 1 or fewer total attachments and prop is false, disable multiple mode
      // Otherwise, enable multiple mode if prop is true or if we still have multiple total attachments
      if (totalAttachments <= 1 && !allowMultipleAttachments) {
        setEffectiveAllowMultiple(false);
      } else {
        setEffectiveAllowMultiple(totalAttachments > 1 || allowMultipleAttachments);
      }
      return updated;
    });
  };

  const handleRemoveTemplateAttachment = (index: number) => {
    setTemplateAttachments(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Check total attachments (template + files) to determine if we should keep multiple mode
      const totalAttachments = updated.length + files.length;
      // If we have 1 or fewer total attachments and prop is false, disable multiple mode
      // Otherwise, enable multiple mode if prop is true or if we still have multiple total attachments
      if (totalAttachments <= 1 && !allowMultipleAttachments) {
        setEffectiveAllowMultiple(false);
      } else {
        setEffectiveAllowMultiple(totalAttachments > 1 || allowMultipleAttachments);
      }
      return updated;
    });
  };

  const handleAddEmailTemplate = () => {
    setEmailTemplateModal({ id: null, open: true, mode: 'create' });
  };

  const handleEmailTemplateCreated = () => {
    // Refresh email templates list to get the updated data with new creation dates
    refetchEmailTemplates();
    // Reset the modal state to close the create/edit modal
    setEmailTemplateModal({ id: null, open: false, mode: 'create' });
  };

  const handleEmailSent = () => {
    // Clear newly added items when email is sent
    // This ensures that the "New" grouping is reset after successful email sending
  };

  const onSubmitForm = (data: any) => {
    // Validate "To" field manually since it uses tags
    if (tagsTo.length === 0) {
      setError('email', {
        type: 'manual',
        message: 'At least one recipient is required'
      });
      toast.custom(() => <CustomToast message='You cannot proceed due to incomplete fields. Please review.' type='error' />, { duration: 2000 });
      return;
    }

    // Validate subject (only if subject field is shown)
    if (showSubject && !data.subject && !customSubject) {
      setError('subject', {
        type: 'manual',
        message: 'Subject is required'
      });
      toast.custom(() => <CustomToast message='You cannot proceed due to incomplete fields. Please review.' type='error' />, { duration: 2000 });
      return;
    }

    // Validate message
    if (isHtmlEmpty(data.message)) {
      setError('message', {
        type: 'manual',
        message: 'Message is required'
      });
      toast.custom(() => <CustomToast message='You cannot proceed due to incomplete fields. Please review.' type='error' />, { duration: 2000 });
      return;
    }


    const template = data.template ? dataEmailTemplate.find(
      (item: any) => item.id === parseInt(data.template)
    ) : null;
    
    // Combine template attachments (URLs) with new files (File objects)
    // In single attachment mode, only include the first template attachment
    const allAttachments: (File | string)[] = [];
    if (templateAttachments.length > 0) {
      const templateAttsToInclude = effectiveAllowMultiple 
        ? templateAttachments 
        : templateAttachments.slice(0, 1);
      allAttachments.push(...templateAttsToInclude.map(att => att.attachment));
    }
    if (files.length > 0) {
      allAttachments.push(...files);
    }

    const formData = {
      email: tagsTo,
      cc: tagsCc,
      bcc: tagsBcc,
      subject: showSubject ? (customSubject || (template?.subject || '')) : '',
      template: template?.subject || '',
      message: data.message,
      ...((showAttachment || showDragDropAttachment) && allAttachments.length > 0 && {
        // For single attachment mode, use 'attachment' (single), for multiple use 'attachments' (array)
        // Use effectiveAllowMultiple to handle template-based multiple attachments
        ...(effectiveAllowMultiple 
          ? { attachments: allAttachments }
          : { attachment: allAttachments[0] }
        ),
      }),
    };
    
    try {
      onSubmit(formData);
      handleEmailSent();
      resetFormData();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError(error);
    }
  };

  // Call handleEmailSent when the form is submitted
  const onSubmitWithCleanup = handleSubmit((data: any) => {
    handleEmailSent();
    onSubmitForm(data);
  });

  return (
    <>
      <ModalLayout 
        title={title} 
        isOpen={isOpen} 
        handleClose={handleClose}
        nestedModals={
          <>
            {/* Create/Edit Email Template Modal */}
            {emailTemplateModal && (
              <CreateEditEmailTemplateModal
                isOpen={emailTemplateModal}
                setIsOpen={setEmailTemplateModal}
                refetch={handleEmailTemplateCreated}
                onSuccess={handleEmailTemplateCreated}
              />
            )}
          </>
        }
      >
        <form onSubmit={onSubmitWithCleanup}>
          <div className="px-4 pt-4 pb-6">
            {/* Conditional Email Template Section */}
            {showEmailTemplate && (
              <div className="sm:col-span-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="template"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email Template
                  </label>
                  <button
                    type="button"
                    onClick={handleAddEmailTemplate}
                    className="text-sm text-savoy-blue hover:text-blue-700 font-medium"
                  >
                    + Add New Email Template
                  </button>
                </div>
                <div className="mt-2">
                  <Controller
                    name="template"
                    control={control}
                    render={({ field: { onChange, value } }: { field: Field }) => (
                      <Select
                        className="text-sm"
                        classNamePrefix="select"
                        options={emailTemplateOptions}
                        value={emailTemplateOptions.flatMap(group => group.options).find((item: any) => item.value === value)}
                        onChange={(val) => {
                          onChange(val?.value || '');
                          if (val?.template) {
                            const template = val.template;
                            // Check if template.to already contains the default recipients to avoid duplicates
                            const templateRecipients = template.to || [];
                            const newRecipients = [...defaultRecipients];
                            templateRecipients.forEach((email: string) => {
                              if (!newRecipients.includes(email)) {
                                newRecipients.push(email);
                              }
                            });
                            setTagsTo(newRecipients);
                            
                            if (template.bcc) {
                              setIsBCCOpen(true);
                              setTagsBcc(template.bcc);
                            } else {
                              setTagsBcc([]);
                            }
                            if (template.cc) {
                              setIsCCOpen(true);
                              setTagsCc(template.cc);
                            } else {
                              setTagsCc([]);
                            }
                            setValue("message", template.body);
                            setValue("subject", template.subject);
                            setCustomSubject(template.subject);
                            clearErrors('subject');
                            clearErrors('message');
                            
                            // Handle template attachments if drag and drop is enabled
                            if (showDragDropAttachment && template.attachments && Array.isArray(template.attachments)) {
                              const templateAtts = template.attachments.map((att: any) => ({
                                id: att.id,
                                attachment: typeof att === 'string' ? att : att.attachment,
                                created_at: att.created_at
                              }));
                              // If template has multiple attachments but prop doesn't allow multiple, only keep first
                              // Otherwise, keep all attachments
                              if (templateAtts.length > 1 && !allowMultipleAttachments) {
                                // Single attachment mode: only keep first attachment
                                setTemplateAttachments([templateAtts[0]]);
                                setEffectiveAllowMultiple(false);
                              } else {
                                // Multiple attachment mode or single attachment template
                                setTemplateAttachments(templateAtts);
                                setEffectiveAllowMultiple(templateAtts.length > 1 || allowMultipleAttachments);
                              }
                              setFiles([]);
                            } else if (showDragDropAttachment && template.attachment) {
                              // Handle legacy single attachment field
                              setTemplateAttachments([{ attachment: template.attachment }]);
                              setFiles([]);
                              // Reset to prop value for single attachment
                              setEffectiveAllowMultiple(allowMultipleAttachments);
                            } else {
                              // No template attachments, reset to prop value
                              setEffectiveAllowMultiple(allowMultipleAttachments);
                            }
                          } else {
                            // Clear template-related fields if no template is selected
                            setTagsTo(defaultRecipients);
                            setTagsCc([]);
                            setTagsBcc([]);
                            setValue("message", "");
                            setValue("subject", "");
                            setCustomSubject("");
                            
                            // Clear template attachments when no template is selected
                            if (showDragDropAttachment) {
                              setTemplateAttachments([]);
                            }
                            // Reset to prop value when no template is selected
                            setEffectiveAllowMultiple(allowMultipleAttachments);
                          }
                        }}
                        components={{
                          DropdownIndicator: () => (
                            <div className="pointer-events-none px-2">
                              <SelectChevronDown />
                            </div>
                          ),
                          IndicatorSeparator: () => null,
                        }}
                        isClearable={false}
                        noOptionsMessage={() => 'No email templates available'}
                        placeholder="Select an email template..."
                        formatGroupLabel={(group) => (
                          <div className="text-xs font-semibold text-gray-500 py-1">
                            {group.label}
                          </div>
                        )}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          menu: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            )}
            
            {/* Conditional Subject Section */}
            {showSubject && (
              <div className={`sm:col-span-4 w-full ${showEmailTemplate ? 'mt-4' : ''}`}>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Subject<span className="text-red-600">*</span>
                </label>
                {errors.subject && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.subject.message || 'Subject is required'}
                  </p>
                )}
                <input
                  id="subject"
                  type="text"
                  {...register("subject", { required: 'Subject is required' })}
                  onChange={(e) => {
                    setCustomSubject(e.target.value);
                    setValue('subject', e.target.value);
                    if (e.target.value.trim() !== '') {
                      clearErrors('subject');
                    } else {
                      setError('subject', {
                        type: 'manual',
                        message: 'Subject is required'
                      });
                    }
                  }}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            )}
            
            
            <div className="sm:col-span-4 mt-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  To<span className="text-red-600">*</span>
                </label>
                {tagsTo.length > 1 && (
                  <button
                    type="button"
                    className="text-xs text-red-600 hover:text-red-800 hover:underline"
                    onClick={() => setTagsTo([])}
                  >
                    Unselect All
                  </button>
                )}
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
              <div className="mt-2 flex rounded-md shadow-sm">
                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                  <EmailField
                    tags={tagsTo}
                    inputValue={inputTo}
                    onInputChange={(value) => {
                      setInputTo(value);
                      setShowTooltip(false);
                    }}
                    onInputFocus={() => {
                      setShowTooltip(false);
                      setIsToFocused(true);
                    }}
                    onInputBlur={() => {
                      setIsToFocused(false);
                      if (!inputTo.trim()) {
                        setShowTooltip(true);
                      }
                    }}
                    onKeyDown={handleKeyDownTo}
                    onEmployeeSelect={handleEmployeeSelectTo}
                    onRemoveTag={handleRemoveTagTo}
                    showTooltip={showTooltip}
                    tooltipId="to-section-tooltip"
                    isFocused={isToFocused}
                  />
                </div>
                <button
                  type="button"
                  className={`relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 ${
                    isCCOpen
                      ? "bg-savoy-blue text-white hover:bg-blue-700"
                      : "bg-gray-50"
                  }`}
                  onClick={() => setIsCCOpen(!isCCOpen)}
                >
                  CC
                </button>
                <button
                  type="button"
                  className={`relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 ${
                    isBCCOpen
                      ? "bg-savoy-blue text-white hover:bg-blue-700"
                      : "bg-gray-50"
                  }`}
                  onClick={() => setIsBCCOpen(!isBCCOpen)}
                >
                  BCC
                </button>
              </div>
            </div>
            {isCCOpen && (
              <div className="sm:col-span-4 mt-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    CC
                  </label>
                  {tagsCc.length > 1 && (
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:text-red-800 hover:underline"
                      onClick={() => setTagsCc([])}
                    >
                      Unselect All
                    </button>
                  )}
                </div>
                <div className="mt-2">
                  <EmailField
                    tags={tagsCc}
                    inputValue={inputCc}
                    onInputChange={(value) => {
                      setInputCc(value);
                      setShowTooltip(false);
                    }}
                    onInputFocus={() => {
                      setShowTooltip(false);
                      setIsCcFocused(true);
                    }}
                    onInputBlur={() => {
                      setIsCcFocused(false);
                      if (!inputCc.trim()) {
                        setShowTooltip(true);
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    onEmployeeSelect={handleEmployeeSelectCc}
                    onRemoveTag={handleRemoveTag}
                    showTooltip={showTooltip}
                    tooltipId="cc-section-tooltip"
                    isFocused={isCcFocused}
                  />
                </div>
              </div>
            )}
            {isBCCOpen && (
              <div className="sm:col-span-4 mt-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="bcc"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    BCC
                  </label>
                  {tagsBcc.length > 1 && (
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:text-red-800 hover:underline"
                      onClick={() => setTagsBcc([])}
                    >
                      Unselect All
                    </button>
                  )}
                </div>
                <div className="mt-2">
                  <EmailField
                    tags={tagsBcc}
                    inputValue={inputBcc}
                    onInputChange={(value) => {
                      setInputBcc(value);
                      setShowTooltip(false);
                    }}
                    onInputFocus={() => {
                      setShowTooltip(false);
                      setIsBccFocused(true);
                    }}
                    onInputBlur={() => {
                      setIsBccFocused(false);
                      if (!inputBcc.trim()) {
                        setShowTooltip(true);
                      }
                    }}
                    onKeyDown={handleKeyDownBcc}
                    onEmployeeSelect={handleEmployeeSelectBcc}
                    onRemoveTag={handleRemoveTagBcc}
                    showTooltip={showTooltip}
                    tooltipId="bcc-section-tooltip"
                    isFocused={isBccFocused}
                  />
                </div>
              </div>
            )}
            <div className="sm:col-span-4 mt-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Message<span className="text-red-600">*</span>
              </label>
              {errors.message && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.message.message || 'Message is required'}
                </p>
              )}
              <div className="mt-2 h-72 mb-12">
                <textarea
                  {...register("message", { required: 'Message is required' })}
                  rows={4}
                  id="message"
                  hidden
                />
                <ReactQuill
                  onChange={(value) => {
                    setValue("message", value);
                    // Only clear errors when there is actual content
                    if (!isHtmlEmpty(value)) {
                      clearErrors('message');
                    } else {
                      // Set error when content is empty or just a blank line
                      setError('message', {
                        type: 'manual',
                        message: 'Message is required'
                      });
                    }
                  }}
                  formats={QUILL_FORMATS}
                  modules={QUILL_MODULES}
                  style={{ height: "100%", padding: "5px 8px !important" }}
                  value={watch("message")}
                />
              </div>
            </div>

            {/* Custom content above attachment section */}
            {customContentAboveAttachment && (
              <div className="mt-4">
                {customContentAboveAttachment}
              </div>
            )}

            {/* Conditional Attachment section */}
            {(showAttachment || showDragDropAttachment) && (
              <div className='sm:col-span-4 mt-4'>
                {customAttachmentSection ? (
                  customAttachmentSection
                ) : showDragDropAttachment ? (
                  <>
                    <label htmlFor='attachments' className='block text-sm font-medium leading-6 text-gray-900'>
                      Attachments
                    </label>
                    <div>
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className='block w-full rounded-md border-0 py-8 px-3 text-[#ACB9CB] shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 text-center'
                      >
                        <label
                          className={`${
                            files.length === 0 && templateAttachments.length === 0
                              ? 'file-preview cursor-pointer hover:bg-blue hover:text-blue-600 text-base leading-normal'
                              : 'hidden'
                          }`}
                        >
                          {effectiveAllowMultiple ? 'Drop files to upload or click to select' : 'Drop file to upload or click to select'}
                          <input
                            name='attachments'
                            id='attachments'
                            ref={inputRef}
                            type='file'
                            multiple={effectiveAllowMultiple}
                            className='sr-only'
                            onChange={handleAttachmentUpload}
                            accept='application/msword, application/pdf, text/csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, image/jpeg, image/png'
                          />
                        </label>
                        
                        {/* Show replace file option for single attachment mode when file exists */}
                        {!effectiveAllowMultiple && files.length > 0 && (
                          <label className='text-sm text-blue-600 cursor-pointer hover:underline'>
                            Replace file
                            <input
                              name='attachments-replace'
                              id='attachments-replace'
                              type='file'
                              multiple={false}
                              className='sr-only'
                              onChange={handleAttachmentUpload}
                              accept='application/msword, application/pdf, text/csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, image/jpeg, image/png'
                            />
                          </label>
                        )}
                        
                        {/* Show existing template attachments when available */}
                        {templateAttachments.length > 0 && (
                          <div className='mb-4'>
                            <p className='text-xs text-gray-600 mb-2'>Template Attachments:</p>
                            {(effectiveAllowMultiple ? templateAttachments : templateAttachments.slice(0, 1)).map((attachment, index) => (
                              <div key={index} className='flex items-center justify-between py-2 px-3 mb-2 bg-gray-50 rounded'>
                                <div className='flex-1'>
                                  <p className='text-sm text-slate-800 font-light'>
                                    {attachment.attachment.split('/').pop()}
                                  </p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                  <a 
                                    href={attachment.attachment} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className='cursor-pointer'
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <EyePassword visible />
                                  </a>
                                  <button
                                    type='button'
                                    className='cursor-pointer'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveTemplateAttachment(index);
                                    }}
                                  >
                                    <DeleteIcon />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Show new files when selected */}
                        {files.length > 0 && (
                          <div className='mb-4'>
                            <p className='text-xs text-gray-600 mb-2'>
                              {effectiveAllowMultiple ? 'New Files to Upload:' : 'File to Upload:'}
                            </p>
                            {files.map((file, index) => (
                              <div key={index} className='flex items-center justify-between py-2 px-3 mb-2 bg-blue-50 rounded'>
                                <div className='flex-1'>
                                  <p className='text-sm text-slate-800 font-light'>{file.name}</p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                  <a 
                                    href={URL.createObjectURL(file)} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className='cursor-pointer'
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <EyePassword visible />
                                  </a>
                                  <button
                                    type='button'
                                    className='cursor-pointer'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveFile(index);
                                    }}
                                  >
                                    <DeleteIcon />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Show upload area if there are files already - only for multiple attachment mode */}
                        {(files.length > 0 || templateAttachments.length > 0) && effectiveAllowMultiple && (
                          <label className='text-sm text-blue-600 cursor-pointer hover:underline'>
                            + Add more files
                            <input
                              name='attachments'
                              id='attachments-add'
                              type='file'
                              multiple
                              className='sr-only'
                              onChange={handleAttachmentUpload}
                              accept='application/msword, application/pdf, text/csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, image/jpeg, image/png'
                            />
                          </label>
                        )}
                      </div>
                      <h1 className='text-xs pl-2'>Maximum file size: 10 mb per file</h1>
                    </div>
                  </>
                ) : (
                  <>
                    <label htmlFor='attachments' className='block text-sm font-medium leading-6 text-gray-900'>
                      Attachments
                    </label>
                    <div>
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className='block w-full rounded-md border-0 py-8 px-3 text-[#ACB9CB] shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 text-center'
                      >
                        <label
                          className={`${
                            files.length === 0 && templateAttachments.length === 0
                              ? 'file-preview cursor-pointer hover:bg-blue hover:text-blue-600 text-base leading-normal'
                              : 'hidden'
                          }`}
                        >
                          {effectiveAllowMultiple ? 'Drop files to upload or click to select' : 'Drop file to upload or click to select'}
                          <input
                            name='attachments'
                            id='attachments'
                            ref={inputRef}
                            type='file'
                            multiple={effectiveAllowMultiple}
                            className='sr-only'
                            onChange={handleAttachmentUpload}
                            accept='application/msword, application/pdf, text/csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, image/jpeg, image/png'
                          />
                        </label>
                        
                        {/* Show replace file option for single attachment mode when file exists */}
                        {!effectiveAllowMultiple && files.length > 0 && (
                          <label className='text-sm text-blue-600 cursor-pointer hover:underline'>
                            Replace file
                            <input
                              name='attachments-replace'
                              id='attachments-replace'
                              type='file'
                              multiple={false}
                              className='sr-only'
                              onChange={handleAttachmentUpload}
                              accept='application/msword, application/pdf, text/csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, image/jpeg, image/png'
                            />
                          </label>
                        )}
                        
                        {/* Show existing template attachments when available */}
                        {templateAttachments.length > 0 && (
                          <div className='mb-4'>
                            <p className='text-xs text-gray-600 mb-2'>Template Attachments:</p>
                            {(effectiveAllowMultiple ? templateAttachments : templateAttachments.slice(0, 1)).map((attachment, index) => (
                              <div key={index} className='flex items-center justify-between py-2 px-3 mb-2 bg-gray-50 rounded'>
                                <div className='flex-1'>
                                  <p className='text-sm text-slate-800 font-light'>
                                    {attachment.attachment.split('/').pop()}
                                  </p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                  <a 
                                    href={attachment.attachment} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className='cursor-pointer'
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <EyePassword visible />
                                  </a>
                                  <button
                                    type='button'
                                    className='cursor-pointer'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveTemplateAttachment(index);
                                    }}
                                  >
                                    <DeleteIcon />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Show new files when selected */}
                        {files.length > 0 && (
                          <div className='mb-4'>
                            <p className='text-xs text-gray-600 mb-2'>
                              {effectiveAllowMultiple ? 'New Files to Upload:' : 'File to Upload:'}
                            </p>
                            {files.map((file, index) => (
                              <div key={index} className='flex items-center justify-between py-2 px-3 mb-2 bg-blue-50 rounded'>
                                <div className='flex-1'>
                                  <p className='text-sm text-slate-800 font-light'>{file.name}</p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                  <a 
                                    href={URL.createObjectURL(file)} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className='cursor-pointer'
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <EyePassword visible />
                                  </a>
                                  <button
                                    type='button'
                                    className='cursor-pointer'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveFile(index);
                                    }}
                                  >
                                    <DeleteIcon />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Show upload area if there are files already - only for multiple attachment mode */}
                        {(files.length > 0 || templateAttachments.length > 0) && effectiveAllowMultiple && (
                          <label className='text-sm text-blue-600 cursor-pointer hover:underline'>
                            + Add more files
                            <input
                              name='attachments'
                              id='attachments-add'
                              type='file'
                              multiple
                              className='sr-only'
                              onChange={handleAttachmentUpload}
                              accept='application/msword, application/pdf, text/csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, image/jpeg, image/png'
                            />
                          </label>
                        )}
                      </div>
                      <h1 className='text-xs pl-2'>Maximum file size: 10 mb per file</h1>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <hr />
          {customFooter ? (
            customFooter
          ) : (
            <div className="flex items-center gap-4 text-[15px] font-bold justify-end flex-wrap p-4">
              <button
                onClick={handleClose}
                type="button"
                className="border border-[#355FD0] rounded-lg py-2 px-6 text-[#355FD0] hover:bg-[#355FD0]/[.15]"
              >
                Close
              </button>
              <button
                type="submit"
                className="rounded-lg py-2 px-6 bg-[#355FD0] text-white hover:bg-[#3156bd]"
                disabled={isLoading}
                onClick={async (e) => {
                  // Trigger validation for all required fields
                  let subjectValid = true;
                  if (showSubject) {
                    subjectValid = await trigger('subject');
                  }
                  
                  
                  // Check message content specifically for empty HTML
                  const messageContent = watch('message');
                  let messageValid = !isHtmlEmpty(messageContent);
                  
                  if (!messageValid) {
                    setError('message', {
                      type: 'manual',
                      message: 'Message is required'
                    });
                  }
                  
                  // Check if all validations pass
                  if (!subjectValid || !messageValid || tagsTo.length === 0) {
                    e.preventDefault();
                    // Set error for "email" field if no recipients
                    if (tagsTo.length === 0) {
                      setError('email', {
                        type: 'manual',
                        message: 'At least one recipient is required'
                      });
                    }
                    toast.custom(
                      () => (
                        <CustomToast
                          message={'You cannot proceed due to incomplete fields. Please review.'}
                          type='error'
                        />
                      ),
                      {
                        duration: 2000,
                      }
                    );
                  }
                }}
              >
                {isLoading ? (
                  <div
                    className='animate-spin inline-block w-[20px] h-[20px] border-[2px] border-current border-t-transparent text-white rounded-full'
                    role='status'
                    aria-label='loading'
                  >
                    <span className='sr-only'>Loading...</span>
                  </div>
                ) : (
                  submitButtonText
                )}
              </button>
            </div>
          )}
        </form>
      </ModalLayout>
      
      {/* Unsaved Changes Confirmation Modal */}
      {isUnsavedChangesModalOpen && (
        <UnsavedChangesModal
          isOpen={isUnsavedChangesModalOpen}
          onClose={handleUnsavedChangesCancel}
          onConfirm={handleUnsavedChangesConfirm}
          isLoading={false}
          isSwitchingEmployee={false}
          contentType="email"
        />
      )}
      
      {/* Tooltips */}
      <Tooltip id='to-section-tooltip' />
      <Tooltip id='cc-section-tooltip' />
      <Tooltip id='bcc-section-tooltip' />
    </>
  );
}
