import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export type DisciplinaryRecordDetail = {
  id: number;
  nte_id: string | null;
  incident_date: string;
  employee: number;
  employee_name: string;
  email: string | null;
  position: string | null;
  department: string | null;
  place_of_incident: string | null;
  brief_background: string | null;
  issue_type: string | null;
  status: "pending" | "approved" | "disapproved";
  prepared_by: string | null;
  response: string | null;
  is_responded: boolean;
  is_nte_sent: boolean;
  is_nte_received: boolean;
  is_decision_sent: boolean;
  is_decision_received: boolean;
  incident_received_date: string | null;
  decision_received_date: string | null;
  nte_attachment: string | null;
  decision_attachment: string | null;
  investigation_decision: string | null;
  investigation_custom_decision: string | null;
};

async function getDisciplinaryRecordDetail(
  recordId: number | null
): Promise<DisciplinaryRecordDetail> {
  const token = getCookie("token");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/employee-issues/attachments/${recordId}/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );
  if (!res.ok) {
    let msg = `Failed to load incident details (${res.status}).`;
    try {
      const problem = await res.json();
      msg = problem?.message || problem?.detail || msg;
    } catch {}
    throw new Error(msg);
  }
  const payload = await res.json();
  return payload?.data || payload;
}

function useGetDisciplinaryRecordDetail(recordId: number | null) {
  return useQuery(
    ["disciplinaryRecordDetailCache", recordId],
    () => getDisciplinaryRecordDetail(recordId),
    {
      enabled: !!recordId,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
}

export default useGetDisciplinaryRecordDetail;
