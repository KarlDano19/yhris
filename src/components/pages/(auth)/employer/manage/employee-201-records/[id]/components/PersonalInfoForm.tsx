import Section from "../common/Section";
import Grid from "../common/Grid";
import Field from "../common/Field";
import type { Employee } from "@/types/employee-201-records/employee";
import { s } from "../utils/_shared";

export default function PersonalInfoForm({ emp }: { emp?: Partial<Employee> }) {
  return (
    <>
      <Section>
        <Grid>
          <Field label="First Name" defaultValue={s(emp?.firstName)} />
          <Field label="Middle Name" defaultValue={s(emp?.middleName)} placeholder="Enter Middle Name..." />
          <Field label="Last Name" defaultValue={s(emp?.lastName)} />
          <Field label="Email Address" defaultValue={s(emp?.email)} />
          <Field className="sm:col-span-2" label="Address" defaultValue={s(emp?.address)} />
          <Field label="Contact Number" defaultValue={s(emp?.contactNumber)} />
        </Grid>
      </Section>

      <Section title="Government IDs">
        <Grid>
          <Field label="TIN" defaultValue={s(emp?.governmentIds?.tin)} />
          <Field label="SSS" defaultValue={s(emp?.governmentIds?.sss)} />
          <Field label="PAG-IBIG" defaultValue={s(emp?.governmentIds?.pagibig)} />
          <Field label="PhilHealth" defaultValue={s(emp?.governmentIds?.philhealth)} />
        </Grid>
      </Section>

      <Section title="Emergency Contact">
        <Grid>
          <Field label="Name" defaultValue={s(emp?.emergencyContact?.name)} />
          <Field label="Relation" defaultValue={s(emp?.emergencyContact?.relation)} />
          <Field label="Contact Number" defaultValue={s(emp?.emergencyContact?.contactNumber)} />
          <Field className="sm:col-span-2" label="Address" defaultValue={s(emp?.emergencyContact?.address)} />
        </Grid>
      </Section>
    </>
  );
}