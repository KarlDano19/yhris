import { XMarkIcon } from "@heroicons/react/24/outline"
import { StageRequirementsTypes as PropTypes } from "../../types"
import { useEffect, useState } from "react"
import ModalLayout from "./ModalLayout"
import useTagInput from "../../hooks/useTagInput"
import { initialActionState } from "../../lib/initialActionState"

export default function StageRequirements({
  title,
  requirements,
  setActionState,
  handleFormSubmit,
}: PropTypes) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const { tags, handleKeyDown, handleRemoveTag } = useTagInput(
    input,
    setInput,
    requirements
  )

  useEffect(() => {
    setIsOpen(true)
  }, [])
  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setActionState(initialActionState), 400)
  }
  const handleOnSubmit = (e: any) => {
    e.preventDefault()
    setIsOpen(false)
    setTimeout(() => handleFormSubmit(tags), 400)
  }

  return (
    <ModalLayout title={title} isOpen={isOpen} handleClose={handleClose}>
      <form onSubmit={handleOnSubmit}>
        <div className="p-8">
          <label htmlFor="requirements" className="text-[15px] block mb-2">
            Requirements
          </label>
          <div className="border border-[#ACB9CB] p-2 rounded-md flex items-center gap-3 flex-wrap">
            {tags.map((tag: string) => (
              <div
                key={tag}
                className="bg-[#ACB9CB] rounded-md flex items-center gap-2 py-2 px-4 text-left justify-start"
              >
                <button type="button" onClick={() => handleRemoveTag(tag)}>
                  <XMarkIcon className="w-4 h-4" />
                </button>
                <p>{tag}</p>
              </div>
            ))}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              id="requirements"
              name="requirements"
              placeholder="Enter requirement..."
              className="focus:none outline-none py-2 px-4 grow"
            />
          </div>
        </div>
        <hr />
        <div className="flex items-center gap-2 text-[15px] font-bold justify-end px-8 py-4">
          <button
            onClick={handleClose}
            type="button"
            className="border border-[#355FD0] rounded-lg py-2 px-6 text-[#355FD0] hover:bg-[#355FD0]/[.15]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg py-2 px-6 bg-[#355FD0] text-white hover:bg-[#3156bd]"
          >
            Save
          </button>
        </div>
      </form>
    </ModalLayout>
  )
}
