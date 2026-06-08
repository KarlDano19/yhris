import EmployeeDocumentationContent from "@/components/pages/(un-auth)/(landing-page)/use-cases/employee-documentation/EmployeeDocumentationContent";
import PixelEvents from '@/components/PixelEvents';

export default function EmployeeDocumentation() {
  return (
    <>
      <PixelEvents viewContent={{ content_name: 'Employee Documentation', content_category: 'use-cases' }} />
      <EmployeeDocumentationContent />
    </>
  );
}