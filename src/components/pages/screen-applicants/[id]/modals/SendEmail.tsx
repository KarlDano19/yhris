import SelectChevronDown from "@/svg/SelectChevronDownDummy"
import { useEffect, useMemo, useRef, useState } from "react"
import ModalLayout from "./ModalLayout"
import { SendEmailPropTypes as PropTypes } from "../../types"
import dynamic from "next/dynamic"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { QUILL_FORMATS, QUILL_MODULES } from "./helpers/constants"
import { useForm } from "react-hook-form"
import { initialActionState } from "../../lib/initialActionState"

export default function SendEmail({
  title,
  setActionState,
  handleFormSubmit,
}: PropTypes) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCCOpen, setIsCCOPen] = useState(false)
  const [isBCCOpen, setIsBCCOpen] = useState(false)
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    [isOpen]
  )
  const [value, setValue] = useState("")
  const { register, handleSubmit } = useForm()

  useEffect(() => {
    setIsOpen(true)
  }, [])
  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setActionState(initialActionState), 400)
  }
  const handleOnSubmit = (data: any) => {
    const formData = { ...data, message: value }
    setIsOpen(false)
    // put data
    setTimeout(() => handleFormSubmit(formData), 400)
  }

  return (
    <ModalLayout title={title} isOpen={isOpen} handleClose={handleClose}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <div className="px-4 pt-4 pb-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="template"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email Template<span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <select
                {...register("template", { required: true })}
                id="template"
                className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              >
                <option value="">Select...</option>
                <option>Notice to explain</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <SelectChevronDown />
              </div>
            </div>
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
                <input
                  {...register("email", { required: true })}
                  type="email"
                  id="email"
                  className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
              <button
                type="button"
                className={`relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${
                  isCCOpen && "bg-savoy-blue text-white hover:bg-blue-700"
                }`}
                onClick={() => setIsCCOPen(!isCCOpen)}
              >
                CC
              </button>
              <button
                type="button"
                className={`relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${
                  isBCCOpen && "bg-savoy-blue text-white hover:bg-blue-700"
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
                <input
                  {...register("cc")}
                  id="cc"
                  type="cc"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
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
                <input
                  {...register("bcc")}
                  id="bcc"
                  type="bcc"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
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
            <div className="mt-2 h-72 mb-12">
              {/* <textarea
                {...register("message", { required: true })}
                rows={4}
                id="message"
                hidden
              /> */}
              <ReactQuill
                onChange={(value) => setValue(value)}
                formats={QUILL_FORMATS}
                modules={QUILL_MODULES}
                style={{ height: "100%" }}
                value={value}
              />
            </div>
          </div>
        </div>

        <hr />
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
          >
            Send
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </form>
    </ModalLayout>
  )
}
