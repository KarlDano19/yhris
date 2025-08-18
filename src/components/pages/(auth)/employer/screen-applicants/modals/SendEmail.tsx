import { useContext, useEffect, useMemo, useRef, useState } from "react";

import dynamic from "next/dynamic";

import { useForm } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import { initialActionState } from "../lib/initialActionState";
import useGetEmailTemplateItems from "@/components/hooks/useGetEmailTemplateItems";
import useTagTo from "@/components/hooks/useTagTo";
import useTagCc from "@/components/hooks/useTagCc";
import useTagBcc from "@/components/hooks/useTagBcc";
import ModalLayout from "./ModalLayout";
import ModalFooterLayout from "../layouts/ModalFooterLayout";
import StateContext from "../contexts/StateContext";

import { XMarkIcon } from "@heroicons/react/24/outline";
import SelectChevronDown from "@/svg/SelectChevronDownDummy";

import { QUILL_FORMATS, QUILL_MODULES } from "@/helpers/constants";
import { ContextTypes, SendEmailPropTypes as PropTypes } from "../types";

import "react-quill/dist/quill.snow.css";

// Helper function to check if HTML content is empty
const isHtmlEmpty = (html: string | null | undefined): boolean => {
  if (!html) return true;
  const trimmed = html.trim();
  return trimmed === '' || trimmed === '<p><br></p>' || trimmed === '<p></p>';
};

export default function SendEmail({ title, handleFormSubmit }: PropTypes) {
  const [isOpen, setIsOpen] = useState(false);
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    [isOpen]
  );
  const { actionState, setActionState }: ContextTypes = useContext(
    StateContext
  ) as ContextTypes;
  const [isCCOpen, setIsCCOPen] = useState(false);
  const [isBCCOpen, setIsBCCOpen] = useState(false);
  const [inputTo, setInputTo] = useState("");
  const [inputCc, setInputCc] = useState("");
  const [inputBcc, setInputBcc] = useState("");
  const [customSubject, setCustomSubject] = useState("");
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
  const { register, handleSubmit, setValue, watch, trigger, formState: { errors }, setError, clearErrors } = useForm({
    defaultValues: {
      bcc: "",
      cc: "",
      email: "",
      template: "",
      subject: "",
      message: "",
    },
  });
  const { data: dataEmailTemplate } = useGetEmailTemplateItems();

  useEffect(() => {
    setIsOpen(true);
    setTagsTo([actionState.email]);
  }, []);

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
    setIsOpen(false);
    setTimeout(() => setActionState(initialActionState), 400);
  };

  const handleOnSubmit = (data: any) => {
    // Validate "To" field manually since it uses tags
    if (tagsTo.length === 0) {
      setError('email', {
        type: 'manual',
        message: 'At least one recipient is required'
      });
      toast.custom(() => <CustomToast message='You cannot proceed due to incomplete fields. Please review.' type='error' />, { duration: 2000 });
      return;
    }

    // Validate subject
    if (!data.subject && !customSubject) {
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
    
    data.email = tagsTo;
    data.cc = tagsCc;
    data.bcc = tagsBcc;
    data.subject = customSubject || (template?.subject || '');
    data.template = template?.subject || '';
    handleFormSubmit(data, setIsOpen);
  };

  return (
    <ModalLayout title={title} isOpen={isOpen} handleClose={handleClose}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <div className="px-4 pt-4 pb-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="template"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email Template
            </label>
            <div className="relative mt-2">
              <select
                {...register("template")}
                id="template"
                className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                onChange={(event) => {
                  const templateId = parseInt(event.target.value);
                  if (templateId) {
                    const template = dataEmailTemplate.find(
                      (item: any) => item.id === templateId
                    );
                    if (template) {
                      if (actionState.email) {
                        // Check if template.to already contains the applicant email to avoid duplicates
                        const templateRecipients = template.to || [];
                        if (!templateRecipients.includes(actionState.email)) {
                          // Only add applicantEmail if it's not already in the template recipients
                          setTagsTo([actionState.email, ...templateRecipients]);
                        } else {
                          // Use template recipients as is since it already includes the applicant email
                          setTagsTo(templateRecipients);
                        }
                      } else {
                        setTagsTo(template.to || []);
                      }
                      if (template.bcc) {
                        setIsBCCOpen(true);
                        setTagsBcc(template.bcc);
                      } else {
                        setTagsBcc([]);
                      }
                      if (template.cc) {
                        setIsCCOPen(true);
                        setTagsCc(template.cc);
                      } else {
                        setTagsCc([]);
                      }
                      setValue("message", template.body);
                      setValue("subject", template.subject);
                      setCustomSubject(template.subject);
                      clearErrors('subject');
                      clearErrors('message');
                    }
                  } else {
                    // Clear template-related fields if no template is selected
                    setTagsTo(actionState.email ? [actionState.email] : []);
                    setTagsCc([]);
                    setTagsBcc([]);
                    setValue("message", "");
                    setValue("subject", "");
                    setCustomSubject("");
                  }
                }}
              >
                <option value="">Select...</option>
                {(dataEmailTemplate || []).map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.subject}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <SelectChevronDown />
              </div>
            </div>
          </div>
          <div className="sm:col-span-4 mt-4 w-full">
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
          <div className="sm:col-span-4 mt-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              To<span className="text-red-600">*</span>
            </label>
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
            <div className="mt-2 flex rounded-md shadow-sm">
              <div className="relative flex flex-grow items-stretch focus-within:z-10">
                <div 
                  className="relative border border-gray-300 pl-2 rounded-none rounded-l-md flex items-center gap-3 flex-wrap w-full"
                  data-tooltip-id='to-section-tooltip'
                  data-tooltip-place='bottom'
                >
                  {tagsTo.map((tagTo: string) => (
                    <div
                      key={tagTo}
                      className="bg-[#ACB9CB] rounded-md flex items-center gap-2 py-0 px-4 text-left justify-start text-sm"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveTagTo(tagTo)}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                      <p>{tagTo}</p>
                    </div>
                  ))}
                  <input
                    type="text"
                    value={inputTo}
                    onKeyDown={handleKeyDownTo}
                    onChange={(e) => setInputTo(e.target.value)}
                    className="focus:none outline-none px-2 py-1 grow"
                  />
                  <Tooltip id='to-section-tooltip' opacity={1} style={{ fontSize: '10px', borderRadius: '10px', backgroundColor: '#222C3B' }}>
                    <div className='px-1'>
                      <h2 className='text-[12px] font-medium'>
                        Add multiple recipients by pressing Tab or Enter.
                      </h2>
                    </div>
                  </Tooltip>
                </div>
              </div>
              <button
                type="button"
                className={`relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 ${
                  isCCOpen
                    ? "bg-savoy-blue text-white hover:bg-blue-700"
                    : "bg-gray-50"
                }`}
                onClick={() => setIsCCOPen(!isCCOpen)}
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
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                CC
              </label>
              <div className="mt-2">
                <div 
                  className="relative border border-gray-300 pl-2 rounded-none rounded-l-md flex items-center gap-3 flex-wrap w-full"
                  data-tooltip-id='cc-section-tooltip'
                  data-tooltip-place='bottom'
                >
                  {tagsCc.map((tag: string) => (
                    <div
                      key={tag}
                      className="bg-[#ACB9CB] rounded-md flex items-center gap-2 py-0 px-4 text-left justify-start text-sm"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                      <p>{tag}</p>
                    </div>
                  ))}
                  <input
                    type="text"
                    value={inputCc}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setInputCc(e.target.value)}
                    className="focus:none outline-none px-2 py-1 grow rounded-md"
                  />
                  <Tooltip id='cc-section-tooltip' opacity={1} style={{ fontSize: '10px', borderRadius: '10px', backgroundColor: '#222C3B' }}>
                    <div className='px-1'>
                      <h2 className='text-[12px] font-medium'>
                        Add multiple recipients by pressing Tab or Enter.
                      </h2>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
          )}
          {isBCCOpen && (
            <div className="sm:col-span-4 mt-4">
              <label
                htmlFor="bcc"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                BCC
              </label>
              <div className="mt-2">
                <div 
                  className="relative border border-gray-300 pl-2 rounded-md flex items-center gap-3 flex-wrap w-full text-sm"
                  data-tooltip-id='bcc-section-tooltip'
                  data-tooltip-place='bottom'
                >
                  {tagsBcc.map((tagBcc: string) => (
                    <div
                      key={tagBcc}
                      className="bg-[#ACB9CB] rounded-md flex items-center gap-2 py-0 px-4 text-left justify-start text-sm"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveTagBcc(tagBcc)}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                      <p>{tagBcc}</p>
                    </div>
                  ))}
                  <input
                    type="text"
                    value={inputBcc}
                    onKeyDown={handleKeyDownBcc}
                    onChange={(e) => setInputBcc(e.target.value)}
                    className="focus:none outline-none px-2 py-1 grow rounded-md"
                  />
                  <Tooltip id='bcc-section-tooltip' opacity={1} style={{ fontSize: '10px', borderRadius: '10px', backgroundColor: '#222C3B' }}>
                    <div className='px-1'>
                      <h2 className='text-[12px] font-medium'>
                        Add multiple recipients by pressing Tab or Enter.
                      </h2>
                    </div>
                  </Tooltip>
                </div>
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
        </div>

        <hr />
        <ModalFooterLayout>
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
            onClick={async (e) => {
              // Trigger validation for all required fields
              const subjectValid = await trigger('subject');
              
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
            Send
          </button>
        </ModalFooterLayout>
      </form>
    </ModalLayout>
  );
}
