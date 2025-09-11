import Section from "../common/Section";
import Grid from "../common/Grid";
import Field from "../common/Field";
import type { Employee } from "@/types/employee-201-records/employee";

export default function DisciplinaryRecordsForm({ emp }: { emp?: Partial<Employee> }) {
  return (
    <Section>
      <Grid>
        <Field label="Case No." defaultValue="" />
        <Field label="Type" defaultValue="" />
        <Field label="Status" defaultValue="" />
        <Field label="Hearing Date" defaultValue="" />
      </Grid>
    </Section>
  );
}