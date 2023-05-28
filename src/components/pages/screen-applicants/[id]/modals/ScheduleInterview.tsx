import CalendarIcon from "@/svg/CalendarIcon"
import { LocationIcon, WhiteLocationIcon } from "@/svg/LocationIcon"
import { PhoneIcon, WhitePhoneIcon } from "@/svg/PhoneIcon"
import SelectChevronDown from "@/svg/SelectChevronDownDummy"
import { VideoIcon, WhiteVideoIcon } from "@/svg/VideoIcon"
import { useEffect, useState } from "react"
import ModalLayout from "./ModalLayout"
import { ScheduleInterviewPropTypes as PropTypes } from "../../types"

export default function ScheduleInterview({
  title,
  id,
  setId,
  handleSubmit,
}: PropTypes) {
  const [selectionId, setSelectionId] = useState("video")

  const formatTypes = [
    {
      title: "Video",
      name: "type",
      id: "video",
      icon: <VideoIcon />,
      whiteIcon: <WhiteVideoIcon />,
      borderStyle: "rounded-tl-md rounded-bl-md",
    },
    {
      title: "Phone",
      name: "type",
      id: "phone",
      icon: <PhoneIcon />,
      whiteIcon: <WhitePhoneIcon />,
      borderStyle: "",
    },
    {
      title: "In-person",
      name: "type",
      id: "inPerson",
      icon: <LocationIcon />,
      whiteIcon: <WhiteLocationIcon />,
      borderStyle: "rounded-tr-md rounded-br-md",
    },
  ]

  const platforms = [
    {
      title: "Zoom",
      name: "platform",
      id: "zoom",
      value: "zoom",
    },
    {
      title: "Google Meet",
      name: "platform",
      id: "googleMeet",
      value: "google meet",
    },
    {
      title: "Microsoft Teams",
      name: "platform",
      id: "microsoftTeams",
      value: "microsoft teams",
    },
  ]
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    id && setIsOpen(true)
  }, [id])
  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setId(null), 400)
  }
  const handleOnSubmit = (e: any) => {
    e.preventDefault()
    setIsOpen(false)
    setTimeout(() => handleSubmit(), 400)
  }

  return (
    <ModalLayout title={title} isOpen={isOpen} handleClose={handleClose}>
      <form onSubmit={handleOnSubmit}>
        <div className="p-8">
          <div className="flex items-center gap-3 flex-wrap mb-8">
            <div className="text-indigo-dye flex-grow">
              <label htmlFor="date" className="block mb-2">
                Date<span className="text-[#D65846]">*</span>
              </label>
              <div className="border border-[#ACB9CB] focus-within:outline focus-within:outline-1 focus-within:outline-[#355FD0] rounded-md flex items-center justify-between py-2 px-4">
                <input
                  type="date"
                  name="date"
                  id="date"
                  className="focus:none outline-none"
                />
                <CalendarIcon className="w-7 h-7" />
              </div>
            </div>
            <div className="text-indigo-dye flex-grow">
              <label htmlFor="startTime" className="block mb-2">
                Start Time<span className="text-[#D65846]">*</span>
              </label>

              <div className="border border-[#ACB9CB] rounded-md flex items-center justify-between py-2 px-4 focus-within:outline focus-within:outline-1 focus-within:outline-[#355FD0]">
                <input
                  type="time"
                  id="startTime"
                  name="start-time"
                  className="focus:none outline-none"
                />
              </div>
            </div>
            <div className="text-indigo-dye flex-grow">
              <label htmlFor="duration" className="block mb-2">
                Duration<span className="text-[#D65846]">*</span>
              </label>

              <div className="border border-[#ACB9CB] rounded-md flex items-center justify-between relative focus-within:outline focus-within:outline-1 focus-within:outline-[#355FD0]">
                <select
                  name="duration"
                  id="duration"
                  className="w-full py-2 px-4 focus:none outline-none rounded-full"
                >
                  <option value="30">30 min</option>
                  <option value="60">1 hr</option>
                  <option value="120">2 hr</option>
                </select>
                <div className="absolute right-4 pointer-events-none">
                  <SelectChevronDown />
                </div>
              </div>
            </div>
          </div>

          {/* format type */}
          <label htmlFor="type" className="block mb-2">
            Format<span className="text-[#D65846]">*</span>
          </label>

          <div className="flex items-center mb-8">
            {formatTypes.map((item, index) => {
              const hasSelected = item.id === selectionId
              return (
                <div
                  key={index}
                  className={`${
                    hasSelected
                      ? "bg-[#355FD0] text-white border-[#355FD0]"
                      : "border-[#ACB9CB]"
                  } ${
                    item.borderStyle
                  } flex items-center gap-2 border grow px-4 focus-within:outline focus-within:outline-1 focus-within:outline-[#355FD0]`}
                >
                  <div>{hasSelected ? item.whiteIcon : item.icon}</div>
                  <label htmlFor={item.id} className="grow py-3">
                    {item.title}
                  </label>
                  <input
                    type="radio"
                    id={item.id}
                    name={item.name}
                    className="py-3 opacity-0"
                    onChange={(e) => setSelectionId(e.target.id)}
                    checked={hasSelected}
                  />
                </div>
              )
            })}
          </div>

          {selectionId === "video" && (
            <div className="flex items-center justify-between px-12 mb-8 text-indigo-dye text-[15px]">
              {platforms.map((item, index) => {
                const { title, ...rest } = item

                return (
                  <div key={index} className="flex items-center gap-2">
                    <input type="radio" {...rest} className="w-5 h-5" />
                    <label htmlFor={item.id}>{item.title}</label>
                  </div>
                )
              })}
            </div>
          )}

          {selectionId === "phone" && (
            <div className="mb-8 text-indigo-dye text-[15px]">
              <label htmlFor="phoneNumber" className="block mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="border border-[#ACB9CB] rounded-md grow px-6 py-2 w-full focus:outline focus:outline-1 focus:outline-[#355FD0]"
              />
            </div>
          )}

          {selectionId === "inPerson" && (
            <div className="mb-8 text-indigo-dye text-[15px]">
              <label htmlFor="address" className="block mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="border border-[#ACB9CB] rounded-md grow px-6 py-2 w-full focus:outline focus:outline-1 focus:outline-[#355FD0]"
              />
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="message" className="text-[15px] mb-2">
              Message
            </label>
            <p className="mb-1 text-[#6F829B]">
              You may include information about agenda, dresscord, and any
              additional information.
            </p>
            <textarea
              name="message"
              id="message"
              rows={4}
              placeholder="Enter message..."
              className="border border-[#ACB9CB] rounded-md py-2 px-6 w-full focus:outline focus:outline-1 focus:outline-[#355FD0]"
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="text-[15px] mb-2">
              Add hiring team members<span className="text-[#D65846]">*</span>
            </label>
            <p className="mb-1 text-[#6F829B]">
              Enter emails separated by comma.
            </p>
            <input
              type="text"
              id="email"
              name="email"
              className="border border-[#ACB9CB] rounded-md py-2 px-6 w-full focus:outline focus:outline-1 focus:outline-[#355FD0]"
            />
          </div>
        </div>

        <hr />
        <div className="flex items-center gap-2 text-[15px] font-bold justify-end px-8 py-4">
          <button
            onClick={handleClose}
            type="button"
            className="border border-[#355FD0] rounded-lg py-3 px-6 text-[#355FD0] hover:bg-[#355FD0]/[.15]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg py-3 px-6 bg-[#355FD0] text-white hover:bg-[#3156bd]"
          >
            Send Interview Request
          </button>
        </div>
      </form>
    </ModalLayout>
  )
}
