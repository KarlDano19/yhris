

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface JobStateContextType {
  acceptedJobIds: Set<number>;
  acceptJob: (jobId: number) => void;
  isJobAccepted: (jobId: number) => boolean;
}

const JobStateContext = createContext<JobStateContextType | undefined>(undefined);

export const JobStateProvider = ({ children }: { children: ReactNode }) => {
  const [acceptedJobIds, setAcceptedJobIds] = useState<Set<number>>(new Set());

  const acceptJob = useCallback((jobId: number) => {
    setAcceptedJobIds((prev) => new Set(prev).add(jobId));
  }, []);

  const isJobAccepted = useCallback((jobId: number) => {
    return acceptedJobIds.has(jobId);
  }, [acceptedJobIds]);

  return (
    <JobStateContext.Provider
      value={{
        acceptedJobIds,
        acceptJob,
        isJobAccepted,
      }}
    >
      {children}
    </JobStateContext.Provider>
  );
};

export const useJobState = () => {
  const context = useContext(JobStateContext);
  if (context === undefined) {
    throw new Error('useJobState must be used within a JobStateProvider');
  }
  return context;
};

