import Section from "../common/Section";
import Grid from "../common/Grid";
import Field from "../common/Field";
import type { Employee } from "@/types/employee-201-records/employee";

export default function PerformanceEvaluationForm({ emp }: { emp?: Partial<Employee> }) {
  return (
    <Section>
      <Grid>
        <Field label="Cycle" defaultValue="" />
        <Field label="Rating" defaultValue="" />
        <Field label="Evaluator" defaultValue="" />
        <Field label="Next Review" defaultValue="" />
      </Grid>
    </Section>
  );
}