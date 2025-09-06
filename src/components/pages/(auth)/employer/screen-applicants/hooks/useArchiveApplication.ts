import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function archiveApplication(appliedJobId: number) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/archive/${appliedJobId}/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to archive application');
  }
  
  return await res.json();
}

async function unarchiveApplication(appliedJobId: number, fallbackStageId?: number) {
  const token = getCookie('token');
  const body = fallbackStageId ? { fallback_stage_id: fallbackStageId } : {};
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/archive/${appliedJobId}/`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to unarchive application');
  }
  
  return await res.json();
}

async function batchUnarchiveApplications(
  appliedJobIds: number[], 
  fallbackStageId: number, 
  progressCallback?: (processed: number) => void
) {
  const token = getCookie('token');
  const body = { 
    applied_job_ids: appliedJobIds,
    fallback_stage_id: fallbackStageId 
  };
  
  try {
    // First, try with the batch API endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/archive/batch/`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    });
    
    if (res.ok) {
      return await res.json();
    }
    
    // If batch endpoint fails with 404, fall back to sequential processing
    if (res.status === 404) {
      console.warn('Batch unarchive endpoint not available, falling back to sequential processing');
      const results = [];
      let processed = 0;
      
      // Process each application sequentially
      for (const appliedJobId of appliedJobIds) {
        try {
          const result = await unarchiveApplication(appliedJobId, fallbackStageId);
          results.push(result);
        } catch (error) {
          console.error(`Failed to unarchive application ${appliedJobId}:`, error);
        }
        
        processed++;
        if (progressCallback) {
          progressCallback(processed);
        }
      }
      
      return {
        message: 'Sequential unarchive completed',
        results
      };
    }
    
    // For other errors, throw normally
    const error = await res.json();
    throw new Error(error.message || 'Failed to batch unarchive applications');
    
  } catch (error) {
    console.error('Batch unarchive error:', error);
    throw error;
  }
}

function useArchiveApplication() {
  const archiveQuery = useMutation({
    mutationFn: (appliedJobId: number) => archiveApplication(appliedJobId),
  });
  
  const unarchiveQuery = useMutation({
    mutationFn: ({ appliedJobId, fallbackStageId }: { appliedJobId: number; fallbackStageId?: number }) => 
      unarchiveApplication(appliedJobId, fallbackStageId),
  });
  
  const batchUnarchiveQuery = useMutation({
    mutationFn: ({ appliedJobIds, fallbackStageId, progressCallback }: 
      { appliedJobIds: number[]; fallbackStageId: number; progressCallback?: (processed: number) => void }) => 
      batchUnarchiveApplications(appliedJobIds, fallbackStageId, progressCallback),
  });

  return {
    archive: (appliedJobId: number, options?: any) => archiveQuery.mutate(appliedJobId, options),
    unarchive: (appliedJobId: number, fallbackStageId?: number, options?: any) => 
      unarchiveQuery.mutate({ appliedJobId, fallbackStageId }, options),
    unarchiveBatch: (appliedJobIds: number[], fallbackStageId: number, options?: any) => {
      const progressCallback = options?.onProgress;
      batchUnarchiveQuery.mutate({ appliedJobIds, fallbackStageId, progressCallback }, options);
    },
    isArchiving: archiveQuery.isLoading,
    isUnarchiving: unarchiveQuery.isLoading || batchUnarchiveQuery.isLoading,
  };
}

export default useArchiveApplication; 