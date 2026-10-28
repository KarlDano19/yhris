'use client';

import { useState, useRef, createRef } from 'react';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import SignatureCanvas from 'react-signature-canvas';

import CustomToast from '@/components/CustomToast';
import { T_KickoffAcknowledgementPayload, T_KickoffAcknowledgementResponse, T_KickoffPortalData, T_KickoffSignatory } from '@/types/kickoff';
import { PlusIcon } from '@heroicons/react/24/outline';
import MainLogo from '@/svg/MainLogo';

import { useSubmitKickoffAcknowledgement } from './hooks/useSubmitKickoffAcknowledgement';

interface AcknowledgementFormProps {
  token: string;
  portalData: T_KickoffPortalData;
  onSuccess: (res: T_KickoffAcknowledgementResponse) => void;
}

interface SignatoryRow {
  id: number;
  contact_person: string;
  date_signed: string;
  signatureRef: React.RefObject<SignatureCanvas | null>;
}

// Capture a SignatureCanvas as a PNG data URL (with a fallback to the raw canvas element).
function captureSignature(ref: SignatureCanvas | null): string {
  if (!ref) return '';
  try {
    return ref.getCanvas().toDataURL('image/png');
  } catch {
    const canvas = (ref as any)._canvas as HTMLCanvasElement | undefined;
    return canvas ? canvas.toDataURL('image/png') : '';
  }
}

export default function AcknowledgementForm({ token, portalData, onSuccess }: AcknowledgementFormProps) {
  const primarySignatureRef = useRef<SignatureCanvas | null>(null);
  const [signatureError, setSignatureError] = useState('');
  const [additionalSignatories, setAdditionalSignatories] = useState<SignatoryRow[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const submitMutation = useSubmitKickoffAcknowledgement(token);

  const formMethods = useForm<{
    contact_person: string;
    contact_email: string;
    date_signed: string;
  }>({
    defaultValues: {
      contact_person: portalData.contact_person || '',
      contact_email: portalData.contact_email || '',
      date_signed: new Date().toISOString().split('T')[0],
    },
  });

  const { register, handleSubmit, formState: { errors } } = formMethods;

  const handleAddSignatory = () => {
    setAdditionalSignatories(prev => [
      ...prev,
      {
        id: Date.now(),
        contact_person: '',
        date_signed: new Date().toISOString().split('T')[0],
        signatureRef: createRef<SignatureCanvas>(),
      },
    ]);
  };

  const handleRemoveSignatory = (id: number) => {
    setAdditionalSignatories(prev => prev.filter(s => s.id !== id));
  };

  const handleSignatoryChange = (id: number, field: 'contact_person' | 'date_signed', value: string) => {
    setAdditionalSignatories(prev => prev.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const onSubmit = handleSubmit(async (data) => {
    setSignatureError('');

    if (!agreedToTerms) {
      toast.custom(<CustomToast message="Please agree to the terms before submitting." type="error" />);
      return;
    }

    if (!primarySignatureRef.current || primarySignatureRef.current.isEmpty()) {
      setSignatureError('Signature is required.');
      return;
    }

    const signatureData = captureSignature(primarySignatureRef.current);
    if (!signatureData) {
      setSignatureError('Could not capture signature. Please try again.');
      return;
    }

    // Collect any additional signatories: drop fully-empty rows, but block on partially-filled ones.
    const signatories: T_KickoffSignatory[] = [];
    for (let i = 0; i < additionalSignatories.length; i++) {
      const row = additionalSignatories[i];
      const hasName = row.contact_person.trim() !== '';
      const ref = row.signatureRef.current;
      const hasSignature = !!ref && !ref.isEmpty();

      if (!hasName && !hasSignature) continue; // untouched row — ignore it

      if (!hasName || !hasSignature) {
        toast.custom(<CustomToast message={`Signatory ${i + 2}: please provide both a name and a signature, or remove the row.`} type="error" />);
        return;
      }

      const sig = captureSignature(ref);
      if (!sig) {
        toast.custom(<CustomToast message={`Could not capture the signature for signatory ${i + 2}. Please try again.`} type="error" />);
        return;
      }

      signatories.push({
        contact_person: row.contact_person.trim(),
        signature_data: sig,
        date_signed: row.date_signed || undefined,
      });
    }

    const payload: T_KickoffAcknowledgementPayload = {
      company_name: portalData.company_name,
      contact_person: data.contact_person,
      contact_email: data.contact_email,
      signature_data: signatureData,
      date_signed: data.date_signed || undefined,
      agreed_to_terms: true,
      ...(signatories.length > 0 ? { signatories } : {}),
    };

    submitMutation.mutate(payload, {
      onSuccess: (res) => {
        toast.custom(<CustomToast message="Kick-off acknowledgement submitted successfully!" type="success" />);
        onSuccess(res);
      },
      onError: (err) => {
        toast.custom(<CustomToast message={err.message || 'Submission failed. Please try again.'} type="error" />);
      },
    });
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 print:shadow-none print:border-none print:p-0">
      {/* Document Header */}
      <div className="flex justify-between items-start mb-8 print:mb-6">
        <MainLogo />
      </div>

      {/* Form Title */}
      <div className="text-center mb-8 print:mb-6">
        <p className="font-semibold text-gray-800">Annex A</p>
        <p className="font-semibold text-gray-800">YAHSHUA HRIS</p>
        <p className="font-semibold text-gray-800">Kick-Off Acknowledgement Form</p>
      </div>

      {/* Body Text */}
      <p className="text-sm text-gray-700 mb-8 leading-relaxed print:mb-6">
        This is to formally acknowledge that{' '}
        <span className="text-[#2c3f58] font-semibold underline underline-offset-2">
          {portalData.company_name}
        </span>{' '}
        has received and further confirms that the Kick-Off video has been watched in full and
        that the project overview, terms and conditions, and most especially the responsibilities
        necessary for the successful implementation of the project are fully understood.{' '}
        <span className="text-[#2c3f58] font-semibold underline underline-offset-2">{portalData.company_name.toUpperCase()}</span> commits
        to fulfilling these responsibilities accordingly.
      </p>

      {/* Acknowledgement Form Table */}
      <form onSubmit={onSubmit}>
        <div className="border border-gray-300 rounded-sm">
          {/* Primary Signatory */}
          <div className="divide-y divide-gray-300">
            {/* Full Name Row */}
            <div className="flex">
              <div className="w-5/12 p-4 bg-gray-50 border-r border-gray-300 flex items-center">
                <span className="text-sm font-medium text-gray-700">
                  Complete Name of Designated Authorized Personnel
                </span>
              </div>
              <div className="flex-1 p-4 flex items-center">
                <input
                  {...register('contact_person', { required: 'Full name is required.' })}
                  type="text"
                  placeholder="Full Name"
                  className="w-full border-b border-gray-400 bg-transparent text-sm text-gray-800 focus:outline-none focus:border-[#2c3f58] pb-1 placeholder-gray-400"
                />
                {errors.contact_person && (
                  <p className="text-xs text-red-500 mt-1">{errors.contact_person.message}</p>
                )}
              </div>
            </div>

            {/* Signature Row */}
            <div className="flex">
              <div className="w-5/12 p-4 bg-gray-50 border-r border-gray-300 flex items-center">
                <span className="text-sm font-medium text-gray-700">Signature</span>
              </div>
              <div className="flex-1 p-4">
                <div className="relative border border-dashed border-gray-400 rounded-sm h-28 print:hidden">
                  <SignatureCanvas
                    ref={primarySignatureRef}
                    canvasProps={{ className: 'w-full h-full' }}
                    backgroundColor="rgba(0,0,0,0)"
                    minWidth={1}
                    maxWidth={2}
                    onBegin={() => setSignatureError('')}
                  />
                  <button
                    type="button"
                    onClick={() => primarySignatureRef.current?.clear()}
                    className="absolute top-2 right-2 text-xs text-[#2c3f58] underline hover:opacity-70"
                  >
                    Clear
                  </button>
                </div>
                {signatureError && (
                  <p className="text-xs text-red-500 mt-1">{signatureError}</p>
                )}
              </div>
            </div>

            {/* Date Signed Row */}
            <div className="flex">
              <div className="w-5/12 p-4 bg-gray-50 border-r border-gray-300 flex items-center">
                <span className="text-sm font-medium text-gray-700">Date Signed</span>
              </div>
              <div className="flex-1 p-4 flex items-center">
                <input
                  {...register('date_signed')}
                  type="date"
                  className="border-b border-gray-400 bg-transparent text-sm text-gray-800 focus:outline-none focus:border-[#2c3f58]"
                />
              </div>
            </div>
          </div>

          {/* Additional Signatories */}
          {additionalSignatories.map((signatory, index) => (
            <AdditionalSignatoryRow
              key={signatory.id}
              index={index}
              signatory={signatory}
              onChange={(field, value) => handleSignatoryChange(signatory.id, field, value)}
              onRemove={() => handleRemoveSignatory(signatory.id)}
            />
          ))}
        </div>

        {/* Add Signatory */}
        <button
          type="button"
          onClick={handleAddSignatory}
          className="mt-3 flex items-center gap-1 text-sm text-[#2c3f58] hover:opacity-70 print:hidden"
        >
          <PlusIcon className="w-4 h-4" />
          Add signatory
        </button>

        {/* Terms Checkbox */}
        <div className="mt-6 flex items-start gap-3 print:hidden">
          <input
            id="agreed_to_terms"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#2c3f58] focus:ring-[#2c3f58] cursor-pointer"
          />
          <label htmlFor="agreed_to_terms" className="text-sm text-gray-600 cursor-pointer">
            I confirm that I have watched the kick-off video in full, reviewed the project overview,
            and understood the terms, conditions, and responsibilities for the successful implementation
            of the project.
          </label>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end print:hidden">
          <button
            type="submit"
            disabled={!agreedToTerms || submitMutation.isLoading}
            className="px-6 py-2 bg-[#2c3f58] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitMutation.isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

interface AdditionalSignatoryRowProps {
  index: number;
  signatory: SignatoryRow;
  onChange: (field: 'contact_person' | 'date_signed', value: string) => void;
  onRemove: () => void;
}

function AdditionalSignatoryRow({ index, signatory, onChange, onRemove }: AdditionalSignatoryRowProps) {
  return (
    <div className="border-t border-gray-300 divide-y divide-gray-300">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
        <span className="text-xs text-gray-500 font-medium">Signatory {index + 2}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-red-500 hover:opacity-70 print:hidden"
        >
          Remove
        </button>
      </div>

      {/* Name */}
      <div className="flex">
        <div className="w-5/12 p-4 bg-gray-50 border-r border-gray-300 flex items-center">
          <span className="text-sm font-medium text-gray-700">Complete Name</span>
        </div>
        <div className="flex-1 p-4 flex items-center">
          <input
            type="text"
            placeholder="Full Name"
            value={signatory.contact_person}
            onChange={(e) => onChange('contact_person', e.target.value)}
            className="w-full border-b border-gray-400 bg-transparent text-sm text-gray-800 focus:outline-none focus:border-[#2c3f58] pb-1 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Signature */}
      <div className="flex">
        <div className="w-5/12 p-4 bg-gray-50 border-r border-gray-300 flex items-center">
          <span className="text-sm font-medium text-gray-700">Signature</span>
        </div>
        <div className="flex-1 p-4">
          <div className="relative border border-dashed border-gray-400 rounded-sm h-28 print:hidden">
            <SignatureCanvas
              ref={signatory.signatureRef}
              canvasProps={{ className: 'w-full h-full' }}
              backgroundColor="rgba(0,0,0,0)"
              minWidth={1}
              maxWidth={2}
            />
            <button
              type="button"
              onClick={() => signatory.signatureRef.current?.clear()}
              className="absolute top-2 right-2 text-xs text-[#2c3f58] underline hover:opacity-70"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="flex">
        <div className="w-5/12 p-4 bg-gray-50 border-r border-gray-300 flex items-center">
          <span className="text-sm font-medium text-gray-700">Date Signed</span>
        </div>
        <div className="flex-1 p-4 flex items-center">
          <input
            type="date"
            value={signatory.date_signed}
            onChange={(e) => onChange('date_signed', e.target.value)}
            className="border-b border-gray-400 bg-transparent text-sm text-gray-800 focus:outline-none focus:border-[#2c3f58]"
          />
        </div>
      </div>
    </div>
  );
}
