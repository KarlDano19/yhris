"use client";

import { useEffect, useMemo, useState } from "react";
import Section from "../common/Section";
import Grid from "../common/Grid";
import Field from "../common/Field";
import type { Employee } from "@/types/employee-201-records/employee";
import { s } from "../utils/_shared";

type Props = {
  emp?: Partial<Employee>;
  onPatchChange?: (patch: Record<string, any>) => void; 
  onErrorsChange?: (hasErrors: boolean) => void;
};

export default function PersonalInfoForm({ emp, onPatchChange, onErrorsChange }: Props) {
  const [firstname, setFirstname] = useState(s(emp?.firstname));
  const [middlename, setMiddlename] = useState(s(emp?.middlename));
  const [lastname,   setLastname]   = useState(s(emp?.lastname));
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

  const emit = (key: string, value: any) => onPatchChange?.({ [key]: value });
  const setErr = (key: string, msg: string | null) =>
    setErrors((e) => ({ ...e, [key]: msg }));

  /* ------------ validators (API keys) ------------ */
  const isEmpty = (v: string) => !v || v.trim().length === 0;
  const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const validateTop = {
    firstname: (v: string) => (isEmpty(v) ? "First Name is required." : null),
    lastname:  (v: string) => (isEmpty(v) ? "Last Name is required."  : null),
    email:     (v: string) =>
      isEmpty(v) ? "Email is required." : validEmail(v) ? null : "Invalid email address.",
    mobile:    (v: string) => {
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
    emit("emergency_contact", ec); // send the full object
  };
  /* ---------------------------------------------------------------- */

  /* -------------- pre-validate on first render -------------- */
  const buildInitialErrors = () => ({
    firstname: validateTop.firstname(firstname),
    middlename: null,
    lastname: validateTop.lastname(lastname),
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

  /* -------------- change handlers (emit API keys) -------------- */
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

  return (
    <>
      <Section>
        <Grid>
          <Field
            label="First Name"
            defaultValue={firstname}
            onChange={handle(setFirstname, "firstname", validateTop.firstname)}
            error={errors["firstname"] || null}
            required
          />
          <Field
            label="Middle Name"
            defaultValue={middlename}
            placeholder="Enter Middle Name..."
            onChange={handle(setMiddlename, "middlename")}
            error={errors["middlename"] || null}
          />
          <Field
            label="Last Name"
            defaultValue={lastname}
            onChange={handle(setLastname, "lastname", validateTop.lastname)}
            error={errors["lastname"] || null}
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
            defaultValue={mobile}
            onChange={handlePhone(setMobile, "mobile", validateTop.mobile)}
            error={errors["mobile"] || null}
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
              const val = e.target.value.replace(/\D/g, "");
              setTin(val);
              emit("tin", val);
              setErr("tin", validateGov.tin(val));
            }}
            error={errors["tin"] || null}
            hint="Digits only; 9 or 12 digits"
            required
          />
          <Field
            label="SSS"
            value={sss}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setSss(val);
              emit("sss", val);
              setErr("sss", validateGov.sss(val));
            }}
            error={errors["sss"] || null}
            hint="Digits only; 10 digits"
            required
          />
          <Field
            label="PAG-IBIG"
            value={pagibig}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setPagibig(val);
              emit("pagibig", val);
              setErr("pagibig", validateGov.pagibig(val));
            }}
            error={errors["pagibig"] || null}
            hint="Digits only; 12 digits"
            required
          />
          <Field
            label="PhilHealth"
            value={philhealth}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setPhilhealth(val);
              emit("philhealth", val);
              setErr("philhealth", validateGov.philhealth(val));
            }}
            error={errors["philhealth"] || null}
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
            onChange={(e) => {
              const v = e.target.value;
              setEcName(v);
              emitEmergency({ name: v }); // send whole object
              setErr("emergency_contact.name", validateEmergency.name(v));
            }}
            error={errors["emergency_contact.name"] || null}
            required
          />
          <Field
            label="Relation"
            defaultValue={ecRelation}
            onChange={(e) => {
              const v = e.target.value;
              setEcRelation(v);
              emitEmergency({ relation: v }); // send whole object
              setErr("emergency_contact.relation", validateEmergency.relation(v));
            }}
            error={errors["emergency_contact.relation"] || null}
          />
          <Field
            label="Contact Number"
            defaultValue={ecContact}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              setEcContact(digits);
              emitEmergency({ contact_number: digits }); // send whole object
              setErr("emergency_contact.contact_number", validateEmergency.contact_number(digits));
            }}
            error={errors["emergency_contact.contact_number"] || null}
            hint="Digits only (11 digits, starts with '09')"
            required
          />
          <Field
            className="sm:col-span-2"
            label="Address"
            defaultValue={ecAddress}
            onChange={(e) => {
              const v = e.target.value;
              setEcAddress(v);
              emitEmergency({ address: v }); // send whole object
              setErr("emergency_contact.address", validateEmergency.address(v));
            }}
            error={errors["emergency_contact.address"] || null}
          />
        </Grid>
      </Section>
    </>
  );
}
