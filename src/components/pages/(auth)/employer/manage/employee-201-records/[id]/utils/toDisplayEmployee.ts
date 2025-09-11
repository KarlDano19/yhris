import type { Employee } from "@/types/employee-201-records/employee";

export function toDisplayEmployee(
  data?: Partial<Employee>,
  emp?: Partial<Employee>
) {
  // progress percentage from API
  const rawPercent =
    (typeof data?.progressPercentage === "number"
      ? data.progressPercentage
      : undefined) ??
    (typeof emp?.progressPercentage === "number"
      ? emp.progressPercentage
      : undefined);

  const progress = Math.max(0, Math.min(100, rawPercent ?? 0));

  // complete flag from API
  const explicitComplete =
    typeof data?.hasCompleteRecords === "boolean"
      ? data.hasCompleteRecords
      : typeof emp?.hasCompleteRecords === "boolean"
      ? emp.hasCompleteRecords
      : undefined;

  const complete = explicitComplete ?? progress === 100;

  // names & email
  const firstName = data?.firstname ?? emp?.firstname ?? "";
  const lastName = data?.lastname ?? emp?.lastname ?? "";
  const email = data?.email ?? emp?.email ?? null;

  // department & position
  const jobTitle = data?.position ?? emp?.position ?? "";
  const displayDept = data?.department ?? emp?.department ?? "";

  const name =
    data?.firstname ||
    emp?.firstname
      ? `${firstName}${lastName ? " " + lastName : ""}`.trim()
      : "";

  // --- avatar logic: prefer photo, fallback to gender placeholder ---
  const photo = data?.photo ?? emp?.photo ?? null;
  const gender = data?.gender ?? emp?.gender ?? null;

  return {
    name: name || null,
    role: jobTitle || displayDept ? `${jobTitle} (${displayDept})` : null,
    complete,
    progress,
    photo,   // photo URL (may be null/undefined)
    gender,  // "male" | "female" or null
    email,
  };
}
