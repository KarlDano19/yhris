import { useState } from "react"

export default function useTagSearch(input: string, setInput: any, arr: string[] = []) {
  const [tagsSearch, setTagsSearch] = useState(arr)

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" || event.key === "Tab" || event.key === ",") {
      event.preventDefault()
      const newTagSearch = input.trim()
      if (
        newTagSearch !== "" &&
        !tagsSearch.some((tagSearch) => tagSearch.toLowerCase() === newTagSearch.toLowerCase())
      ) {
        setTagsSearch([...tagsSearch, newTagSearch])
        setInput("")
      }
    }
  }

  const handleRemoveTag = (tagSearch: string) => {
    setTagsSearch(tagsSearch.filter((t) => t !== tagSearch))
  }
  
  return { tagsSearch, setTagsSearch, handleKeyDown, handleRemoveTag }
}
