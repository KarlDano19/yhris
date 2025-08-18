import type { Employee } from "@/types/employee-201-records/employee";
import EmployeeTile from "./EmployeeTile";

type Props = { employees: Employee[] };
export default function EmployeeGrid({ employees }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      {employees.map((e) => (<EmployeeTile key={e.id} emp={e} />))}
    </div>
  );
}
