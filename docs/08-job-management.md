# Job Management Documentation

## Overview

The Job Management system in Yahshua HRIS handles the complete job lifecycle from posting to hiring, including applicant screening, interview scheduling, and hiring workflows. It supports multiple job types, complex approval processes, and comprehensive reporting.

## Job Creation and Management

### Job Posting Structure

```typescript
interface JobPosting extends T_CreateJob {
  id: number;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  applicationsCount: number;
  viewsCount: number;
  isUrgent: boolean;
  expiresAt: string;
  approvalStatus: 'draft' | 'pending' | 'approved' | 'rejected';
}

type JobStatus = 'draft' | 'published' | 'paused' | 'closed' | 'expired';

interface JobRequirements {
  education: string[];
  experience: {
    minimum: number;
    preferred: number;
    unit: 'months' | 'years';
  };
  skills: string[];
  certifications: string[];
  languages: string[];
}
```

### Job Creation Workflow

```typescript
function useJobCreation() {
  const [jobData, setJobData] = useState<Partial<T_CreateJob>>({
    jobTitle: '',
    jobDescription: '',
    qualifications: '',
    jobType: [],
    schedule: [],
    benefits: [],
    salary: {
      salaryType: 'fixed',
      salaryValue: '',
    },
    hireCount: 1,
    hireDate: '',
    country: '',
    language: 'en',
  });

  const { mutate: createJob, isLoading } = useMutation({
    mutationFn: async (data: T_CreateJob) => {
      const token = getCookie('token');
      const response = await fetch('/api/jobs/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create job');
      }
      
      return response.json();
    },
    onSuccess: (newJob) => {
      toast.success('Job created successfully!');
      queryClient.invalidateQueries(['jobs']);
      
      // Redirect to job management or continue with setup
      router.push(`/manage-jobs/${newJob.id}`);
    },
  });

  const validateJobData = useCallback((data: Partial<T_CreateJob>): ValidationResult => {
    const errors: string[] = [];
    
    if (!data.jobTitle?.trim()) errors.push('Job title is required');
    if (!data.jobDescription?.trim()) errors.push('Job description is required');
    if (!data.qualifications?.trim()) errors.push('Qualifications are required');
    if (!data.jobType?.length) errors.push('At least one job type is required');
    if (!data.schedule?.length) errors.push('At least one schedule is required');
    if (!data.hireDate) errors.push('Hire date is required');
    if (!data.salary?.salaryValue) errors.push('Salary information is required');
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }, []);

  const saveDraft = useCallback(() => {
    const draftData = { ...jobData, status: 'draft' as JobStatus };
    createJob(draftData as T_CreateJob);
  }, [jobData, createJob]);

  const publishJob = useCallback(() => {
    const validation = validateJobData(jobData);
    if (!validation.isValid) {
      toast.error(`Please fix the following errors: ${validation.errors.join(', ')}`);
      return;
    }
    
    const publishData = { ...jobData, status: 'published' as JobStatus };
    createJob(publishData as T_CreateJob);
  }, [jobData, validateJobData, createJob]);

  return {
    jobData,
    setJobData,
    createJob,
    saveDraft,
    publishJob,
    validateJobData,
    isLoading,
  };
}
```

### Job Templates

```typescript
interface JobTemplate {
  id: string;
  name: string;
  category: string;
  template: Partial<T_CreateJob>;
  isDefault: boolean;
}

function useJobTemplates() {
  const { data: templates } = useQuery({
    queryKey: ['jobTemplates'],
    queryFn: async () => {
      const response = await fetch('/api/job-templates/');
      return response.json();
    },
  });

  const predefinedTemplates: JobTemplate[] = [
    {
      id: 'software-engineer',
      name: 'Software Engineer',
      category: 'Technology',
      isDefault: true,
      template: {
        jobTitle: 'Software Engineer',
        jobType: ['Full-time'],
        schedule: ['Day shift'],
        qualifications: QUALIFICATION_TEMPLATE[0],
        benefits: ['Health Insurance', '401k', 'Paid Time Off'],
      },
    },
    {
      id: 'marketing-manager',
      name: 'Marketing Manager',
      category: 'Marketing',
      isDefault: true,
      template: {
        jobTitle: 'Marketing Manager',
        jobType: ['Full-time'],
        schedule: ['Day shift'],
        qualifications: '<ul><li>Bachelor\'s degree in Marketing or related field</li><li>3+ years of marketing experience</li><li>Strong communication skills</li></ul>',
        benefits: ['Health Insurance', 'Professional Development', 'Flexible Schedule'],
      },
    },
  ];

  const createFromTemplate = useCallback((templateId: string) => {
    const template = [...predefinedTemplates, ...(templates || [])]
      .find(t => t.id === templateId);
    
    if (template) {
      return {
        ...template.template,
        JobNo: generateJobNumber(),
        hireDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      };
    }
    
    return null;
  }, [templates]);

  return {
    templates: [...predefinedTemplates, ...(templates || [])],
    createFromTemplate,
  };
}
```

## Applicant Management

### Application Tracking

```typescript
interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  status: ApplicationStatus;
  submittedAt: string;
  lastUpdated: string;
  rating: number;
  notes: string;
  resume: string;
  coverLetter: string;
  customResponses: Record<string, any>;
  stageHistory: ApplicationStageHistory[];
}

interface ApplicationStageHistory {
  stage: ApplicationStatus;
  timestamp: string;
  updatedBy: string;
  notes?: string;
}

type ApplicationStatus = 
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'interviewed'
  | 'reference_check'
  | 'offer_extended'
  | 'offer_accepted'
  | 'offer_declined'
  | 'hired'
  | 'rejected';
```

### Application Screening System

```typescript
function useApplicationScreening(jobId: string) {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications', jobId],
    queryFn: async () => {
      const token = getCookie('token');
      const response = await fetch(`/api/jobs/${jobId}/applications/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      return response.json();
    },
  });

  const { mutate: updateApplicationStatus } = useMutation({
    mutationFn: async ({ 
      applicationId, 
      status, 
      notes 
    }: { 
      applicationId: string; 
      status: ApplicationStatus;
      notes?: string;
    }) => {
      const token = getCookie('token');
      const response = await fetch(`/api/applications/${applicationId}/status/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['applications', jobId]);
    },
  });

  const { mutate: rateApplication } = useMutation({
    mutationFn: async ({ applicationId, rating }: { applicationId: string; rating: number }) => {
      const token = getCookie('token');
      const response = await fetch(`/api/applications/${applicationId}/rate/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['applications', jobId]);
    },
  });

  const bulkUpdateApplications = useCallback(async (
    applicationIds: string[], 
    status: ApplicationStatus,
    notes?: string
  ) => {
    const token = getCookie('token');
    
    await Promise.all(
      applicationIds.map(id =>
        fetch(`/api/applications/${id}/status/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status, notes }),
        })
      )
    );
    
    queryClient.invalidateQueries(['applications', jobId]);
    toast.success(`${applicationIds.length} applications updated`);
  }, [jobId, queryClient]);

  return {
    applications,
    isLoading,
    updateApplicationStatus,
    rateApplication,
    bulkUpdateApplications,
  };
}
```

### Interview Scheduling

```typescript
interface Interview {
  id: string;
  applicationId: string;
  type: 'phone' | 'video' | 'in_person';
  scheduledAt: string;
  duration: number;
  interviewers: string[];
  meetingLink?: string;
  location?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  feedback?: InterviewFeedback;
}

interface InterviewFeedback {
  overallRating: number;
  technicalSkills: number;
  communication: number;
  culturalFit: number;
  comments: string;
  recommendation: 'hire' | 'no_hire' | 'maybe';
  nextSteps?: string;
}

function useInterviewScheduling() {
  const { mutate: scheduleInterview } = useMutation({
    mutationFn: async (interviewData: Omit<Interview, 'id' | 'status'>) => {
      const token = getCookie('token');
      const response = await fetch('/api/interviews/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interviewData),
      });
      
      return response.json();
    },
    onSuccess: (interview) => {
      toast.success('Interview scheduled successfully');
      
      // Send calendar invite
      sendCalendarInvite(interview);
      
      // Send notification to applicant
      sendInterviewNotification(interview);
      
      queryClient.invalidateQueries(['interviews']);
    },
  });

  const { mutate: submitFeedback } = useMutation({
    mutationFn: async ({ 
      interviewId, 
      feedback 
    }: { 
      interviewId: string; 
      feedback: InterviewFeedback;
    }) => {
      const token = getCookie('token');
      const response = await fetch(`/api/interviews/${interviewId}/feedback/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Interview feedback submitted');
      queryClient.invalidateQueries(['interviews']);
    },
  });

  const generateCalendarInvite = useCallback((interview: Interview) => {
    const startDate = new Date(interview.scheduledAt);
    const endDate = new Date(startDate.getTime() + interview.duration * 60000);
    
    const event = {
      title: `Interview - ${interview.applicationId}`,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      attendees: interview.interviewers,
      location: interview.location || interview.meetingLink,
      description: `Interview for application ${interview.applicationId}`,
    };
    
    return event;
  }, []);

  return {
    scheduleInterview,
    submitFeedback,
    generateCalendarInvite,
  };
}
```

## Job Analytics and Reporting

### Job Performance Metrics

```typescript
interface JobMetrics {
  jobId: string;
  views: number;
  applications: number;
  conversionRate: number;
  averageTimeToHire: number;
  costPerHire: number;
  sourceBreakdown: Record<string, number>;
  qualityScore: number;
  retentionRate: number;
}

function useJobAnalytics(jobId?: string) {
  const { data: metrics } = useQuery({
    queryKey: ['jobMetrics', jobId],
    queryFn: async () => {
      const token = getCookie('token');
      const url = jobId 
        ? `/api/jobs/${jobId}/metrics/`
        : '/api/jobs/metrics/';
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      
      return response.json();
    },
  });

  const calculateMetrics = useCallback((applications: JobApplication[]): JobMetrics => {
    const totalApplications = applications.length;
    const hiredCount = applications.filter(app => app.status === 'hired').length;
    const averageRating = applications.reduce((sum, app) => sum + app.rating, 0) / totalApplications;
    
    const timeToHire = applications
      .filter(app => app.status === 'hired')
      .map(app => {
        const submitted = new Date(app.submittedAt);
        const hired = new Date(app.lastUpdated);
        return hired.getTime() - submitted.getTime();
      })
      .reduce((sum, time, _, arr) => sum + time / arr.length, 0);

    return {
      jobId: jobId || '',
      views: 0, // Would come from server
      applications: totalApplications,
      conversionRate: totalApplications > 0 ? (hiredCount / totalApplications) * 100 : 0,
      averageTimeToHire: timeToHire / (1000 * 60 * 60 * 24), // Convert to days
      costPerHire: 0, // Would need cost data
      sourceBreakdown: {}, // Would come from server
      qualityScore: averageRating,
      retentionRate: 0, // Would need retention data
    };
  }, [jobId]);

  return {
    metrics,
    calculateMetrics,
  };
}
```

### Recruitment Funnel Analysis

```typescript
interface RecruitmentFunnel {
  stage: ApplicationStatus;
  count: number;
  percentage: number;
  dropoffRate: number;
}

function useRecruitmentFunnel(jobId: string) {
  const { data: applications } = useQuery({
    queryKey: ['applications', jobId],
    queryFn: () => fetchJobApplications(jobId),
  });

  const funnelData = useMemo((): RecruitmentFunnel[] => {
    if (!applications) return [];

    const stages: ApplicationStatus[] = [
      'submitted',
      'under_review',
      'shortlisted',
      'interview_scheduled',
      'interviewed',
      'offer_extended',
      'hired',
    ];

    const stageCounts = stages.map(stage => ({
      stage,
      count: applications.filter(app => 
        app.stageHistory.some(history => history.stage === stage)
      ).length,
    }));

    const totalApplications = stageCounts[0]?.count || 1;

    return stageCounts.map((stageData, index) => {
      const percentage = (stageData.count / totalApplications) * 100;
      const previousCount = index > 0 ? stageCounts[index - 1].count : totalApplications;
      const dropoffRate = previousCount > 0 
        ? ((previousCount - stageData.count) / previousCount) * 100 
        : 0;

      return {
        ...stageData,
        percentage,
        dropoffRate,
      };
    });
  }, [applications]);

  return {
    funnelData,
    totalApplications: applications?.length || 0,
  };
}
```

## Job Board Integration

### Multi-Platform Publishing

```typescript
interface JobBoard {
  id: string;
  name: string;
  apiEndpoint: string;
  requiredFields: string[];
  costPerPost: number;
  isActive: boolean;
}

function useJobBoardIntegration() {
  const jobBoards: JobBoard[] = [
    {
      id: 'indeed',
      name: 'Indeed',
      apiEndpoint: '/api/integrations/indeed/',
      requiredFields: ['title', 'description', 'location', 'salary'],
      costPerPost: 0,
      isActive: true,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      apiEndpoint: '/api/integrations/linkedin/',
      requiredFields: ['title', 'description', 'company', 'location'],
      costPerPost: 15,
      isActive: true,
    },
    {
      id: 'glassdoor',
      name: 'Glassdoor',
      apiEndpoint: '/api/integrations/glassdoor/',
      requiredFields: ['title', 'description', 'company', 'salary'],
      costPerPost: 10,
      isActive: false,
    },
  ];

  const { mutate: publishToBoards } = useMutation({
    mutationFn: async ({ 
      jobId, 
      selectedBoards 
    }: { 
      jobId: string; 
      selectedBoards: string[];
    }) => {
      const token = getCookie('token');
      const response = await fetch(`/api/jobs/${jobId}/publish/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boards: selectedBoards }),
      });
      
      return response.json();
    },
    onSuccess: (result) => {
      const successCount = result.successful.length;
      const failureCount = result.failed.length;
      
      if (successCount > 0) {
        toast.success(`Job published to ${successCount} job board(s)`);
      }
      
      if (failureCount > 0) {
        toast.error(`Failed to publish to ${failureCount} job board(s)`);
      }
    },
  });

  const validateJobForBoard = useCallback((job: T_CreateJob, boardId: string): ValidationResult => {
    const board = jobBoards.find(b => b.id === boardId);
    if (!board) {
      return { isValid: false, errors: ['Job board not found'] };
    }

    const errors: string[] = [];
    
    board.requiredFields.forEach(field => {
      if (!job[field as keyof T_CreateJob]) {
        errors.push(`${field} is required for ${board.name}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [jobBoards]);

  return {
    jobBoards,
    publishToBoards,
    validateJobForBoard,
  };
}
```

## Compliance and Legal

### EEO and Compliance Tracking

```typescript
interface EEOTracking {
  jobId: string;
  totalApplications: number;
  demographics: {
    gender: Record<string, number>;
    ethnicity: Record<string, number>;
    age: Record<string, number>;
    disability: Record<string, number>;
    veteran: Record<string, number>;
  };
  hiredDemographics: {
    gender: Record<string, number>;
    ethnicity: Record<string, number>;
    age: Record<string, number>;
    disability: Record<string, number>;
    veteran: Record<string, number>;
  };
  complianceScore: number;
  recommendations: string[];
}

function useEEOCompliance() {
  const { data: eeoData } = useQuery({
    queryKey: ['eeoCompliance'],
    queryFn: async () => {
      const token = getCookie('token');
      const response = await fetch('/api/compliance/eeo/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      return response.json();
    },
  });

  const generateEEOReport = useCallback(async (dateRange: { start: string; end: string }) => {
    const token = getCookie('token');
    const response = await fetch('/api/compliance/eeo/report/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dateRange),
    });
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eeo-report-${dateRange.start}-${dateRange.end}.pdf`;
    a.click();
  }, []);

  return {
    eeoData,
    generateEEOReport,
  };
}
```

## Best Practices

### Job Optimization

1. **SEO-Friendly Titles**: Use clear, searchable job titles
2. **Detailed Descriptions**: Provide comprehensive job descriptions
3. **Competitive Compensation**: Research and offer competitive salaries
4. **Clear Requirements**: Specify must-have vs. nice-to-have qualifications
5. **Company Branding**: Maintain consistent company branding across all jobs

### Screening Efficiency

1. **Automated Screening**: Use keywords and criteria for initial filtering
2. **Structured Interviews**: Standardize interview questions and evaluation criteria
3. **Collaborative Hiring**: Involve multiple team members in the hiring process
4. **Quick Response**: Respond to applications promptly to maintain candidate interest
5. **Feedback Loop**: Collect and act on feedback from both candidates and hiring managers

### Compliance and Ethics

1. **Equal Opportunity**: Ensure fair and unbiased hiring practices
2. **Documentation**: Maintain proper documentation for all hiring decisions
3. **Privacy Protection**: Safeguard candidate personal information
4. **Legal Compliance**: Stay updated with employment laws and regulations
5. **Accessibility**: Ensure job postings and application processes are accessible

This job management system provides a comprehensive solution for handling the complete recruitment lifecycle with proper analytics, compliance tracking, and integration capabilities.
