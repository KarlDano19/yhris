// components/PersonalInfoForm.tsx
import { useState } from "react";
import Section from "../common/Section";
import Grid from "../common/Grid";
import Field from "../common/Field";
import type { Employee } from "@/types/employee-201-records/employee";
import { s } from "../utils/_shared";

type Props = {
  emp?: Partial<Employee>;
  /** Bubble changes up as small patch objects */
  onPatchChange?: (patch: Record<string, any>) => void;
};

export default function PersonalInfoForm({ emp, onPatchChange }: Props) {
  // top-level
  const [firstName, setFirstName] = useState(s(emp?.firstName));
  const [middleName, setMiddleName] = useState(s(emp?.middleName));
  const [lastName, setLastName] = useState(s(emp?.lastName));
  const [email, setEmail] = useState(s(emp?.email));
  const [address, setAddress] = useState(s(emp?.address));
  const [contactNumber, setContactNumber] = useState(s(emp?.contactNumber));

  // government ids
  const [tin, setTin] = useState(s(emp?.governmentIds?.tin));
  const [sss, setSss] = useState(s(emp?.governmentIds?.sss));
  const [pagibig, setPagibig] = useState(s(emp?.governmentIds?.pagibig));
  const [philhealth, setPhilhealth] = useState(s(emp?.governmentIds?.philhealth));

  // emergency contact
  const [ecName, setEcName] = useState(s(emp?.emergencyContact?.name));
  const [ecRelation, setEcRelation] = useState(s(emp?.emergencyContact?.relation));
  const [ecContact, setEcContact] = useState(s(emp?.emergencyContact?.contactNumber));
  const [ecAddress, setEcAddress] = useState(s(emp?.emergencyContact?.address));

  const emit = (key: string, value: any) => onPatchChange?.({ [key]: value });

  // helper to avoid repetition
  const handle =
    (setter: (v: string) => void, key: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setter(v);
      emit(key, v);
    };

  return (
    <>
      <Section>
        <Grid>
          <Field
            label="First Name"
            defaultValue={firstName}
            onChange={handle(setFirstName, "firstName")}
          />
          <Field
            label="Middle Name"
            defaultValue={middleName}
            placeholder="Enter Middle Name..."
            onChange={handle(setMiddleName, "middleName")}
          />
          <Field
            label="Last Name"
            defaultValue={lastName}
            onChange={handle(setLastName, "lastName")}
          />
          <Field
            label="Email Address"
            defaultValue={email}
            onChange={handle(setEmail, "email")}
          />
          <Field
            className="sm:col-span-2"
            label="Address"
            defaultValue={address}
            onChange={handle(setAddress, "address")}
          />
          <Field
            label="Contact Number"
            defaultValue={contactNumber}
            onChange={handle(setContactNumber, "contactNumber")}
          />
        </Grid>
      </Section>

      <Section title="Government IDs">
        <Grid>
          <Field
            label="TIN"
            defaultValue={tin}
            onChange={handle(setTin, "governmentIds.tin")}
          />
          <Field
            label="SSS"
            defaultValue={sss}
            onChange={handle(setSss, "governmentIds.sss")}
          />
          <Field
            label="PAG-IBIG"
            defaultValue={pagibig}
            onChange={handle(setPagibig, "governmentIds.pagibig")}
          />
          <Field
            label="PhilHealth"
            defaultValue={philhealth}
            onChange={handle(setPhilhealth, "governmentIds.philhealth")}
          />
        </Grid>
      </Section>

      <Section title="Emergency Contact">
        <Grid>
          <Field
            label="Name"
            defaultValue={ecName}
            onChange={handle(setEcName, "emergencyContact.name")}
          />
          <Field
            label="Relation"
            defaultValue={ecRelation}
            onChange={handle(setEcRelation, "emergencyContact.relation")}
          />
          <Field
            label="Contact Number"
            defaultValue={ecContact}
            onChange={handle(setEcContact, "emergencyContact.contactNumber")}
          />
          <Field
            className="sm:col-span-2"
            label="Address"
            defaultValue={ecAddress}
            onChange={handle(setEcAddress, "emergencyContact.address")}
          />
        </Grid>
      </Section>
    </>
  );
}
