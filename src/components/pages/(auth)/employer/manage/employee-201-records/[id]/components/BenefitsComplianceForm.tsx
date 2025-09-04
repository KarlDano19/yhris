import Section from "../common/Section";
import Grid from "../common/Grid";
import Field from "../common/Field";
import type { Employee } from "@/types/employee-201-records/employee";
import { s } from "../utils/_shared";

export default function BenefitsComplianceForm({ emp }: { emp?: Partial<Employee> }) {
  return (
    <Section>
      <Grid>
        <Field label="HMO Provider" defaultValue="" />
        <Field label="Coverage Start" defaultValue="" />
      </Grid>
    </Section>
  );
}