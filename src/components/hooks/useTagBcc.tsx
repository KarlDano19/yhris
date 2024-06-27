import { useState } from "react"

export default function useTagBcc(input: string, setInput: any, arr: string[] = []) {
  const [tagsBcc, setTagsBcc] = useState(arr)

  const handleKeyDownBcc = (event: any) => {
    if (event.key === "Enter" || event.key === "Tab" || event.key === ",") {
      event.preventDefault()
      const newTagBcc = input.trim()
      if (
        newTagBcc !== "" &&
        !tagsBcc.some((tagBcc) => tagBcc.toLowerCase() === newTagBcc.toLowerCase())
      ) {
        setTagsBcc([...tagsBcc, newTagBcc])
        setInput("")
      }
    }
  }

  const handleRemoveTagBcc = (tagBcc: string) => {
    setTagsBcc(tagsBcc.filter((t) => t !== tagBcc))
  }

  return { tagsBcc, setTagsBcc, handleKeyDownBcc, handleRemoveTagBcc }
}
