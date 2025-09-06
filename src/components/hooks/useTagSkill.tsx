import { useState } from "react"

export default function useTagSkill(input: string, setInput: any, arr: string[] = []) {
  const [tagsSkill, setTagsSkill] = useState(arr)

  const handleKeyDownSkill = (event: any) => {
    if (event.key === "Enter" || event.key === "Tab" || event.key === ",") {
      event.preventDefault()
      const newTagSkill = input.trim()
      if (
        newTagSkill !== "" &&
        !tagsSkill.some((tagSkill) => tagSkill.toLowerCase() === newTagSkill.toLowerCase())
      ) {
        setTagsSkill([...tagsSkill, newTagSkill])
        setInput("")
      }
    }
  }

  const handleRemoveTagSkill = (tagSkill: string) => {
    setTagsSkill(tagsSkill.filter((t) => t !== tagSkill))
  }

  return { tagsSkill, setTagsSkill, handleKeyDownSkill, handleRemoveTagSkill }
}
