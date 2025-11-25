// Utility functions for role pipeline table calculations

export interface RolePipelineData {
  role: string;
  numberOfApplicants: number;
  status: string;
  dateJobOpened: string;
  dateJobClosed: string;
  turnaroundTime: number;
  currentPipeline: string;
  jobId?: number;
}

export interface PipelineData {
  [jobId: number]: { [stageTitle: string]: number };
}

export interface ProcessedRolePipelineData {
  role: string;
  numberOfApplicants: number;
  status: string;
  dateJobOpened: string;
  dateJobClosed: string;
  turnaroundTime: number;
  currentPipeline: string;
  jobId: number;
}

export const formatTurnaroundTime = (days: number): string => {
  if (days === 0) return 'Today';
  if (days === 1) return '1 day';
  return `${days} days`;
};

export const formatPipelineInfo = (
  pipeline: string, 
  applicants: number, 
  jobId?: number, 
  pipelineData?: PipelineData
): string => {
  if (applicants === 0) return 'No applicants yet';
  
  if (jobId && pipelineData && pipelineData[jobId]) {
    const stageEntries = Object.entries(pipelineData[jobId]);
    if (stageEntries.length === 0) {
      return pipeline;
    }

    const [stage, count] = stageEntries[0];
    const firstStage = `${stage}: ${count}`;
    return stageEntries.length > 1 ? `${firstStage}, ...` : firstStage;
  }
  
  if (applicants === 1) return '1';
  return pipeline;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Ongoing':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'Closed':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'Draft':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    case 'Expired':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const processRolePipelineData = (
  rolePipelineData?: RolePipelineData[],
  pipelineData?: PipelineData
): ProcessedRolePipelineData[] => {
  if (!rolePipelineData || !Array.isArray(rolePipelineData)) {
    return [];
  }

  return rolePipelineData.map((job: RolePipelineData) => {
    // Format pipeline info with stage breakdown if available
    let currentPipeline = job.currentPipeline || 'No applicants yet';
    if (job.numberOfApplicants > 0 && pipelineData && pipelineData[job.jobId!]) {
      const stageBreakdown = Object.entries(pipelineData[job.jobId!])
        .map(([stage, count]) => `${stage}: ${count}`)
        .join(', ');
      currentPipeline = stageBreakdown;
    }

    return {
      role: job.role || 'Unknown Role',
      numberOfApplicants: job.numberOfApplicants || 0,
      status: job.status || 'Unknown',
      dateJobOpened: job.dateJobOpened || 'Unknown',
      dateJobClosed: job.dateJobClosed || 'Unknown',
      turnaroundTime: job.turnaroundTime || 0,
      currentPipeline: currentPipeline,
      jobId: job.jobId || 0
    };
  });
};