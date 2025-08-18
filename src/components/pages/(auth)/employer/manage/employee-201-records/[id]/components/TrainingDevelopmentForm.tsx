import Section from "../common/Section";
import Grid from "../common/Grid";
import Field from "../common/Field";
import type { Employee } from "@/types/employee-201-records/employee";

export default function TrainingDevelopmentForm({ emp }: { emp?: Partial<Employee> }) {
  return (
    <Section>
      <Grid>
        <Field label="Latest Training" defaultValue="" />
        <Field label="Training Date" defaultValue="" />
        <Field label="Provider" defaultValue="" />
        <Field label="Required Hours" defaultValue="" />
      </Grid>
    </Section>
  );
}