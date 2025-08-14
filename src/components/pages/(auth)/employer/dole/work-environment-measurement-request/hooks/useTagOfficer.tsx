import { useState } from "react"

export default function useTagOfficer(input: string, setInput: any, arr: string[] = [], setFormValue?: any) {
    const [tagsOfficer, setTagsOfficer] = useState(arr)

    const handleKeyDownOfficer = (event: any) => {
        if (event.key === "Enter" || event.key === "Tab" || event.key === ",") {
            event.preventDefault()
            const newTagOfficer = input.trim()
            if (
                newTagOfficer !== "" &&
                !tagsOfficer.some((tagOfficer) => tagOfficer.toLowerCase() === newTagOfficer.toLowerCase())
            ) {
                const newTags = [...tagsOfficer, newTagOfficer]
                setTagsOfficer(newTags)
                if (setFormValue) {
                    setFormValue("name_of_safety_officer", newTags)
                }
                setInput("")
            }
        }
    }

    const handleRemoveTagOfficer = (tagOfficer: string) => {
        const newTags = tagsOfficer.filter((t) => t !== tagOfficer)
        setTagsOfficer(newTags)
        if (setFormValue) {
            setFormValue("name_of_safety_officer", newTags)
        }
    }

    return {tagsOfficer, setTagsOfficer, handleKeyDownOfficer, handleRemoveTagOfficer}
}
