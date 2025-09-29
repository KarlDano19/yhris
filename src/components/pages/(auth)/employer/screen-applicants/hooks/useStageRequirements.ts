import { useMutation, useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

// Get stage requirements and their completion status for a specific stage
async function getStageRequirements(appliedJobId: number, stageId: number) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/stage-requirements/${appliedJobId}/?stage_id=${stageId}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  
  return await res.json();
}

// Update stage requirements completion status
async function updateStageRequirements(appliedJobId: number, requirementStatuses: Record<string, boolean>) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/stage-requirements/${appliedJobId}/`, {
    method: "PATCH",
    body: JSON.stringify({ requirement_statuses: requirementStatuses }),
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  
  return await res.json();
}

// Get stage notes for an application
async function getStageNotes(appliedJobId: number) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/stage-notes/${appliedJobId}/`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  
  return await res.json();
}

// Create or update stage notes
async function updateStageNotes(appliedJobId: number, stageId: number, notes: string) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/stage-notes/${appliedJobId}/`, {
    method: "POST",
    body: JSON.stringify({ 
      stage_id: stageId,
      notes: notes
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  
  return await res.json();
}

// Get application audit history
async function getApplicationAuditHistory(appliedJobId: number) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/audit-history/${appliedJobId}/`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  
  return await res.json();
}

function useGetStageRequirements(appliedJobId: number, stageId: number, enabled: boolean = true) {
  const query = useQuery({
    queryKey: ['stage-requirements', appliedJobId, stageId],
    queryFn: () => getStageRequirements(appliedJobId, stageId),
    enabled: enabled && !!appliedJobId && !!stageId,
  });

  return query;
}

function useUpdateStageRequirements() {
  const mutation = useMutation({
    mutationFn: ({ appliedJobId, requirementStatuses }: { appliedJobId: number; requirementStatuses: Record<string, boolean> }) =>
      updateStageRequirements(appliedJobId, requirementStatuses),
  });

  return mutation;
}

function useGetStageNotes(appliedJobId: number, enabled: boolean = true) {
  const query = useQuery({
    queryKey: ['stage-notes', appliedJobId],
    queryFn: () => getStageNotes(appliedJobId),
    enabled: enabled && !!appliedJobId,
  });

  return query;
}

function useUpdateStageNotes() {
  const mutation = useMutation({
    mutationFn: ({ 
      appliedJobId, 
      stageId, 
      notes
    }: { 
      appliedJobId: number; 
      stageId: number; 
      notes: string; 
    }) =>
      updateStageNotes(appliedJobId, stageId, notes),
  });

  return mutation;
}

function useGetApplicationAuditHistory(appliedJobId: number, enabled: boolean = true) {
  const query = useQuery({
    queryKey: ['application-audit-history', appliedJobId],
    queryFn: () => getApplicationAuditHistory(appliedJobId),
    enabled: enabled && !!appliedJobId,
  });

  return query;
}

export { 
  useGetStageRequirements, 
  useUpdateStageRequirements,
  useGetStageNotes,
  useUpdateStageNotes,
  useGetApplicationAuditHistory
}; 