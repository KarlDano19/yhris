import { useState } from "react"

export default function useTagInput(input: string, setInput: any, arr: string[] = []) {
  const [tags, setTags] = useState(arr)

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" || event.key === "Tab" || event.key === ",") {
      event.preventDefault()
      const newTag = input.trim()
      if (
        newTag !== "" &&
        !tags.some((tag) => tag.toLowerCase() === newTag.toLowerCase())
      ) {
        setTags([...tags, newTag])
        setInput("")
      }
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  return { tags, handleKeyDown, handleRemoveTag }
}
