import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export interface BulkSyncData {
  sync_type: "all" | "active" | "inactive";
  sync_mode: "all" | "changed" | "specific_ids";
  employee_ids?: number[];
}

export interface BulkSyncResponse {
  message: string;
  total_sent: number;
  sync_type: string;
  sync_mode: string;
  payroll_response: {
    message: string;
    sync_type: string;
    total_synced: number;
    created: number;
    updated: number;
    error_count: number;
  };
  summary: {
    created: number;
    updated: number;
    errors: number;
    total_processed: number;
  };
}

async function bulkSyncEmployeesToYP(syncData: BulkSyncData): Promise<BulkSyncResponse> {
  try {
    console.log("bulkSyncEmployeesToYP", syncData);
    const token = getCookie("token");
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(syncData),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/bulk-push-to-payroll/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, "response")) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useBulkSyncToYP() {
  const query = useMutation((syncData: BulkSyncData) => bulkSyncEmployeesToYP(syncData));

  return query;
}

export default useBulkSyncToYP;
