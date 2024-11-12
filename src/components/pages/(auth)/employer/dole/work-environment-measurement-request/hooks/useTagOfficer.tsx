import { useState } from "react"

export default function useTagOfficer(input: string, setInput: any, arr: string[] = []) {
    const [tagsOfficer, setTagsOfficer] = useState(arr)

    const handleKeyDownOfficer = (event: any) => {
        if (event.key === "Enter" || event.key === "Tab" || event.key === ",") {
            event.preventDefault()
            const newTagOfficer = input.trim()
            if (
                newTagOfficer !== "" &&
                !tagsOfficer.some((tagOfficer) => tagOfficer.toLowerCase() === newTagOfficer.toLowerCase())
            ) {
                setTagsOfficer([...tagsOfficer, newTagOfficer])
                setInput("")
            }
        }
    }

    const handleRemoveTagOfficer = (tagOfficer: string) => {
        setTagsOfficer(tagsOfficer.filter((t) => t !== tagOfficer))
    }

    return {tagsOfficer, setTagsOfficer, handleKeyDownOfficer, handleRemoveTagOfficer}
}
