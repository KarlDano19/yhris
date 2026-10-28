import { Metadata } from "next"

import FormResponseContent from "@/components/pages/(un-auth)/(forms)/form-response/Content"

export const metadata: Metadata = {
  title: "Form Response - Yahshua HRIS",
}

interface Props {
  params: { uuid: string }
}

export default function FormResponsePage({ params }: Props) {
  return <FormResponseContent uuid={params.uuid} />
}
