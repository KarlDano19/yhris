"use client";

import { useEffect, useMemo, useState } from "react";

import Section from "../common/Section";
import Grid from "../common/Grid";
import Field from "../common/Field";

import { s } from "../utils/_shared";

import type { Employee } from "@/types/employee-201-records/employee";

type Props = {
  emp?: Partial<Employee>;
  onPatchChange?: (patch: Record<string, any>) => void; 
  onErrorsChange?: (hasErrors: boolean) => void;
  editing?: boolean;
};

export default function PersonalInfoForm({
  emp,
  onPatchChange,
  onErrorsChange,
  editing = false,
}: Props) {
  // names are display-only (no state, no setters)
  const firstname = s(emp?.firstname);
  const middlename = s(emp?.middlename);
  const lastname   = s(emp?.lastname);

  const [email,      setEmail]      = useState(s(emp?.email));
  const [address,    setAddress]    = useState(s(emp?.address));
  const [mobile,     setMobile]     = useState(s(emp?.mobile));

  // government ids
  const [tin,        setTin]        = useState(s(emp?.tin));
  const [sss,        setSss]        = useState(s(emp?.sss));
  const [pagibig,    setPagibig]    = useState(s(emp?.pagibig));
  const [philhealth, setPhilhealth] = useState(s(emp?.philhealth));

  // emergency contact
  const [ecName,     setEcName]     = useState(s(emp?.emergency_contact?.name));
  const [ecRelation, setEcRelation] = useState(s(emp?.emergency_contact?.relation));
  const [ecContact,  setEcContact]  = useState(s(emp?.emergency_contact?.contact_number));
  const [ecAddress,  setEcAddress]  = useState(s(emp?.emergency_contact?.address));

  // error bag
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const emit  = (key: string, value: any) => onPatchChange?.({ [key]: value });
  const setErr = (key: string, msg: string | null) =>
    setErrors((e) => ({ ...e, [key]: msg }));

  /* ------------ validators ------------ */
  const isEmpty = (v: string) => !v || v.trim().length === 0;
  const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const validateTop = {
    email: (v: string) =>
      isEmpty(v) ? "Email is required." : validEmail(v) ? null : "Invalid email address.",
    mobile: (v: string) => {
      if (isEmpty(v)) return "Contact Number is required.";
      if (!/^\d+$/.test(v)) return "Contact Number must be digits only.";
      if (v.length !== 11) return "Contact Number must be exactly 11 digits.";
      if (!v.startsWith("09")) return "Contact Number must start with '09'.";
      return null;
    },
  };

  const validateGov = {
    tin: (v: string) => {
      const digits = v.replace(/\D/g, "");
      if (isEmpty(digits)) return "TIN is required.";
      if (!/^\d+$/.test(digits)) return "TIN must contain digits only.";
      if (!(digits.length === 9 || digits.length === 12)) return "TIN must be 9 or 12 digits.";
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
    name:           (v: string) => (isEmpty(v) ? "Emergency Contact Name is required." : null),
    relation:       (_: string) => null,
    contact_number: (v: string) => {
      if (isEmpty(v)) return "Emergency Contact Number is required.";
      if (!/^\d+$/.test(v)) return "Emergency Contact Number must be digits only.";
      if (v.length !== 11) return "Emergency Contact Number must be exactly 11 digits.";
      if (!v.startsWith("09")) return "Emergency Contact Number must start with '09'.";
      return null;
    },
    address:        (_: string) => null,
  };

  /* ---------- emit whole emergency_contact on any change ---------- */
  const emitEmergency = (overrides?: Partial<{
    name: string; relation: string; contact_number: string; address: string;
  }>) => {
    const ec = {
      name:           overrides?.name ?? ecName,
      relation:       overrides?.relation ?? ecRelation,
      contact_number: overrides?.contact_number ?? ecContact,
      address:        overrides?.address ?? ecAddress,
    };
    emit("emergency_contact", ec);
  };

  /* -------------- pre-validate on first render -------------- */
  const buildInitialErrors = () => ({
    email: validateTop.email(email),
    address: null,
    mobile: validateTop.mobile(mobile),

    tin: validateGov.tin(tin),
    sss: validateGov.sss(sss),
    pagibig: validateGov.pagibig(pagibig),
    philhealth: validateGov.philhealth(philhealth),

    "emergency_contact.name": validateEmergency.name(ecName),
    "emergency_contact.relation": validateEmergency.relation(ecRelation),
    "emergency_contact.contact_number": validateEmergency.contact_number(ecContact),
    "emergency_contact.address": validateEmergency.address(ecAddress),
  });

  useEffect(() => {
    setErrors(buildInitialErrors());
  }, []); // once

  /* -------------- change handlers -------------- */
  const handle =
    (setter: (v: string) => void, key: string, validate?: (v: string) => string | null) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setter(v);
      emit(key, v);
      if (validate) setErr(key, validate(v));
    };

  const handleDigits =
    (setter: (v: string) => void, key: string, validate: (v: string) => string | null) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, "");
      setter(digits);
      emit(key, digits);
      setErr(key, validate(digits));
    };

  const handlePhone =
    (setter: (v: string) => void, key: string, validate: (v: string) => string | null) =>
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
  }, [hasErrors]);

  // gate error display when not editing
  const showErr = (k: string) => (editing ? errors[k] || null : null);

  return (
    <>
      <Section>
        <Grid>
          {/* Read-only name fields */}
          <Field dataTestid="first-name-field"  label="First Name"  value={firstname}  disabled />
          <Field dataTestid="middle-name-field" label="Middle Name" value={middlename} disabled />
          <Field dataTestid="last-name-field"   label="Last Name"   value={lastname}   disabled />

          <Field
            dataTestid="email-field"
            label="Email Address"
            defaultValue={email}
            onChange={handle(setEmail, "email", validateTop.email)}
            error={showErr("email")}
            disabled={!editing}
            required
          />
          <Field
            dataTestid="address-field"
            className="sm:col-span-2"
            label="Address"
            defaultValue={address}
            onChange={handle(setAddress, "address")}
            error={showErr("address")}
            disabled={!editing}
            hint="House/Unit, Street, Barangay, City, Province"
          />
          <Field
            dataTestid="contact-no-field"
            label="Contact Number"
            defaultValue={mobile}
            onChange={handlePhone(setMobile, "mobile", validateTop.mobile)}
            error={showErr("mobile")}
            disabled={!editing}
            hint="Digits only (11 digits, starts with '09')"
            required
          />
        </Grid>
      </Section>

      <Section title="Government IDs">
        <Grid>
          <Field
            dataTestid="tin-field"
            label="TIN"
            value={tin}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setTin(val);
              emit("tin", val);
              setErr("tin", validateGov.tin(val));
            }}
            error={showErr("tin")}
            disabled={!editing}
            hint="Digits only; 9 or 12 digits"
            required
          />
          <Field
            dataTestid="sss-field"
            label="SSS"
            value={sss}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setSss(val);
              emit("sss", val);
              setErr("sss", validateGov.sss(val));
            }}
            error={showErr("sss")}
            disabled={!editing}
            hint="Digits only; 10 digits"
            required
          />
          <Field
            dataTestid="pagibig-field"
            label="PAG-IBIG"
            value={pagibig}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setPagibig(val);
              emit("pagibig", val);
              setErr("pagibig", validateGov.pagibig(val));
            }}
            error={showErr("pagibig")}
            disabled={!editing}
            hint="Digits only; 12 digits"
            required
          />
          <Field
            dataTestid="philhealth-field"
            label="PhilHealth"
            value={philhealth}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setPhilhealth(val);
              emit("philhealth", val);
              setErr("philhealth", validateGov.philhealth(val));
            }}
            error={showErr("philhealth")}
            disabled={!editing}
            hint="Digits only; 12 digits"
            required
          />
        </Grid>
      </Section>

      <Section title="Emergency Contact">
        <Grid>
          <Field
            dataTestid="emergency-name-field"
            label="Name"
            defaultValue={ecName}
            onChange={(e) => {
              const v = e.target.value;
              setEcName(v);
              emitEmergency({ name: v });
              setErr("emergency_contact.name", validateEmergency.name(v));
            }}
            error={showErr("emergency_contact.name")}
            disabled={!editing}
            required
          />
          <Field
            dataTestid="emergency-relation-field"
            label="Relation"
            defaultValue={ecRelation}
            onChange={(e) => {
              const v = e.target.value;
              setEcRelation(v);
              emitEmergency({ relation: v });
              setErr("emergency_contact.relation", validateEmergency.relation(v));
            }}
            error={showErr("emergency_contact.relation")}
            disabled={!editing}
          />
          <Field
            dataTestid="emergency-no-field"
            label="Contact Number"
            defaultValue={ecContact}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              setEcContact(digits);
              emitEmergency({ contact_number: digits });
              setErr("emergency_contact.contact_number", validateEmergency.contact_number(digits));
            }}
            error={showErr("emergency_contact.contact_number")}
            disabled={!editing}
            hint="Digits only (11 digits, starts with '09')"
            required
          />
          <Field
            dataTestid="emergency-address-field"
            className="sm:col-span-2"
            label="Address"
            defaultValue={ecAddress}
            onChange={(e) => {
              const v = e.target.value;
              setEcAddress(v);
              emitEmergency({ address: v });
              setErr("emergency_contact.address", validateEmergency.address(v));
            }}
            error={showErr("emergency_contact.address")}
            disabled={!editing}
          />
        </Grid>
      </Section>
    </>
  );
}
