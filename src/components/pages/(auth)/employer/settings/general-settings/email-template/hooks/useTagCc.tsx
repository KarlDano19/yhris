import { useState } from "react"

export default function useTagCC(input: string, setInput: any, arr: string[] = []) {
  const [tagsCc, setTagsCc] = useState(arr)

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" || event.key === "Tab" || event.key === ",") {
      event.preventDefault()
      const newTagCc = input.trim()
      if (
        newTagCc !== "" &&
        !tagsCc.some((tagCc) => tagCc.toLowerCase() === newTagCc.toLowerCase())
      ) {
        setTagsCc([...tagsCc, newTagCc])
        setInput("")
      }
    }
  }

  const handleRemoveTag = (tagCc: string) => {
    setTagsCc(tagsCc.filter((t) => t !== tagCc))
  }

  return { tagsCc, setTagsCc, handleKeyDown, handleRemoveTag }
}
