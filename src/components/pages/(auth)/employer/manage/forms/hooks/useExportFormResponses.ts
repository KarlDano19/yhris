import { useState } from 'react'

import { getCookie } from 'cookies-next'

async function exportFormResponses(formId: number): Promise<void> {
  const token = getCookie('token')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/forms/${formId}/responses/export/`,
    {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message || 'Failed to export responses.')
  }

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `form-${formId}-responses.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function useExportFormResponses() {
  const [isExporting, setIsExporting] = useState(false)

  const exportResponses = async (formId: number) => {
    setIsExporting(true)
    try {
      await exportFormResponses(formId)
    } finally {
      setIsExporting(false)
    }
  }

  return { exportResponses, isExporting }
}

export default useExportFormResponses
