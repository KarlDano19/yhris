import { useContext, useEffect, useMemo, useRef, useState } from "react";

import dynamic from "next/dynamic";

import { useForm } from "react-hook-form";

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
  const { register, handleSubmit, setValue, watch } = useForm({
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

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setActionState(initialActionState), 400);
  };

  const handleOnSubmit = (data: any) => {
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
                        setTagsTo([actionState.email, ...template.to]);
                      } else {
                        setTagsTo(template.to);
                      }
                      if (template.bcc) {
                        setIsBCCOpen(true);
                        setTagsBcc(template.bcc);
                      }
                      if (template.cc) {
                        setIsCCOPen(true);
                        setTagsCc(template.cc);
                      }
                      setValue("message", template.body);
                      setValue("subject", template.subject);
                    }
                  } else {
                    // Clear template-related fields if no template is selected
                    setTagsTo(actionState.email ? [actionState.email] : []);
                    setTagsCc([]);
                    setTagsBcc([]);
                    setValue("message", "");
                    setValue("subject", "");
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
            <input
              id="subject"
              type="text"
              {...register("subject")}
              onChange={(e) => setCustomSubject(e.target.value)}
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
            <div className="mt-2 flex rounded-md shadow-sm">
              <div className="relative flex flex-grow items-stretch focus-within:z-10">
                <div className="relative border border-gray-300 pl-2 rounded-none rounded-l-md flex items-center gap-3 flex-wrap w-full">
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
                    onChange={(e) => setInputTo(e.target.value)} // Add this line to update input state
                    className="focus:none outline-none px-2 py-1 grow"
                  />
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
                <div className="relative border border-gray-300 pl-2 rounded-none rounded-l-md flex items-center gap-3 flex-wrap w-full">
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
                    onChange={(e) => setInputCc(e.target.value)} // Add this line to update input state
                    className="focus:none outline-none px-2 py-1 grow rounded-md"
                  />
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
                <div className="relative border border-gray-300 pl-2 rounded-md flex items-center gap-3 flex-wrap w-full text-sm">
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
                    onChange={(e) => setInputBcc(e.target.value)} // Add this line to update input state
                    className="focus:none outline-none px-2 py-1 grow rounded-md"
                  />
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
            <div className="mt-2 h-72 mb-12">
              <textarea
                {...register("message", { required: true })}
                rows={4}
                id="message"
                hidden
              />
              <ReactQuill
                onChange={(value) => setValue("message", value)}
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
          >
            Send
          </button>
        </ModalFooterLayout>
      </form>
    </ModalLayout>
  );
}
