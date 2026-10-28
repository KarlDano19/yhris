import { Metadata } from "next"

import QuestionsTabPage from "@/components/pages/(auth)/employer/manage/forms/builder/tabs/QuestionsTab"

export const metadata: Metadata = {
  title: "Edit Form - Yahshua HRIS",
}

interface Props {
  params: { id: string }
}

export default function EditFormPage({ params }: Props) {
  return <QuestionsTabPage formId={parseInt(params.id)} />
}
