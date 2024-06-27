import { useState } from "react"

export default function useTagTo(input: string, setInput: any, arr: string[] = []) {
  const [tagsTo, setTagsTo] = useState(arr)

  const handleKeyDownTo = (event: any) => {
    if (event.key === "Enter" || event.key === "Tab" || event.key === ",") {
      event.preventDefault()
      const newTagTo = input.trim()
      if (
        newTagTo !== "" &&
        !tagsTo.some((tagTo) => tagTo.toLowerCase() === newTagTo.toLowerCase())
      ) {
        setTagsTo([...tagsTo, newTagTo])
        setInput("")
      }
    }
  }

  const handleRemoveTagTo = (tagTo: string) => {
    setTagsTo(tagsTo.filter((t) => t !== tagTo))
  }

  return { tagsTo, setTagsTo, handleKeyDownTo, handleRemoveTagTo }
}
