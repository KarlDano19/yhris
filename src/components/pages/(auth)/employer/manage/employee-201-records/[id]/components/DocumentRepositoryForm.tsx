import Section from "../common/Section";
import Grid from "../common/Grid";
import Field from "../common/Field";
import type { Employee } from "@/types/employee-201-records/employee";

export default function DocumentRepositoryForm({ emp }: { emp?: Partial<Employee> }) {
  return (
    <Section>
      <Grid>
        <Field label="Job Offer Letter" defaultValue="" />
        <Field label="Employment Contract" defaultValue="" />
        <Field label="COE (Issued)" defaultValue="" />
        <Field label="Other Document" placeholder="Add note…" />
      </Grid>
    </Section>
  );
}