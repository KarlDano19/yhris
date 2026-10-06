'use client';

import { useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import ModalLayout from '@/components/ModalLayout';
import CustomToast from '@/components/CustomToast';
import ReactQuillDynamic from '@/components/ReactQuillDynamic';
import { ENHANCED_QUILL_MODULES, ENHANCED_QUILL_FORMATS } from '../../../dole/safety-and-health-policy/modals/helper/CustomQuill';

import { useCreatePolicySection } from '../hooks/useCreatePolicySection';
import { useUpdatePolicySection } from '../hooks/useUpdatePolicySection';

import { PolicyHandbookSectionCategory, PolicyHandbookSectionData, PolicyHandbookSectionFormData } from '@/types/policyHandbook';

// Starting scaffold for brand-new sections - keeps manually-written sections structurally
// consistent with the AI-synced ones (Simple Version / How It Works / Current Setup), without
// pre-filling any actual content for the HR admin to write themselves.
const SECTION_BODY_SCAFFOLD =
  '<h2>Simple Version</h2><p><br></p><h2>How It Works</h2><p><br></p><h2>Current Setup</h2><p><br></p>';

// react-quill-new's HTML import/export silently turns every plain space in the loaded HTML into
// a non-breaking space (&nbsp;) on save - including in paragraphs the user never touched, since
// this content was originally authored outside Quill (AI-generated or fallback HTML, not typed in
// Quill to begin with). Left alone, every edit accumulates more &nbsp; throughout the whole
// section. Undo it right before submitting so only an intentional edit changes the content.
const normalizeQuillWhitespace = (html: string): string => html.replace(/&nbsp;| /g, ' ');

const CATEGORY_OPTIONS: { value: PolicyHandbookSectionCategory; label: string }[] = [
  { value: 'pay_schedule', label: 'Pay Schedule' },
  { value: 'rate_calculation', label: 'Rate Calculation' },
  { value: 'overtime_rules', label: 'Premium & Overtime Rules' },
  { value: 'night_differential', label: 'Night Differential' },
  { value: 'timekeeping', label: 'Timekeeping Rules' },
  { value: 'geotagging_geofencing', label: 'Geotagging & Geofencing' },
  { value: 'government_contributions', label: 'Government Contributions' },
  { value: 'tax_settings', label: 'Withholding Tax' },
  { value: 'de_minimis_benefits', label: 'De Minimis Benefits' },
  { value: 'thirteenth_month_pay', label: '13th Month Pay' },
  { value: 'payslip_components', label: 'Payslip Components' },
  { value: 'custom', label: 'Custom Formulas' },
  { value: 'approval_workflow', label: 'Approval Workflows' },
  { value: 'roles_permissions', label: 'Roles & Permissions' },
  { value: 'employee_id_format', label: 'Employee ID Format' },
  { value: 'onboarding_checklist', label: 'Onboarding Checklist' },
  { value: 'company_directives', label: 'Create Memo/Policy' },
  { value: 'designed_benefits', label: 'Designed Benefits' },
  { value: 'safety_health_policy', label: 'Safety & Health Policy' },
  { value: 'evaluation_templates', label: 'Evaluation Templates' },
  { value: 'company_surveys', label: 'Surveys & Forms' },
  { value: 'org_structure', label: 'Org Structure' },
  { value: 'job_posting', label: 'Post a Job' },
  { value: 'screen_applicant', label: 'Screen Applicants' },
  { value: 'offboarding', label: 'Offboarding' },
  { value: 'employee_201', label: 'Employee 201' },
  { value: 'employee_list', label: 'Employee List' },
  { value: 'dole_ec_logbook', label: 'Employee Compensation Logbook' },
  { value: 'dole_work_accident_illness', label: 'Work Accident/Illness Report' },
  { value: 'dole_work_environment', label: 'Work Environment Measurement' },
  { value: 'dole_awair', label: 'Annual WAIR Data Report' },
  { value: 'dole_health_safety_org', label: 'Health & Safety Org Report' },
  { value: 'dole_shc_minutes', label: 'SHC Minutes of Meetings' },
  { value: 'dole_annual_medical', label: 'Annual Medical Report' },
];

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  section?: PolicyHandbookSectionData | null;
}

const SectionModal = ({ isOpen, handleClose, section }: Props) => {
  const isEditMode = Boolean(section);

  const formMethods = useForm<PolicyHandbookSectionFormData>({
    defaultValues: { category: '', title: '', description: '', body: '' },
  });
  const { control, register, handleSubmit, reset, formState: { errors } } = formMethods;

  const { mutate: createSection, isLoading: isCreating } = useCreatePolicySection();
  const { mutate: updateSection, isLoading: isUpdating } = useUpdatePolicySection();
  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      reset({
        category: section?.category ?? '',
        title: section?.title ?? '',
        description: section?.description ?? '',
        body: section?.body ?? SECTION_BODY_SCAFFOLD,
      });
    }
  }, [isOpen, section, reset]);

  const onSuccess = () => {
    toast.custom(() => <CustomToast message={isEditMode ? 'Section updated successfully.' : 'Section added successfully.'} type='success' />);
    handleClose();
  };

  const onError = (error: Error) => {
    toast.custom(() => <CustomToast message={error.message} type='error' />);
  };

  const onSubmit = handleSubmit((data) => {
    const sanitizedData = { ...data, body: normalizeQuillWhitespace(data.body) };
    if (isEditMode && section) {
      updateSection({ sectionId: section.id, data: sanitizedData }, { onSuccess, onError });
    } else {
      createSection(sanitizedData, { onSuccess, onError });
    }
  });

  return (
    <ModalLayout isOpen={isOpen} handleClose={handleClose} title={isEditMode ? 'Edit Section' : 'Add Section'}>
      <form onSubmit={onSubmit} className='p-6 flex flex-col gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
          <select
            {...register('category', { required: 'Category is required' })}
            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-savoy-blue'
          >
            <option value=''>Select a category</option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.category && <span className='text-red-500 text-xs'>{errors.category.message}</span>}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
          <input
            type='text'
            {...register('title', { required: 'Title is required' })}
            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-savoy-blue'
            placeholder='e.g. Overtime Policy'
          />
          {errors.title && <span className='text-red-500 text-xs'>{errors.title.message}</span>}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Short Description</label>
          <input
            type='text'
            {...register('description')}
            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-savoy-blue'
            placeholder='e.g. When each pay period starts, ends, and when your people get paid.'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Content</label>
          <Controller
            control={control}
            name='body'
            render={({ field }) => (
              <ReactQuillDynamic
                theme='snow'
                value={field.value}
                onChange={field.onChange}
                modules={ENHANCED_QUILL_MODULES}
                formats={ENHANCED_QUILL_FORMATS}
              />
            )}
          />
        </div>

        <div className='flex justify-end gap-3 pt-4 pb-2'>
          <button
            type='button'
            onClick={handleClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isSaving}
            className='px-4 py-2 text-sm font-medium text-white bg-savoy-blue rounded-md hover:opacity-90 disabled:opacity-50'
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};

export default SectionModal;
