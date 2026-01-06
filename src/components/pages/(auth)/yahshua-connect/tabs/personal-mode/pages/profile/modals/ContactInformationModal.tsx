import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import Modal from '../../../../../components/Modal';

import { T_BasicInfo } from '@/types/personal-mode';

interface ContactInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  basicInfo: T_BasicInfo;
  onSave: (data: T_BasicInfo) => void;
}

const ContactInformationModal = ({ isOpen, onClose, basicInfo, onSave }: ContactInformationModalProps) => {
  const { register, handleSubmit, reset } = useForm<T_BasicInfo>({
    defaultValues: basicInfo,
  });

  // Update form data when basicInfo changes
  useEffect(() => {
    if (isOpen) {
      reset({
        ...basicInfo,
        contactPersonAge: basicInfo.contactPersonAge || undefined,
      });
    }
  }, [basicInfo, isOpen, reset]);

  const onSubmit = (data: T_BasicInfo) => {
    onSave(data);
  };

  const footerContent = (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2.5 border-2 border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="contact-info-form"
        className="px-6 py-2.5 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors"
      >
        Save Changes
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Contact Information"
      size="5xl"
      footerContent={footerContent}
    >
      <form id="contact-info-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">
          {/* Row 1: Email, Mobile, Landline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register('email')}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile No.<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register('phone', { required: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Landline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Landline No.
              </label>
              <input
                type="tel"
                {...register('landline')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Contact Person Section */}
          <div className="pt-6 border-t border-gray-200">
            <h6 className="text-sm font-semibold text-gray-900 mb-5">
              Contact Person
            </h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Contact Person Name */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('contactPersonName', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Contact Person Address */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('contactPersonAddress', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              {/* Contact Person Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register('contactPersonAge', { required: true, valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* Contact Person Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register('contactPersonMobile', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Contact Person Relationship */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('contactPersonRelationship', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ContactInformationModal;

