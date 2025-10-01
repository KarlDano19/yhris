import { useEffect, useMemo, useState, useRef, useCallback } from "react";

import dynamic from "next/dynamic";

import { useForm, Controller } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";
import Select from 'react-select';

import CustomToast from "@/components/CustomToast";
import UnsavedChangesModal from "@/components/UnsavedChangesModal";
import ModalLayout from "@/components/ModalLayout";
import CustomDatePicker from "@/components/CustomDatePicker";
import CreateEmailTemplateModal from "@/components/pages/(auth)/employer/settings/general-settings/email-template/modal/CreateEmailTemplate";
import EmailField from "@/components/pages/(auth)/employer/settings/general-settings/email-template/components/EmailField";
import useGetEmailTemplateItems from "@/components/hooks/useGetEmailTemplateItems";
import useGetEmployeePaginatedSelect from "@/components/hooks/useGetEmployeePaginatedSelect";
import useTagTo from "@/components/hooks/useTagTo";
import useTagCc from "@/components/hooks/useTagCc";
import useTagBcc from "@/components/hooks/useTagBcc";

import { XMarkIcon } from "@heroicons/react/24/outline";
import SelectChevronDown from "@/svg/SelectChevronDownDummy";

import { QUILL_FORMATS, QUILL_MODULES } from "@/helpers/constants";
import "react-quill/dist/quill.snow.css";

interface Field {
  onChange: (value: any) => void;
  value: any;
}

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
  onSuccess?: () => void;
  onError?: (error: any) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  customFooter?: React.ReactNode;
  showDateField?: boolean;
  dateFieldLabel?: string;
  dateFieldRequired?: boolean;
  showEmailTemplate?: boolean;
  showSubject?: boolean;
}

export default function SendEmailModal({
  title,
  isOpen,
  onClose,
  onSubmit,
  defaultRecipients = [],
  showAttachment = true,
  customAttachmentSection,
  onSuccess,
  onError,
  isLoading = false,
  submitButtonText = "Send",
  customFooter,
  showDateField = false,
  dateFieldLabel = "Date",
  dateFieldRequired = false,
  showEmailTemplate = true,
  showSubject = true
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
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentExist, setAttachmentExist] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  
  // Paginated search state
  const [toSearchTerm, setToSearchTerm] = useState('');
  const [ccSearchTerm, setCcSearchTerm] = useState('');
  const [bccSearchTerm, setBccSearchTerm] = useState('');
  const [debouncedToSearch, setDebouncedToSearch] = useState('');
  const [debouncedCcSearch, setDebouncedCcSearch] = useState('');
  const [debouncedBccSearch, setDebouncedBccSearch] = useState('');

  // Generic employee field state management
  const toDropdownRef = useRef<HTMLDivElement>(null);
  const ccDropdownRef = useRef<HTMLDivElement>(null);
  const bccDropdownRef = useRef<HTMLDivElement>(null);
  
  // TO field state
  const [showTOSuggestions, setShowTOSuggestions] = useState(false);
  const [filteredTOEmployees, setFilteredTOEmployees] = useState<any[]>([]);
  const [selectedTOIndex, setSelectedTOIndex] = useState(-1);
  
  // CC field state
  const [showCCSuggestions, setShowCCSuggestions] = useState(false);
  const [filteredCCEmployees, setFilteredCCEmployees] = useState<any[]>([]);
  const [selectedCCIndex, setSelectedCCIndex] = useState(-1);
  
  // BCC field state
  const [showBCCSuggestions, setShowBCCSuggestions] = useState(false);
  const [filteredBCCEmployees, setFilteredBCCEmployees] = useState<any[]>([]);
  const [selectedBCCIndex, setSelectedBCCIndex] = useState(-1);
  
  // Don't manage attachment state when using custom attachment section
  const shouldManageAttachment = showAttachment && !customAttachmentSection;
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState<boolean>(false);
  const isInitialized = useRef(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<(() => void) | null>(null);
  const [isCreateEmailTemplateModalOpen, setIsCreateEmailTemplateModalOpen] = useState(false);
  
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
      date: "",
    },
  });
  
  const { data: dataEmailTemplate, refetch: refetchEmailTemplates } = useGetEmailTemplateItems();

  // Paginated employee data fetching
  const { data: toEmployeeData } = useGetEmployeePaginatedSelect(
    debouncedToSearch && debouncedToSearch.length >= 2 ? {
      search: debouncedToSearch,
      current_page: 1,
      page_size: 500
    } : null
  );
  
  const { data: ccEmployeeData } = useGetEmployeePaginatedSelect(
    debouncedCcSearch && debouncedCcSearch.length >= 2 ? {
      search: debouncedCcSearch,
      current_page: 1,
      page_size: 500
    } : null
  );
  
  const { data: bccEmployeeData } = useGetEmployeePaginatedSelect(
    debouncedBccSearch && debouncedBccSearch.length >= 2 ? {
      search: debouncedBccSearch,
      current_page: 1,
      page_size: 500
    } : null
  );

  // Debouncing effects for each field
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedToSearch(toSearchTerm), 500);
    return () => clearTimeout(timer);
  }, [toSearchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCcSearch(ccSearchTerm), 500);
    return () => clearTimeout(timer);
  }, [ccSearchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedBccSearch(bccSearchTerm), 500);
    return () => clearTimeout(timer);
  }, [bccSearchTerm]);

  // Generic function to scroll selected item into view
  const scrollToSelectedItem = (dropdownRef: React.RefObject<HTMLDivElement>, index: number) => {
    if (dropdownRef.current && index >= 0) {
      const selectedElement = dropdownRef.current.children[index] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
        });
      }
    }
  };

  // Generic function to filter employees using paginated data
  const filterEmployees = useCallback((inputValue: string, selectedTags: string[], setFilteredEmployees: (employees: any[]) => void, setShowSuggestions: (show: boolean) => void, setSelectedIndex: (index: number) => void, employeeData: any) => {
    if (employeeData?.records) {
      if (inputValue.trim()) {
        const searchTerm = inputValue.toLowerCase();
        
        // Filter employees (exclude already selected ones)
        const filtered = employeeData.records.filter((employee: any) => {
          const fullName = `${employee.firstname} ${employee.lastname}`.toLowerCase();
          const email = employee.email?.toLowerCase() || '';
          const department = employee.department?.toLowerCase() || '';
          const position = employee.position?.toLowerCase() || '';
          
          // Check if employee is already selected
          const isAlreadySelected = selectedTags.includes(employee.email);
          
          return !isAlreadySelected && (
            fullName.includes(searchTerm) || 
            email.includes(searchTerm) || 
            department.includes(searchTerm) || 
            position.includes(searchTerm)
          );
        }).slice(0, 5); // Limit to 5 suggestions
        
        // Check if search matches any department name
        const matchingDepartments = new Set();
        employeeData.records.forEach((employee: any) => {
          if (employee.department && employee.department.toLowerCase().includes(searchTerm)) {
            matchingDepartments.add(employee.department);
          }
        });
        
        // Create department options (only show if not all employees from that department are selected)
        const departmentOptions = Array.from(matchingDepartments).map((deptName: any) => {
          // Check if all employees from this department are already selected
          const employeesInDepartment = employeeData.records.filter((emp: any) => 
            emp.department === deptName && emp.email
          );
          const selectedEmployeesInDepartment = employeesInDepartment.filter((emp: any) => 
            selectedTags.includes(emp.email)
          );
          const allEmployeesSelected = employeesInDepartment.length > 0 && 
            selectedEmployeesInDepartment.length === employeesInDepartment.length;
          
          return {
            id: `dept:${deptName}`,
            firstname: null,
            lastname: null,
            email: null,
            department: deptName,
            position: null,
            is_department_option: true,
            label: `${deptName} (All Employees)`,
            allEmployeesSelected: allEmployeesSelected
          };
        }).filter((deptOption: any) => !deptOption.allEmployeesSelected); // Only show departments where not all employees are selected
        
        // Combine department options with filtered employees
        const combinedOptions = [...departmentOptions, ...filtered];
        
        setFilteredEmployees(combinedOptions);
        setShowSuggestions(combinedOptions.length > 0);
        setSelectedIndex(-1); // Reset selection when filtering
      } else {
        // When no search input, show no suggestions
        setFilteredEmployees([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    } else {
      setFilteredEmployees([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, []);

  // Filter employees for TO field
  useEffect(() => {
    filterEmployees(inputTo, tagsTo, setFilteredTOEmployees, setShowTOSuggestions, setSelectedTOIndex, toEmployeeData);
  }, [inputTo, toEmployeeData, tagsTo, filterEmployees]);

  // Filter employees for CC field
  useEffect(() => {
    filterEmployees(inputCc, tagsCc, setFilteredCCEmployees, setShowCCSuggestions, setSelectedCCIndex, ccEmployeeData);
  }, [inputCc, ccEmployeeData, tagsCc, filterEmployees]);

  // Filter employees for BCC field
  useEffect(() => {
    filterEmployees(inputBcc, tagsBcc, setFilteredBCCEmployees, setShowBCCSuggestions, setSelectedBCCIndex, bccEmployeeData);
  }, [inputBcc, bccEmployeeData, tagsBcc, filterEmployees]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target as Node)) {
        setShowTOSuggestions(false);
        setSelectedTOIndex(-1);
      }
      if (ccDropdownRef.current && !ccDropdownRef.current.contains(event.target as Node)) {
        setShowCCSuggestions(false);
        setSelectedCCIndex(-1);
      }
      if (bccDropdownRef.current && !bccDropdownRef.current.contains(event.target as Node)) {
        setShowBCCSuggestions(false);
        setSelectedBCCIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generic function to handle employee selection
  const handleEmployeeSelect = (employee: any, selectedTags: string[], setSelectedTags: (tags: string[]) => void, setInputValue: (value: string) => void, setShowSuggestions: (show: boolean) => void, setSelectedIndex: (index: number) => void, employeeData: any) => {
    if (employee.is_department_option) {
      if (employee.is_remove_option) {
        // Handle department removal - remove all employees from that department
        const employeesInDepartment = employeeData?.records?.filter((emp: any) => 
          emp.department === employee.department && emp.email
        ) || [];
        
        const emailsToRemove = employeesInDepartment.map((emp: any) => emp.email);
        const remainingTags = selectedTags.filter((tag: string) => !emailsToRemove.includes(tag));
        
        setSelectedTags(remainingTags);
      } else {
        // Handle department selection - add all employees from that department
        const employeesInDepartment = employeeData?.records?.filter((emp: any) => 
          emp.department === employee.department && emp.email
        ) || [];
        
        const newEmails = employeesInDepartment
          .map((emp: any) => emp.email)
          .filter((email: string) => !selectedTags.includes(email));
        
        if (newEmails.length > 0) {
          setSelectedTags([...selectedTags, ...newEmails]);
        }
      }
    } else if (employee.email && !selectedTags.includes(employee.email)) {
      // Handle individual employee selection
      setSelectedTags([...selectedTags, employee.email]);
    }
    setInputValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
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
    
    const allTemplates = dataEmailTemplate.map((template: any) => ({
      value: template.id,
      label: template.subject,
      createdAt: template.created_at,
      template: template
    }));
    
    // Filter and sort newly added templates (within 24 hours of creation)
    const newTemplates = allTemplates
      .filter((template: any) => isWithin24Hours(template.createdAt))
      .sort((a: any, b: any) => {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return bDate.getTime() - aDate.getTime(); // Most recent first
      });
    
    // Filter and sort regular templates alphabetically
    const regularTemplates = allTemplates
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
  }, [dataEmailTemplate]);

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
      (shouldManageAttachment && attachmentExist) ||
      (showDateField && formData.date && formData.date !== '')
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
    setValue('date', '');
    setTagsTo(defaultRecipients);
    setTagsCc([]);
    setTagsBcc([]);
    setInputTo('');
    setInputCc('');
    setInputBcc('');
    setCustomSubject('');
    setIsCCOpen(false);
    setIsBCCOpen(false);
    setToSearchTerm('');
    setCcSearchTerm('');
    setBccSearchTerm('');
    setDebouncedToSearch('');
    setDebouncedCcSearch('');
    setDebouncedBccSearch('');
    setShowTOSuggestions(false);
    setShowCCSuggestions(false);
    setShowBCCSuggestions(false);
    setSelectedTOIndex(-1);
    setSelectedCCIndex(-1);
    setSelectedBCCIndex(-1);
    setShowTooltip(true);
    if (shouldManageAttachment) {
      setAttachment(null);
      setAttachmentExist(false);
    }
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

  useEffect(() => {
    if (isOpen && !isInitialized.current) {
      setTagsTo(defaultRecipients);
      isInitialized.current = true;
    } else if (!isOpen) {
      // Reset the initialization flag when modal closes
      isInitialized.current = false;
    }
  }, [isOpen, defaultRecipients]);

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

  // Clear errors when date changes
  useEffect(() => {
    const dateValue = watch('date');
    if (dateValue && dateValue !== '') {
      clearErrors('date');
    }
  }, [watch('date'), clearErrors]);

  const handleClose = () => {
    handleModalClose(() => {
      resetFormData();
      onClose();
    });
  };

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Don't handle attachment upload if using custom attachment section
    if (!shouldManageAttachment) {
      return;
    }
    
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.custom(() => <CustomToast message='File size must be less than 5MB.' type='error' />, { duration: 2000 });
        return;
      }
      setAttachment(file);
      setAttachmentExist(true);
    }
  };

  const handleAddEmailTemplate = () => {
    setIsCreateEmailTemplateModalOpen(true);
  };

  const handleEmailTemplateCreated = () => {
    // Refresh email templates list to get the updated data with new creation dates
    refetchEmailTemplates();
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

    // Validate date if required
    if (showDateField && dateFieldRequired && (!data.date || data.date === '')) {
      setError('date', {
        type: 'manual',
        message: `${dateFieldLabel} is required`
      });
      toast.custom(() => <CustomToast message='You cannot proceed due to incomplete fields. Please review.' type='error' />, { duration: 2000 });
      return;
    }

    const template = data.template ? dataEmailTemplate.find(
      (item: any) => item.id === parseInt(data.template)
    ) : null;
    
    const formData = {
      email: tagsTo,
      cc: tagsCc,
      bcc: tagsBcc,
      subject: showSubject ? (customSubject || (template?.subject || '')) : '',
      template: template?.subject || '',
      message: data.message,
      ...(showDateField && { date: data.date }),
      ...(showAttachment && { attachment: attachment }),
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
            {/* Create Email Template Modal */}
            {isCreateEmailTemplateModalOpen && (
              <CreateEmailTemplateModal
                isOpen={isCreateEmailTemplateModalOpen}
                setIsOpen={setIsCreateEmailTemplateModalOpen}
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
                          } else {
                            // Clear template-related fields if no template is selected
                            setTagsTo(defaultRecipients);
                            setTagsCc([]);
                            setTagsBcc([]);
                            setValue("message", "");
                            setValue("subject", "");
                            setCustomSubject("");
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
            
            {/* Conditional Date Field */}
            {showDateField && (
              <div className="sm:col-span-4 mt-4">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {dateFieldLabel}{dateFieldRequired && <span className="text-red-600">*</span>}
                </label>
                {errors.date && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.date.message || `${dateFieldLabel} is required`}
                  </p>
                )}
                <div className="mt-2">
                  <Controller
                    control={control}
                    name="date"
                    rules={dateFieldRequired ? { required: `${dateFieldLabel} is required` } : {}}
                    render={({ field }) => (
                      <CustomDatePicker
                        id="send-email-datepicker"
                        placeholder="mm/dd/yyyy"
                        className="block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
                        selected={field.value}
                        pickerOnChange={(date: any) => {
                          field.onChange(date);
                          if (date) {
                            clearErrors('date');
                          }
                        }}
                        inputOnChange={(value: any) => {
                          field.onChange(value);
                          if (value) {
                            clearErrors('date');
                          }
                        }}
                        required={dateFieldRequired}
                      />
                    )}
                  />
                </div>
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
                {tagsTo.length > 0 && (
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
                    showSuggestions={showTOSuggestions}
                    filteredEmployees={filteredTOEmployees}
                    selectedIndex={selectedTOIndex}
                    dropdownRef={toDropdownRef}
                    showTooltip={showTooltip}
                    tooltipId="to-section-tooltip"
                    onInputChange={(value) => {
                      setInputTo(value);
                      setToSearchTerm(value);
                      setSelectedTOIndex(-1);
                      setShowTooltip(false);
                    }}
                    onInputFocus={() => {
                      setShowTOSuggestions(inputTo.trim().length > 0);
                      setShowTooltip(false);
                    }}
                    onInputBlur={() => {
                      if (!inputTo.trim()) {
                        setShowTooltip(true);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (showTOSuggestions && filteredTOEmployees.length > 0) {
                          const newIndex = selectedTOIndex < filteredTOEmployees.length - 1 ? selectedTOIndex + 1 : selectedTOIndex;
                          setSelectedTOIndex(newIndex);
                          scrollToSelectedItem(toDropdownRef, newIndex);
                        }
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const newIndex = selectedTOIndex > 0 ? selectedTOIndex - 1 : -1;
                        setSelectedTOIndex(newIndex);
                        if (newIndex >= 0) {
                          scrollToSelectedItem(toDropdownRef, newIndex);
                        }
                      } else if (e.key === 'Enter' || e.key === 'Tab') {
                        e.preventDefault();
                        if (selectedTOIndex >= 0 && filteredTOEmployees[selectedTOIndex]) {
                          handleEmployeeSelect(filteredTOEmployees[selectedTOIndex], tagsTo, setTagsTo, setInputTo, setShowTOSuggestions, setSelectedTOIndex, toEmployeeData);
                        } else {
                          handleKeyDownTo(e);
                        }
                      } else if (e.key === 'Escape') {
                        e.preventDefault();
                        setShowTOSuggestions(false);
                        setSelectedTOIndex(-1);
                      } else {
                        handleKeyDownTo(e);
                      }
                    }}
                    onEmployeeSelect={(employee) => handleEmployeeSelect(employee, tagsTo, setTagsTo, setInputTo, setShowTOSuggestions, setSelectedTOIndex, toEmployeeData)}
                    onMouseEnter={(index) => setSelectedTOIndex(index)}
                    onRemoveTag={handleRemoveTagTo}
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
                  {tagsCc.length > 0 && (
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
                    showSuggestions={showCCSuggestions}
                    filteredEmployees={filteredCCEmployees}
                    selectedIndex={selectedCCIndex}
                    dropdownRef={ccDropdownRef}
                    showTooltip={showTooltip}
                    tooltipId="cc-section-tooltip"
                    onInputChange={(value) => {
                      setInputCc(value);
                      setCcSearchTerm(value);
                      setSelectedCCIndex(-1);
                    }}
                    onInputFocus={() => {
                      setShowCCSuggestions(inputCc.trim().length > 0);
                      setShowTooltip(false);
                    }}
                    onInputBlur={() => {
                      if (!inputCc.trim()) {
                        setShowTooltip(true);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (showCCSuggestions && filteredCCEmployees.length > 0) {
                          const newIndex = selectedCCIndex < filteredCCEmployees.length - 1 ? selectedCCIndex + 1 : selectedCCIndex;
                          setSelectedCCIndex(newIndex);
                          scrollToSelectedItem(ccDropdownRef, newIndex);
                        }
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const newIndex = selectedCCIndex > 0 ? selectedCCIndex - 1 : -1;
                        setSelectedCCIndex(newIndex);
                        if (newIndex >= 0) {
                          scrollToSelectedItem(ccDropdownRef, newIndex);
                        }
                      } else if (e.key === 'Enter' || e.key === 'Tab') {
                        e.preventDefault();
                        if (selectedCCIndex >= 0 && filteredCCEmployees[selectedCCIndex]) {
                          handleEmployeeSelect(filteredCCEmployees[selectedCCIndex], tagsCc, setTagsCc, setInputCc, setShowCCSuggestions, setSelectedCCIndex, ccEmployeeData);
                        } else {
                          handleKeyDown(e);
                        }
                      } else if (e.key === 'Escape') {
                        e.preventDefault();
                        setShowCCSuggestions(false);
                        setSelectedCCIndex(-1);
                      } else {
                        handleKeyDown(e);
                      }
                    }}
                    onEmployeeSelect={(employee) => handleEmployeeSelect(employee, tagsCc, setTagsCc, setInputCc, setShowCCSuggestions, setSelectedCCIndex, ccEmployeeData)}
                    onMouseEnter={(index) => setSelectedCCIndex(index)}
                    onRemoveTag={handleRemoveTag}
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
                  {tagsBcc.length > 0 && (
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
                    showSuggestions={showBCCSuggestions}
                    filteredEmployees={filteredBCCEmployees}
                    selectedIndex={selectedBCCIndex}
                    dropdownRef={bccDropdownRef}
                    showTooltip={showTooltip}
                    tooltipId="bcc-section-tooltip"
                    onInputChange={(value) => {
                      setInputBcc(value);
                      setBccSearchTerm(value);
                      setSelectedBCCIndex(-1);
                    }}
                    onInputFocus={() => {
                      setShowBCCSuggestions(inputBcc.trim().length > 0);
                      setShowTooltip(false);
                    }}
                    onInputBlur={() => {
                      if (!inputBcc.trim()) {
                        setShowTooltip(true);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (showBCCSuggestions && filteredBCCEmployees.length > 0) {
                          const newIndex = selectedBCCIndex < filteredBCCEmployees.length - 1 ? selectedBCCIndex + 1 : selectedBCCIndex;
                          setSelectedBCCIndex(newIndex);
                          scrollToSelectedItem(bccDropdownRef, newIndex);
                        }
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const newIndex = selectedBCCIndex > 0 ? selectedBCCIndex - 1 : -1;
                        setSelectedBCCIndex(newIndex);
                        if (newIndex >= 0) {
                          scrollToSelectedItem(bccDropdownRef, newIndex);
                        }
                      } else if (e.key === 'Enter' || e.key === 'Tab') {
                        e.preventDefault();
                        if (selectedBCCIndex >= 0 && filteredBCCEmployees[selectedBCCIndex]) {
                          handleEmployeeSelect(filteredBCCEmployees[selectedBCCIndex], tagsBcc, setTagsBcc, setInputBcc, setShowBCCSuggestions, setSelectedBCCIndex, bccEmployeeData);
                        } else {
                          handleKeyDownBcc(e);
                        }
                      } else if (e.key === 'Escape') {
                        e.preventDefault();
                        setShowBCCSuggestions(false);
                        setSelectedBCCIndex(-1);
                      } else {
                        handleKeyDownBcc(e);
                      }
                    }}
                    onEmployeeSelect={(employee) => handleEmployeeSelect(employee, tagsBcc, setTagsBcc, setInputBcc, setShowBCCSuggestions, setSelectedBCCIndex, bccEmployeeData)}
                    onMouseEnter={(index) => setSelectedBCCIndex(index)}
                    onRemoveTag={handleRemoveTagBcc}
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
            
            {/* Conditional Attachment section */}
            {showAttachment && (
              <div className='sm:col-span-4 mt-4'>
                {customAttachmentSection ? (
                  customAttachmentSection
                ) : (
                  <>
                    <label htmlFor='attachment' className='block text-sm font-medium leading-6 text-gray-900'>
                      Attachment
                    </label>
                    <div className='mt-2'>
                      {/* File upload for new attachment */}
                      <input
                        id='attachment'
                        type='file'
                        onChange={handleAttachmentUpload}
                        className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100'
                      />
                      {attachmentExist ? (
                        <button
                          type='button'
                          className='underline text-savoy-blue text-sm mt-1'
                          onClick={() => {
                            setAttachment(null);
                            setAttachmentExist(false);
                          }}
                        >
                          Remove Attachment
                        </button>
                      ) : null}
                    </div>
                    <p className='text-xs mt-1 text-gray-400'>Maximum file size: 5MB.</p>
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
                  
                  let dateValid = true;
                  // Check date validation if required
                  if (showDateField && dateFieldRequired) {
                    dateValid = await trigger('date');
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
                  if (!subjectValid || !messageValid || !dateValid || tagsTo.length === 0) {
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
    </>
  );
}
