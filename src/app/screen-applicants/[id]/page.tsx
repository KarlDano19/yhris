import Content from "@/components/pages/screen-applicants/[id]/Content"

export default function page({ params }) {
  return <Content id={parseInt(params.id)} />
}
