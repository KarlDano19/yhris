# Daily Progress Integration Guide - Frontend

This guide explains how to integrate the daily progress tracking feature into your frontend.

## Files Created

### 1. **Updated Types** (`src/types/business-mode.ts`)
- Added `T_DailyProgress` type
- Added `T_DailyProgressStatus` type
- Updated `T_BusinessJobApplication` with contractual job fields
- Added request/response types for new APIs

### 2. **New Hooks**

#### `useStartJob.ts`
```typescript
// Start a job (applicant)
const { mutate: startJob } = useStartJob();
startJob({ applicationId: 123 });
```

#### `useSubmitDailyProgress.ts`
```typescript
// Submit daily progress (applicant)
const { mutate: submitProgress } = useSubmitDailyProgress();
submitProgress({
  applicationId: 123,
  progress_date: '2025-01-10',
  proof_file: file,
  notes: 'Completed tasks A, B, C',
  hours_worked: 8.0
});
```

#### `useGetDailyProgress.ts`
```typescript
// Get daily progresses (both)
const { data, isLoading } = useGetDailyProgress({
  applicationId: 123,
  page_size: 50,
  current_page: 1
});
```

#### `useReviewDailyProgress.ts`
```typescript
// Review daily progress (client)
const { mutate: reviewProgress } = useReviewDailyProgress();
reviewProgress({
  progressId: 456,
  status: 'approved',
  client_feedback: 'Great work!'
});
```

#### `useSubmitPayment.ts`
```typescript
// Submit payment (client)
const { mutate: submitPayment } = useSubmitPayment();
submitPayment({
  applicationId: 123,
  payment_amount: 5000,
  payment_proof: file
});
```

### 3. **New Modals**

#### `StartJobModal.tsx`
Modal for applicant to start a job (shows different instructions for contractual vs single-day jobs).

#### `SubmitDailyProgressModal.tsx`
Modal for applicant to submit daily progress with:
- Date picker (restricted to contract period)
- Hours worked input (for hourly rate jobs)
- Work notes textarea
- File upload for proof

#### `ViewDailyProgressModal.tsx`
Modal to view all daily progresses with:
- List view of all submitted progresses
- Detail view of individual progress
- Review form for client (approve/reject with feedback)
- Read-only view for applicant

## Integration Steps

### Step 1: Update Hire Page (`pages/hire/Content.tsx`)

Add these imports at the top:

```typescript
import { useStartJob } from './hooks/useStartJob';
import { useSubmitDailyProgress } from './hooks/useSubmitDailyProgress';
import { useGetDailyProgress } from './hooks/useGetDailyProgress';
import { useReviewDailyProgress } from './hooks/useReviewDailyProgress';
import { useSubmitPayment } from './hooks/useSubmitPayment';
import StartJobModal from './modals/StartJobModal';
import SubmitDailyProgressModal from './modals/SubmitDailyProgressModal';
import ViewDailyProgressModal from './modals/ViewDailyProgressModal';
```

Add state for the new modals:

```typescript
const [isStartJobModalOpen, setIsStartJobModalOpen] = useState(false);
const [isSubmitProgressModalOpen, setIsSubmitProgressModalOpen] = useState(false);
const [isViewProgressModalOpen, setIsViewProgressModalOpen] = useState(false);
const [selectedApplication, setSelectedApplication] = useState<T_BusinessJobApplication | null>(null);
```

Add the hooks:

```typescript
const { mutate: startJob, isLoading: isStartingJob } = useStartJob();
const { mutate: submitProgress, isLoading: isSubmittingProgress } = useSubmitDailyProgress();
const { mutate: reviewProgress, isLoading: isReviewingProgress } = useReviewDailyProgress();
const { mutate: submitPayment, isLoading: isSubmittingPayment } = useSubmitPayment();
```

### Step 2: Update Job Card UI

For each job card, check if it's contractual and show appropriate actions:

```typescript
// Inside job card rendering
const application = job.applications[0]; // accepted application
const isContractual = application?.is_contractual_job;

{application?.status === 'accepted' && application.work_status === 'not_started' && (
  <button
    onClick={() => {
      setSelectedApplication(application);
      setIsStartJobModalOpen(true);
    }}
    className="btn-primary"
  >
    Start Job
  </button>
)}

{application?.status === 'accepted' && application.work_status === 'started' && isContractual && (
  <>
    <button
      onClick={() => {
        setSelectedApplication(application);
        setIsSubmitProgressModalOpen(true);
      }}
      className="btn-primary"
    >
      Submit Daily Progress ({application.submitted_progress_count}/{application.total_contract_days})
    </button>
    
    <button
      onClick={() => {
        setSelectedApplication(application);
        setIsViewProgressModalOpen(true);
      }}
      className="btn-secondary"
    >
      View Progress
    </button>
  </>
)}

{application?.status === 'accepted' && application.work_status === 'completed' && (
  <button
    onClick={() => {
      setSelectedApplication(application);
      // Open payment modal (update existing SubmitPaymentProofModal)
    }}
    className="btn-primary"
  >
    Submit Payment
  </button>
)}
```

### Step 3: Add Modal Components

Add the modals at the bottom of your component:

```typescript
{/* Start Job Modal */}
<StartJobModal
  isOpen={isStartJobModalOpen}
  onClose={() => setIsStartJobModalOpen(false)}
  jobTitle={selectedApplication?.business_job_posting?.job_title || ''}
  clientName="Client Name" // Get from job data
  contractStartDate={selectedApplication?.business_job_posting?.contract_start_date || ''}
  contractEndDate={selectedApplication?.business_job_posting?.contract_end_date || null}
  isContractual={selectedApplication?.is_contractual_job || false}
  onConfirm={() => {
    if (selectedApplication) {
      startJob({ applicationId: selectedApplication.id }, {
        onSuccess: () => {
          toast.custom(<CustomToast message="Job started successfully!" type="success" />);
          setIsStartJobModalOpen(false);
        },
        onError: (error) => {
          toast.custom(<CustomToast message={error.message} type="error" />);
        }
      });
    }
  }}
/>

{/* Submit Daily Progress Modal */}
<SubmitDailyProgressModal
  isOpen={isSubmitProgressModalOpen}
  onClose={() => setIsSubmitProgressModalOpen(false)}
  jobTitle={selectedApplication?.business_job_posting?.job_title || ''}
  contractStartDate={selectedApplication?.business_job_posting?.contract_start_date || ''}
  contractEndDate={selectedApplication?.business_job_posting?.contract_end_date || ''}
  budgetType={selectedApplication?.business_job_posting?.budget_type || 'fixed_rate'}
  onSubmit={(data) => {
    if (selectedApplication) {
      submitProgress({ applicationId: selectedApplication.id, ...data }, {
        onSuccess: () => {
          toast.custom(<CustomToast message="Daily progress submitted!" type="success" />);
          setIsSubmitProgressModalOpen(false);
        },
        onError: (error) => {
          toast.custom(<CustomToast message={error.message} type="error" />);
        }
      });
    }
  }}
/>

{/* View Daily Progress Modal */}
<ViewDailyProgressModal
  isOpen={isViewProgressModalOpen}
  onClose={() => setIsViewProgressModalOpen(false)}
  jobTitle={selectedApplication?.business_job_posting?.job_title || ''}
  dailyProgresses={selectedApplication?.daily_progresses || []}
  isClient={true} // Set based on whether current user is the job creator
  onReview={(progressId, status, feedback) => {
    reviewProgress({ progressId, status, client_feedback: feedback }, {
      onSuccess: () => {
        toast.custom(<CustomToast message="Progress reviewed!" type="success" />);
      },
      onError: (error) => {
        toast.custom(<CustomToast message={error.message} type="error" />);
      }
    });
  }}
/>
```

### Step 4: Update My Jobs Page (`pages/my-jobs/Content.tsx`)

Similar integration for the applicant's view where they:
1. Can start jobs they've been accepted for
2. Submit daily progress for ongoing jobs
3. View their submitted progresses

## UI/UX Considerations

### Progress Indicators

Show visual progress for contractual jobs:

```typescript
{isContractual && (
  <div className="mt-2">
    <div className="flex justify-between text-xs text-gray-600 mb-1">
      <span>Progress</span>
      <span>{application.submitted_progress_count}/{application.total_contract_days} days</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-savoy-blue h-2 rounded-full transition-all"
        style={{
          width: `${(application.submitted_progress_count / application.total_contract_days) * 100}%`
        }}
      />
    </div>
  </div>
)}
```

### Job Status Badges

Different badges for different states:

```typescript
{application.work_status === 'not_started' && (
  <span className="badge badge-gray">Not Started</span>
)}
{application.work_status === 'started' && (
  <span className="badge badge-blue">In Progress</span>
)}
{application.work_status === 'completed' && (
  <span className="badge badge-green">Completed</span>
)}
```

### Contractual Job Indicator

Show a badge or icon for contractual jobs:

```typescript
{isContractual && (
  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
    <ClockIcon className="h-3 w-3" />
    Contractual ({application.total_contract_days} days)
  </span>
)}
```

## Testing Checklist

- [ ] Create a contractual job (with end_date)
- [ ] Apply to the job
- [ ] Accept the application (as client)
- [ ] Start the job (as applicant)
- [ ] Submit daily progress for multiple days
- [ ] View progress list (both client and applicant)
- [ ] Review progress (as client) - approve/reject
- [ ] Verify job auto-completes when all days submitted
- [ ] Submit payment (as client)
- [ ] Verify single-day jobs still work with old flow

## API Endpoints Summary

```
POST   /api/business-jobs/applications/{id}/start/
POST   /api/business-jobs/applications/{id}/daily-progress/
GET    /api/business-jobs/applications/{id}/daily-progress/
GET    /api/business-jobs/applications/daily-progress/{id}/
PATCH  /api/business-jobs/applications/daily-progress/{id}/
DELETE /api/business-jobs/applications/daily-progress/{id}/
PATCH  /api/business-jobs/applications/{id}/payment/
```

## Notes

- **Backward Compatibility**: Single-day jobs (without `contract_end_date`) continue to use the old flow
- **Auto-Completion**: Jobs automatically mark as complete when all days have progress submitted
- **Permission Checks**: Frontend should check user role (client vs applicant) to show appropriate actions
- **File Validation**: Frontend validates file size (10MB) and type (images, PDF) before upload
- **Date Validation**: Progress dates must be within contract period

## Common Issues

1. **Progress not showing**: Make sure you're fetching the application with `daily_progresses` included
2. **Can't submit progress**: Check that job is started and date is within contract period
3. **Payment button disabled**: Verify all progress submitted (`is_all_progress_submitted === true`)
4. **File upload fails**: Check file size (<10MB) and type (PNG, JPG, PDF only)

