"use client";

import { useEffect, useMemo } from "react";

import { useForm, Controller } from "react-hook-form";

import Section from "../common/Section";
import Grid from "../common/Grid";
import Field from "../common/Field";
import CustomDatePicker from "@/components/CustomDatePicker";

import { s } from "../utils/_shared";

import type { Employee } from "@/types/employee-201-records/employee";

import SelectChevronDown from "@/svg/SelectChevronDown";

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
  const lastname = s(emp?.lastname);

  // React Hook Form setup
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: s(emp?.email),
      address: s(emp?.address),
      mobile: s(emp?.mobile),
      birthdate: emp?.birthdate ? new Date(emp.birthdate) : null as Date | null,
      gender: s(emp?.gender),
      tin: s(emp?.tin),
      sss: s(emp?.sss),
      pagibig: s(emp?.pagibig),
      philhealth: s(emp?.philhealth),
      emergency_contact_name: s(emp?.emergency_contact?.name),
      emergency_contact_relation: s(emp?.emergency_contact?.relation),
      emergency_contact_contact_number: s(emp?.emergency_contact?.contact_number),
      emergency_contact_address: s(emp?.emergency_contact?.address),
    },
  });

  /* ------------ validators ------------ */
  const isEmpty = (v: string) => !v || v.trim().length === 0;
  const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // Watch values and emit patches
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === 'change' && name) {
        // Handle emergency contact fields - emit whole object
        if (name.startsWith('emergency_contact_')) {
          const ec = {
            name: value.emergency_contact_name || '',
            relation: value.emergency_contact_relation || '',
            contact_number: value.emergency_contact_contact_number || '',
            address: value.emergency_contact_address || '',
          };
          onPatchChange?.({ emergency_contact: ec });
        }
        // Handle birthdate - convert to ISO string
        else if (name === 'birthdate') {
          const date = value[name];
          onPatchChange?.({ [name]: date ? date.toISOString().split('T')[0] : null });
        }
        // Handle other fields
        else {
          onPatchChange?.({ [name]: value[name] });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onPatchChange]);

  // Aggregate errors (ignore "missing" or "required" messages)
  const isBlockingError = (m?: string) =>
    !!m && !/(missing|required)/i.test(m);

  const hasErrors = useMemo(() => {
    const allErrors = Object.values(errors);
    return allErrors.some((error: any) => isBlockingError(error?.message));
  }, [errors]);

  useEffect(() => {
    onErrorsChange?.(hasErrors);
  }, [hasErrors]);

  // Trigger initial validation
  useEffect(() => {
    trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // gate error display when not editing
  const showErr = (fieldName: string) =>
    editing ? (errors as any)[fieldName]?.message || null : null;

  return (
    <>
      <Section>
        <Grid>
          {/* Read-only name fields */}
          <Field dataTestid="first-name-field" label="First Name" value={firstname} disabled />
          <Field dataTestid="middle-name-field" label="Middle Name" value={middlename} disabled />
          <Field dataTestid="last-name-field" label="Last Name" value={lastname} disabled />

          {/* Email Field */}
          <div data-testid="email-field">
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email Address
              <span className="ml-0.5 text-red-600">*</span>
            </label>
            <div className="mt-2">
              <input
                id="email"
                {...register("email", {
                  required: "Email is required.",
                  validate: (v: string) => {
                    if (!v || v.trim().length === 0) return "Email is required.";
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return "Invalid email address.";
                    return true;
                  },
                })}
                type="email"
                disabled={!editing}
                className={`block w-full rounded-md border px-3 py-2 text-sm outline-none placeholder:text-gray-400 ${
                  !editing
                    ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    : errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#355fd0]"
                }`}
              />
              {editing && errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>
          {/* Address Field */}
          <div data-testid="address-field" className="sm:col-span-2">
            <label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="mt-2">
              <input
                id="address"
                {...register("address")}
                type="text"
                placeholder="House/Unit, Street, Barangay, City, Province"
                disabled={!editing}
                className={`block w-full rounded-md border px-3 py-2 text-sm outline-none placeholder:text-gray-400 ${
                  !editing
                    ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "border-gray-300 focus:border-[#355fd0]"
                }`}
              />
              <p className="mt-1 text-xs text-gray-500">House/Unit, Street, Barangay, City, Province</p>
            </div>
          </div>
          {/* Mobile Field */}
          <div data-testid="contact-no-field">
            <label htmlFor="mobile" className="mb-1 block text-sm font-medium text-gray-700">
              Contact Number
              <span className="ml-0.5 text-red-600">*</span>
            </label>
            <div className="mt-2">
              <input
                id="mobile"
                {...register("mobile", {
                  required: "Contact Number is required.",
                  validate: (v: string) => {
                    const digits = (v || '').replace(/\D/g, "");
                    if (digits.length === 0) return "Contact Number is required.";
                    return true;
                  },
                })}
                type="text"
                disabled={!editing}
                className={`block w-full rounded-md border px-3 py-2 text-sm outline-none placeholder:text-gray-400 ${
                  !editing
                    ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    : errors.mobile
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#355fd0]"
                }`}
              />
              {editing && errors.mobile ? (
                <p className="mt-1 text-xs text-red-600">{errors.mobile.message}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">Digits only</p>
              )}
            </div>
          </div>

          {/* Birthdate Field */}
          <Controller
            name="birthdate"
            control={control}
            render={({ field }) => (
              <div data-testid="birthdate-field">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Birthdate
                </label>
                <div className="relative">
                  <CustomDatePicker
                    id="employee-birthdate-datepicker"
                    placeholder="mm/dd/yyyy"
                    className={`block w-full rounded-md border px-3 py-2 text-sm outline-none placeholder:text-gray-400 ${
                      !editing
                        ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "border-gray-300 focus:border-[#355fd0]"
                    }`}
                    selected={field.value}
                    pickerOnChange={(date: Date | null) => field.onChange(date)}
                    inputOnChange={(date: Date | null) => field.onChange(date)}
                    disabled={!editing}
                  />
                </div>
              </div>
            )}
          />

          {/* Gender Field */}
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <div data-testid="gender-field">
                <label htmlFor="gender" className="mb-1 block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!editing}
                    className={`rounded-md appearance-none w-full border px-3 py-2 text-sm outline-none ${
                      !editing
                        ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "border-gray-300 focus:border-[#355fd0]"
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <div className="absolute right-3 top-[10px] pointer-events-none">
                    <SelectChevronDown />
                  </div>
                </div>
              </div>
            )}
          />
        </Grid>
      </Section>

      <Section title="Government IDs">
        <Grid>
          <Controller
            name="tin"
            control={control}
            rules={{
              required: "TIN is missing.",
              validate: (v: string) => {
                const digits = (v || '').replace(/\D/g, "");
                if (!/^\d+$/.test(digits)) return "TIN must contain digits only.";
                if (digits.length !== 12) return "TIN must be 12 digits.";
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <div data-testid="tin-field">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  TIN <span className="ml-0.5 text-red-600">*</span>
                </label>
                <input
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    field.onChange(val);
                  }}
                  onBlur={field.onBlur}
                  disabled={!editing}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none ${
                    !editing
                      ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                      : fieldState.error
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-[#355fd0]"
                  }`}
                />
                {fieldState.error ? (
                  <p className="mt-1 text-xs text-red-600">{fieldState.error.message}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">12 digits only</p>
                )}
              </div>
            )}
          />
          <Controller
            name="sss"
            control={control}
            rules={{
              required: "SSS is missing.",
              validate: (v: string) => {
                const digits = (v || '').replace(/\D/g, "");
                if (!/^\d+$/.test(digits)) return "SSS must contain digits only.";
                if (digits.length !== 10) return "SSS must be 10 digits.";
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <div data-testid="sss-field">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  SSS <span className="ml-0.5 text-red-600">*</span>
                </label>
                <input
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    field.onChange(val);
                  }}
                  onBlur={field.onBlur}
                  disabled={!editing}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none ${
                    !editing
                      ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                      : fieldState.error
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-[#355fd0]"
                  }`}
                />
                {fieldState.error ? (
                  <p className="mt-1 text-xs text-red-600">{fieldState.error.message}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">10 digits only</p>
                )}
              </div>
            )}
          />
          <Controller
            name="pagibig"
            control={control}
            rules={{
              required: "PAG-IBIG is missing.",
              validate: (v: string) => {
                const digits = (v || '').replace(/\D/g, "");
                if (!/^\d+$/.test(digits)) return "PAG-IBIG must contain digits only.";
                if (digits.length !== 12) return "PAG-IBIG must be 12 digits.";
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <div data-testid="pagibig-field">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  PAG-IBIG <span className="ml-0.5 text-red-600">*</span>
                </label>
                <input
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    field.onChange(val);
                  }}
                  onBlur={field.onBlur}
                  disabled={!editing}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none ${
                    !editing
                      ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                      : fieldState.error
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-[#355fd0]"
                  }`}
                />
                {fieldState.error ? (
                  <p className="mt-1 text-xs text-red-600">{fieldState.error.message}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">12 digits only</p>
                )}
              </div>
            )}
          />
          <Controller
            name="philhealth"
            control={control}
            rules={{
              required: "PhilHealth is missing.",
              validate: (v: string) => {
                const digits = (v || '').replace(/\D/g, "");
                if (!/^\d+$/.test(digits)) return "PhilHealth must contain digits only.";
                if (digits.length !== 12) return "PhilHealth must be 12 digits.";
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <div data-testid="philhealth-field">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  PhilHealth <span className="ml-0.5 text-red-600">*</span>
                </label>
                <input
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    field.onChange(val);
                  }}
                  onBlur={field.onBlur}
                  disabled={!editing}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none ${
                    !editing
                      ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                      : fieldState.error
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-[#355fd0]"
                  }`}
                />
                {fieldState.error ? (
                  <p className="mt-1 text-xs text-red-600">{fieldState.error.message}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">12 digits only</p>
                )}
              </div>
            )}
          />
        </Grid>
      </Section>

      <Section title="Emergency Contact">
        <Grid>
          {/* Emergency Contact Name Field */}
          <div data-testid="emergency-name-field">
            <label htmlFor="emergency_contact_name" className="mb-1 block text-sm font-medium text-gray-700">
              Name
              <span className="ml-0.5 text-red-600">*</span>
            </label>
            <div className="mt-2">
              <input
                id="emergency_contact_name"
                {...register("emergency_contact_name", {
                  required: "Emergency Contact Name is missing.",
                })}
                type="text"
                disabled={!editing}
                className={`block w-full rounded-md border px-3 py-2 text-sm outline-none placeholder:text-gray-400 ${
                  !editing
                    ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    : errors.emergency_contact_name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#355fd0]"
                }`}
              />
              {editing && errors.emergency_contact_name && (
                <p className="mt-1 text-xs text-red-600">{errors.emergency_contact_name.message}</p>
              )}
            </div>
          </div>
          {/* Emergency Contact Relation Field */}
          <div data-testid="emergency-relation-field">
            <label htmlFor="emergency_contact_relation" className="mb-1 block text-sm font-medium text-gray-700">
              Relation
            </label>
            <div className="mt-2">
              <input
                id="emergency_contact_relation"
                {...register("emergency_contact_relation")}
                type="text"
                disabled={!editing}
                className={`block w-full rounded-md border px-3 py-2 text-sm outline-none placeholder:text-gray-400 ${
                  !editing
                    ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "border-gray-300 focus:border-[#355fd0]"
                }`}
              />
            </div>
          </div>
          <Controller
            name="emergency_contact_contact_number"
            control={control}
            rules={{
              required: "Emergency Contact Number is missing.",
              validate: (v: string) => {
                const digits = (v || '').replace(/\D/g, "");
                if (!/^\d+$/.test(digits)) return "Emergency Contact Number must be digits only.";
                if (digits.length !== 11) return "Emergency Contact Number must be exactly 11 digits.";
                if (!digits.startsWith("09")) return "Emergency Contact Number must start with '09'.";
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <div data-testid="emergency-no-field">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Contact Number <span className="ml-0.5 text-red-600">*</span>
                </label>
                <input
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    field.onChange(val);
                  }}
                  onBlur={field.onBlur}
                  disabled={!editing}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none ${
                    !editing
                      ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                      : fieldState.error
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-[#355fd0]"
                  }`}
                />
                {fieldState.error ? (
                  <p className="mt-1 text-xs text-red-600">{fieldState.error.message}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Digits only (11 digits, starts with &apos;09&apos;)</p>
                )}
              </div>
            )}
          />
          {/* Emergency Contact Address Field */}
          <div data-testid="emergency-address-field" className="sm:col-span-2">
            <label htmlFor="emergency_contact_address" className="mb-1 block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="mt-2">
              <input
                id="emergency_contact_address"
                {...register("emergency_contact_address")}
                type="text"
                disabled={!editing}
                className={`block w-full rounded-md border px-3 py-2 text-sm outline-none placeholder:text-gray-400 ${
                  !editing
                    ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "border-gray-300 focus:border-[#355fd0]"
                }`}
              />
            </div>
          </div>
        </Grid>
      </Section>
    </>
  );
}
