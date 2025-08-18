import type { Employee } from "@/types/employee-201-records/employee";

export function toDisplayEmployee(
  data?: Partial<Employee>,
  emp?: Partial<Employee>
) {
  const rawPercent =
    (typeof data?.percent === "number" ? data?.percent : undefined) ??
    (typeof emp?.percent === "number" ? emp?.percent : undefined);

  const progress = Math.max(0, Math.min(100, rawPercent ?? 35));

  const explicitComplete =
    typeof data?.complete === "boolean"
      ? data.complete
      : typeof emp?.complete === "boolean"
      ? emp.complete
      : undefined;

  const complete = explicitComplete ?? progress === 100;

  const firstName = data?.firstName ?? emp?.firstName ?? "Bianca";
  const lastName = data?.lastName ?? emp?.lastName ?? "Reyes";
  const email = data?.email ?? emp?.email ?? "biancareyes@abba.works";

  const jobTitle = data?.jobTitle ?? emp?.jobTitle ?? "Accounting Officer";
  const displayDept = data?.displayDept ?? emp?.displayDept ?? "Accounting";

  const name =
    data?.name ?? emp?.name ?? `${firstName}${lastName ? " " + lastName : ""}`;

  const avatar = data?.avatar ?? emp?.avatar ?? "/assets/placeholder2.png";

  return {
    name,
    role: `${jobTitle} (${displayDept})`,
    complete,
    progress,
    avatar,
    email,
  };
}