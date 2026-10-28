import { Metadata } from "next"

import QuestionsTabPage from "@/components/pages/(auth)/employer/manage/forms/builder/tabs/QuestionsTab"

export const metadata: Metadata = {
  title: "Create Form - Yahshua HRIS",
}

export default function NewFormPage() {
  return <QuestionsTabPage />
}
