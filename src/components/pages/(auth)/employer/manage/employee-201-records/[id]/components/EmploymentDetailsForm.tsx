import Section from "../common/Section";
import Grid from "../common/Grid";
import Field from "../common/Field";
import type { Employee } from "@/types/employee-201-records/employee";
import { s } from "../utils/_shared";

export default function EmploymentDetailsForm({ emp }: { emp?: Partial<Employee> }) {
  const employeeId = emp?.id;
  const hireDate = "";
  const employmentType = "";
  const status = "";
  const department = emp?.department ?? emp?.displayDept;
  const position = emp?.position ?? emp?.jobTitle;
  const manager = "";
  const workLocation = emp?.location;

  return (
    <Section>
      <Grid>
        <Field label="Employee ID" defaultValue={s(employeeId)} />
        <Field label="Hire Date" defaultValue={s(hireDate)} />
        <Field label="Employment Type" defaultValue={s(employmentType)} />
        <Field label="Status" defaultValue={s(status)} />
        <Field label="Department" defaultValue={s(department)} />
        <Field label="Position" defaultValue={s(position)} />
        <Field label="Manager" defaultValue={s(manager)} />
        <Field label="Work Location" defaultValue={s(workLocation)} />
      </Grid>
    </Section>
  );
}