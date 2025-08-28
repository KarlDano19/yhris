// components/PersonalInfoForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Section from "../common/Section";
import Grid from "../common/Grid";
import Field from "../common/Field";
import type { Employee } from "@/types/employee-201-records/employee";
import { s } from "../utils/_shared";

type Props = {
  emp?: Partial<Employee>;
  /** Bubble changes up as small patch objects */
  onPatchChange?: (patch: Record<string, any>) => void;
  onErrorsChange?: (hasErrors: boolean) => void;
};

export default function PersonalInfoForm({ emp, onPatchChange, onErrorsChange }: Props) {
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
  const [philhealth, setPhilhealth] = useState(
    s(emp?.governmentIds?.philhealth)
  );

  // emergency contact
  const [ecName, setEcName] = useState(s(emp?.emergencyContact?.name));
  const [ecRelation, setEcRelation] = useState(
    s(emp?.emergencyContact?.relation)
  );
  const [ecContact, setEcContact] = useState(
    s(emp?.emergencyContact?.contactNumber)
  );
  const [ecAddress, setEcAddress] = useState(s(emp?.emergencyContact?.address));
  
  // error bag
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const emit = (key: string, value: any) => onPatchChange?.({ [key]: value });
  const setErr = (key: string, msg: string | null) =>
    setErrors((e) => ({ ...e, [key]: msg }));

  /* ---------------- validators ---------------- */
  const isEmpty = (v: string) => !v || v.trim().length === 0;
  const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const requireIf = (cond: boolean, v: string, label: string) =>
    cond && isEmpty(v) ? `${label} is required.` : null;

  const validateTop = {
    firstName: (v: string) => (isEmpty(v) ? "First Name is required." : null),
    lastName: (v: string) => (isEmpty(v) ? "Last Name is required." : null),
    email: (v: string) =>
      isEmpty(v)
        ? "Email is required."
        : validEmail(v)
        ? null
        : "Invalid email address.",
    contactNumber: (v: string) => {
      if (isEmpty(v)) return "Contact Number is required.";
      if (!/^\d+$/.test(v)) return "Contact Number must be digits only.";
      if (v.length !== 11) return "Contact Number must be exactly 11 digits.";
      if (!v.startsWith("09")) return "Contact Number must start with '09'.";
      return null;
    },
  };

  // digits-only validator (for gov IDs) — all required
  const validateGov = {
    tin: (v: string) => {
      const digits = v.replace(/\D/g, "");
      if (isEmpty(digits)) return "TIN is required.";
      if (!/^\d+$/.test(digits)) return "TIN must contain digits only.";
      if (!(digits.length === 9 || digits.length === 12))
        return "TIN must be 9 or 12 digits.";
      return null;
    },
    sss: (v: string) => {
      const digits = v.replace(/\D/g, "");
      if (isEmpty(digits)) return "SSS is required.";
      if (!/^\d+$/.test(digits)) return "SSS must contain digits only.";
      if (digits.length !== 10) return "SSS must be 10 digits.";
      return null;
    },
    pagibig: (v: string) => {
      const digits = v.replace(/\D/g, "");
      if (isEmpty(digits)) return "PAG-IBIG is required.";
      if (!/^\d+$/.test(digits)) return "PAG-IBIG must contain digits only.";
      if (digits.length !== 12) return "PAG-IBIG must be 12 digits.";
      return null;
    },
    philhealth: (v: string) => {
      const digits = v.replace(/\D/g, "");
      if (isEmpty(digits)) return "PhilHealth is required.";
      if (!/^\d+$/.test(digits)) return "PhilHealth must contain digits only.";
      if (digits.length !== 12) return "PhilHealth must be 12 digits.";
      return null;
    },
  };

  const validateEmergency = {
    name: (v: string) => {
      const anyFilled = !!(ecRelation || ecContact || ecAddress);
      return requireIf(anyFilled, v, "Emergency Contact Name");
    },
    relation: (_v: string) => null, // optional
    contactNumber: (v: string) => {
      if (isEmpty(v)) return "Emergency Contact Number is required.";
      if (!/^\d+$/.test(v))
        return "Emergency Contact Number must be digits only.";
      if (v.length !== 11)
        return "Emergency Contact Number must be exactly 11 digits.";
      if (!v.startsWith("09"))
        return "Emergency Contact Number must start with '09'.";
      return null;
    },
    address: (_v: string) => null, // optional
  };
  /* -------------- pre-validate on first render -------------- */
  const buildInitialErrors = () => ({
    // Top-level
    firstName: validateTop.firstName(firstName),
    middleName: null, // optional
    lastName: validateTop.lastName(lastName),
    email: validateTop.email(email),
    address: null, // optional
    contactNumber: validateTop.contactNumber(contactNumber),

    // Government IDs (required)
    "governmentIds.tin": validateGov.tin(tin),
    "governmentIds.sss": validateGov.sss(sss),
    "governmentIds.pagibig": validateGov.pagibig(pagibig),
    "governmentIds.philhealth": validateGov.philhealth(philhealth),

    // Emergency Contact
    "emergencyContact.name": validateEmergency.name(ecName),
    "emergencyContact.relation": validateEmergency.relation(ecRelation),
    "emergencyContact.contactNumber":
      validateEmergency.contactNumber(ecContact),
    "emergencyContact.address": validateEmergency.address(ecAddress),
  });

  useEffect(() => {
    setErrors(buildInitialErrors());
    // If `emp` can change without remount, uncomment next line:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  /* -------------- change handlers with validation -------------- */
  const handle =
    (
      setter: (v: string) => void,
      key: string,
      validate?: (v: string) => string | null
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setter(v);
      emit(key, v);
      if (validate) setErr(key, validate(v));
    };

  // digits-only handler for gov IDs (we still show raw input but normalize to digits in state)
  const handleDigits =
    (
      setter: (v: string) => void,
      key: string,
      validate: (v: string) => string | null
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, "");
      setter(digits);
      emit(key, digits);
      setErr(key, validate(digits));
    };

  // digits-only for contact numbers (PH format)
  const handlePhone =
    (
      setter: (v: string) => void,
      key: string,
      validate: (v: string) => string | null
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, "");
      setter(digits);
      emit(key, digits);
      setErr(key, validate(digits));
    };
  
  const hasErrors = useMemo(
    () => Object.values(errors).some((m) => !!m && m.trim().length > 0),
    [errors]
  );

  useEffect(() => {
    onErrorsChange?.(hasErrors);
    // intentionally omit onErrorsChange to avoid identity churn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasErrors]);

  return (
    <>
      <Section>
        <Grid>
          <Field
            label="First Name"
            defaultValue={firstName}
            onChange={handle(setFirstName, "firstName", validateTop.firstName)}
            error={errors["firstName"] || null}
            required
          />
          <Field
            label="Middle Name"
            defaultValue={middleName}
            placeholder="Enter Middle Name..."
            onChange={handle(setMiddleName, "middleName")}
            error={errors["middleName"] || null}
          />
          <Field
            label="Last Name"
            defaultValue={lastName}
            onChange={handle(setLastName, "lastName", validateTop.lastName)}
            error={errors["lastName"] || null}
            required
          />
          <Field
            label="Email Address"
            defaultValue={email}
            onChange={handle(setEmail, "email", validateTop.email)}
            error={errors["email"] || null}
            required
          />
          <Field
            className="sm:col-span-2"
            label="Address"
            defaultValue={address}
            onChange={handle(setAddress, "address")}
            error={errors["address"] || null}
            hint="House/Unit, Street, Barangay, City, Province"
          />
          <Field
            label="Contact Number"
            defaultValue={contactNumber}
            onChange={handle(
              setContactNumber,
              "contactNumber",
              validateTop.contactNumber
            )}
            error={errors["contactNumber"] || null}
            hint="Digits only (11 digits, starts with '09')"
            required
          />
        </Grid>
      </Section>

      <Section title="Government IDs">
        <Grid>
          <Field
            label="TIN"
            value={tin}
            onChange={(e) => {
              const val = e.target.value;
              setTin(val);
              emit("governmentIds.tin", val);
              setErr("governmentIds.tin", validateGov.tin(val));
            }}
            error={errors["governmentIds.tin"] || null}
            hint="Digits only; 9 or 12 digits"
            required
          />

          <Field
            label="SSS"
            value={sss}
            onChange={(e) => {
              const val = e.target.value;
              setSss(val);
              emit("governmentIds.sss", val);
              setErr("governmentIds.sss", validateGov.sss(val));
            }}
            error={errors["governmentIds.sss"] || null}
            hint="Digits only; 10 digits"
            required
          />

          <Field
            label="PAG-IBIG"
            value={pagibig}
            onChange={(e) => {
              const val = e.target.value;
              setPagibig(val);
              emit("governmentIds.pagibig", val);
              setErr("governmentIds.pagibig", validateGov.pagibig(val));
            }}
            error={errors["governmentIds.pagibig"] || null}
            hint="Digits only; 12 digits"
            required
          />

          <Field
            label="PhilHealth"
            value={philhealth}
            onChange={(e) => {
              const val = e.target.value;
              setPhilhealth(val);
              emit("governmentIds.philhealth", val);
              setErr("governmentIds.philhealth", validateGov.philhealth(val));
            }}
            error={errors["governmentIds.philhealth"] || null}
            hint="Digits only; 12 digits"
            required
          />
        </Grid>
      </Section>

      <Section title="Emergency Contact">
        <Grid>
          <Field
            label="Name"
            defaultValue={ecName}
            onChange={handle(
              setEcName,
              "emergencyContact.name",
              validateEmergency.name
            )}
            error={errors["emergencyContact.name"] || null}
            required
          />
          <Field
            label="Relation"
            defaultValue={ecRelation}
            onChange={handle(
              setEcRelation,
              "emergencyContact.relation",
              validateEmergency.relation
            )}
            error={errors["emergencyContact.relation"] || null}
          />
          <Field
            label="Contact Number"
            defaultValue={ecContact}
            onChange={handle(
              setEcContact,
              "emergencyContact.contactNumber",
              validateEmergency.contactNumber
            )}
            error={errors["emergencyContact.contactNumber"] || null}
            hint="Digits only (11 digits, starts with '09')"
            required
          />
          <Field
            className="sm:col-span-2"
            label="Address"
            defaultValue={ecAddress}
            onChange={handle(
              setEcAddress,
              "emergencyContact.address",
              validateEmergency.address
            )}
            error={errors["emergencyContact.address"] || null}
          />
        </Grid>
      </Section>
    </>
  );
}
