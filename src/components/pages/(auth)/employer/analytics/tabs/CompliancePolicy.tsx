import React, { useEffect, useMemo, useState } from 'react';

import OverallComplianceRateCard from '../cards/compliance-policy/OverallComplianceRateCard';
import PoliciesDueCard from '../cards/compliance-policy/PoliciesDueCard';
import OverduePoliciesCard from '../cards/compliance-policy/OverduePoliciesCard';
import PoliciesAcknowledgementCard from '../cards/compliance-policy/PoliciesAcknowledgementCard';
import OverallComplianceTrend from './components/compliance-policy-tab/OverallComplianceTrend';
import PoliciesAcknowledgementTrend from './components/compliance-policy-tab/PoliciesAcknowledgementTrend';
import PolicyComplianceTable from './components/compliance-policy-tab/PolicyComplianceTable';
import DOLEComplianceTable from './components/compliance-policy-tab/DOLEComplianceTable';
import useGetAnnualAccidentIllnessReportItems from '../hooks/useGetAnnualAccidentIllnessReportItems';
import useGetAnnualMedicalReportItems from '../hooks/useGetAnnualMedicalReportItems';
import useGetHealthAndSafetyReportItems from '../hooks/useGetHealthAndSafetyReportItems';
import useGetShcMinutesMeetingItems from '../hooks/useGetShcMinutesMettingItems';
import useGetSafetyANdHealthPolicyDetails from '../hooks/useGetSafetyANdHealthPolicyDetails';
import useGetOshProgramDetails from '../hooks/useGetOshProgramDetails';
import useGetWorkEnvironmentRequestItems from '../hooks/useGetWorkEnvironmentRequestItems';

// Custom hook for analytics data fetching
const useAnalyticsData = (hook: any, refetch: any) => {
  const { data, refetch: hookRefetch } = hook();
  
  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, refetch: hookRefetch };
};

// Utility function to format date
const formatDate = (date: Date, suffix: string = '') => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + suffix;
};

// Local helpers to reduce redundancy
const toArray = (data: any | any[] | undefined) => (Array.isArray(data) ? data : data ? [data] : []);

const computeStatus = (data: any | any[] | undefined) => getOverallStatus(toArray(data));

const computeHiddenLastSubmitted = (
  records: any[] | undefined,
  status: string,
  dateField: string,
  fallback: string = '—',
  appendApprovedSuffix: boolean = false
) => {
  if (status === 'On Schedule') return '—';
  const formatted = getLatestDate(records || [], dateField, fallback);
  return appendApprovedSuffix && status === 'Approved' ? `${formatted} (approved)` : formatted;
};

const computeHiddenNextDueDate = (
  records: any[] | undefined,
  status: string,
  fallback: string = '—'
) => {
  if (status === 'On Schedule') return '—';
  return records?.[0]?.next_due_date || fallback;
};

const computeQuarterHiddenLastSubmitted = (
  records: any[] | undefined,
  status: string,
  dateField: string,
  fallback: string = '—'
) => {
  if (status === 'On Schedule') return '—';
  return getLatestQuarterDate(records || [], dateField, fallback);
};

// Utility function to get latest date from analytics data
const getLatestDate = (data: any[], dateField: string, fallback: string = '—') => {
  if (!data || !data.length) return fallback;
  
  let latestTime = 0;
  data.forEach((item: any) => {
    const raw = item[dateField];
    const t = raw ? new Date(raw).getTime() : 0;
    if (!Number.isNaN(t) && t > latestTime) latestTime = t;
  });
  
  if (!latestTime) return fallback;
  return formatDate(new Date(latestTime));
};

// Utility function to get latest quarter date from analytics data
const getLatestQuarterDate = (data: any[], dateField: string, fallback: string = '—') => {
  if (!data || !data.length) return fallback;
  
  let latestTime = 0;
  data.forEach((item: any) => {
    const raw = item[dateField];
    const t = raw ? new Date(raw).getTime() : 0;
    if (!Number.isNaN(t) && t > latestTime) latestTime = t;
  });
  
  if (!latestTime) return fallback;
  const d = new Date(latestTime);
  const quarter = Math.floor(d.getMonth() / 3) + 1;
  return `Q${quarter} ${d.getFullYear()} Submitted`;
};

// Utility function to get overall status from employee compensation logbook data
const getOverallStatus = (data: any[], fallback: string = 'On Schedule') => {
  if (!data || !data.length) return fallback;
  
  // For analytics, the backend returns only the latest entry
  const latestEntry = data[0];
  if (latestEntry && latestEntry.status) {
    const status = latestEntry.status;
    // Map backend status to display status
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'for-review':
        return 'For Review';
      case 'for-submission':
        return 'For Submission';
      case 'on-schedule':
        return 'On Schedule';
      default:
        return fallback;
    }
  }
  
  return fallback;
};

const CompliancePolicy = () => {
  // Pagination state for Policy Compliance Table
  const [policyCurrentPage, setPolicyCurrentPage] = useState(1);
  const [policyPageSize, setPolicyPageSize] = useState(10);

  // Helper function to calculate next review date (1 year from last updated)
  const calculateNextReviewDate = (lastUpdated: string) => {
    const date = new Date(lastUpdated);
    const nextYear = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
    return nextYear.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Fetch all analytics data
  const { data: annualWairRecords, refetch: refetchAnnualWair } = useAnalyticsData(useGetAnnualAccidentIllnessReportItems, () => {});
  const { data: annualMedicalRecords, refetch: refetchAnnualMedical } = useAnalyticsData(useGetAnnualMedicalReportItems, () => {});
  const { data: healthSafetyOrgRecords, refetch: refetchHealthSafetyOrg } = useAnalyticsData(useGetHealthAndSafetyReportItems, () => {});
  const { data: shcMinutesRecords, refetch: refetchShcMinutes } = useAnalyticsData(useGetShcMinutesMeetingItems, () => {});
  const { data: safetyHealthPolicy, refetch: refetchSafetyHealthPolicy } = useAnalyticsData(useGetSafetyANdHealthPolicyDetails, () => {});
  const { data: oshProgram, refetch: refetchOshProgram } = useAnalyticsData(useGetOshProgramDetails, () => {});
  const { data: wemRecords, refetch: refetchWemRecords } = useAnalyticsData(useGetWorkEnvironmentRequestItems, () => {});

  // Trigger all refetches on mount
  useEffect(() => {
    // Kick off all analytics refetches on mount
    refetchAnnualWair();
    refetchAnnualMedical();
    refetchHealthSafetyOrg();
    refetchShcMinutes();
    refetchSafetyHealthPolicy();
    refetchOshProgram();
    refetchWemRecords();
  }, [
    refetchAnnualWair,
    refetchAnnualMedical,
    refetchHealthSafetyOrg,
    refetchShcMinutes,
    refetchSafetyHealthPolicy,
    refetchOshProgram,
    refetchWemRecords,
  ]);

  // Process analytics data

  // Annual Work Accident & Illness Report (WAIR)
  const wairOverallStatus = useMemo(() => computeStatus(annualWairRecords), [annualWairRecords]);
  const wairLastSubmitted = useMemo(
    () => computeHiddenLastSubmitted(annualWairRecords, wairOverallStatus, 'updated_at'), 
    [annualWairRecords, wairOverallStatus]
  );

  // Annual Medical Report (AMR)
  const amrOverallStatus = useMemo(() => getOverallStatus(annualMedicalRecords), [annualMedicalRecords]);
  const amrLastSubmitted = useMemo(
    () => computeHiddenLastSubmitted(annualMedicalRecords, amrOverallStatus, 'updated_at'), 
    [annualMedicalRecords, amrOverallStatus]
  );

  // Health and Safety Organization Report (HSOR)
  const hsOverallStatus = useMemo(() => computeStatus(healthSafetyOrgRecords), [healthSafetyOrgRecords]);
  const hsLastSubmitted = useMemo(
    () => computeHiddenLastSubmitted(healthSafetyOrgRecords, hsOverallStatus, 'updated_at'), 
    [healthSafetyOrgRecords, hsOverallStatus]
  );

  // SHC Minutes of Meeting (SHCM)
  const shcOverallStatus = useMemo(() => computeStatus(shcMinutesRecords), [shcMinutesRecords]);
  const shcLastSubmitted = useMemo(
    () => computeQuarterHiddenLastSubmitted(shcMinutesRecords, shcOverallStatus, 'updated_at'), 
    [shcMinutesRecords, shcOverallStatus]
  );

  // Safety & Health Policy (SHP)
  const shpOverallStatus = useMemo(() => computeStatus(safetyHealthPolicy ? [safetyHealthPolicy] : []), [safetyHealthPolicy]);
  const shpLastSubmitted = useMemo(
    () => computeHiddenLastSubmitted(toArray(safetyHealthPolicy), shpOverallStatus, 'updated_at', '—', true), 
    [safetyHealthPolicy, shpOverallStatus]
  );

  // OSH Program (OSHP)
  const oshOverallStatus = useMemo(() => computeStatus(oshProgram ? [oshProgram] : []), [oshProgram]);
  const oshLastSubmitted = useMemo(
    () => computeHiddenLastSubmitted(toArray(oshProgram), oshOverallStatus, 'updated_at', '—', true), 
    [oshProgram, oshOverallStatus]
  );

  // Work Environment Measurement (WEM)
  const wemOverallStatus = useMemo(() => computeStatus(wemRecords), [wemRecords]);
  const wemLastSubmitted = useMemo(
    () => computeHiddenLastSubmitted(wemRecords, wemOverallStatus, 'updated_at'),
    [wemRecords, wemOverallStatus]
  );

  // Dummy data for Policy Compliance Table matching the image
  const policyComplianceData = [
    {
      policyName: 'Anti-Sexual Harassment Policy',
      lastUpdated: 'Dec 10, 2024',
      nextReviewDate: calculateNextReviewDate('Dec 10, 2024'),
      complianceStatus: 'Compliant',
      acknowledgedBy: '92% of Employees',
      action: 'View Report',
      directiveId: 1
    },
    {
      policyName: 'Code of Conduct',
      lastUpdated: 'Aug 6, 2024',
      nextReviewDate: calculateNextReviewDate('Aug 6, 2024'),
      complianceStatus: 'Needs Review/Update',
      acknowledgedBy: '84% of Employees',
      action: 'Review/Update Policy',
      directiveId: 2
    },
    {
      policyName: 'Remote Work Policy',
      lastUpdated: 'Apr 18, 2024',
      nextReviewDate: calculateNextReviewDate('Apr 18, 2024'),
      complianceStatus: 'Overdue',
      acknowledgedBy: '78% of Employees',
      action: 'Review/Update Policy',
      directiveId: 3
    },
    {
      policyName: 'Cyber Security Guidelines',
      lastUpdated: 'Nov 14, 2024',
      nextReviewDate: calculateNextReviewDate('Nov 14, 2024'),
      complianceStatus: 'Compliant',
      acknowledgedBy: '88% of Employees',
      action: 'View Report',
      directiveId: 4
    }
  ];

  const policyPagination = {
    totalRecords: 4,
    totalPages: 1
  };

  // DOLE data with all last submitted dates derived from API and real status data
  const doleComplianceData = [
    {
      doleRequirement: 'Work Accident & Illness Report (WAIR)',
      frequency: annualWairRecords?.[0]?.frequency,
      lastSubmitted: wairLastSubmitted,
      nextDueDate: computeHiddenNextDueDate(annualWairRecords, wairOverallStatus),
      complianceStatus: wairOverallStatus
    },
    {
      doleRequirement: 'Annual Medical Report',
      frequency: annualMedicalRecords?.[0]?.frequency,
      lastSubmitted: amrLastSubmitted,
      nextDueDate: computeHiddenNextDueDate(annualMedicalRecords, amrOverallStatus),
      complianceStatus: amrOverallStatus
    },
    {
      doleRequirement: 'Health and Safety Organization Report',
      frequency: healthSafetyOrgRecords?.[0]?.frequency,
      lastSubmitted: hsLastSubmitted,
      nextDueDate: computeHiddenNextDueDate(healthSafetyOrgRecords, hsOverallStatus),
      complianceStatus: hsOverallStatus
    },
    {
      doleRequirement: 'SHC Minutes of Meeting',
      frequency: shcMinutesRecords?.[0]?.frequency,
      lastSubmitted: shcLastSubmitted,
      nextDueDate: computeHiddenNextDueDate(shcMinutesRecords, shcOverallStatus),
      complianceStatus: shcOverallStatus
    },
    {
      doleRequirement: 'Safety & Health Policy',
      frequency: safetyHealthPolicy?.frequency,
      lastSubmitted: shpLastSubmitted,
      nextDueDate: computeHiddenNextDueDate(toArray(safetyHealthPolicy), shpOverallStatus),
      complianceStatus: shpOverallStatus
    },
    {
      doleRequirement: 'OSH Program (DOLE Approved)',
      frequency: oshProgram?.frequency,
      lastSubmitted: oshLastSubmitted,
      nextDueDate: computeHiddenNextDueDate(toArray(oshProgram), oshOverallStatus),
      complianceStatus: oshOverallStatus
    },
    {
      doleRequirement: 'Work Environment Measurement (WEM)',
      frequency: wemRecords?.[0]?.frequency,
      lastSubmitted: wemLastSubmitted,
      nextDueDate: computeHiddenNextDueDate(wemRecords, wemOverallStatus),
      complianceStatus: wemOverallStatus
    },

  ];

  return (
    <div className="space-y-6">
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverallComplianceRateCard />
        <PoliciesDueCard />
        <OverduePoliciesCard />
        <PoliciesAcknowledgementCard />
      </div>

      {/* Trend Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverallComplianceTrend />
        <PoliciesAcknowledgementTrend />
      </div>

      {/* Policy Compliance Table */}
      <PolicyComplianceTable
        data={policyComplianceData}
        pagination={policyPagination}
        isLoading={false}
        error={null}
        currentPage={policyCurrentPage}
        pageSize={policyPageSize}
        onPageChange={(event: any) => setPolicyCurrentPage(event.selected + 1)}
        onPageSizeChange={setPolicyPageSize}
      />

      {/* DOLE Compliance Table */}
      <div className="pb-8">
        <DOLEComplianceTable
          data={doleComplianceData}
        />
      </div>
    </div>
  );
};

export default CompliancePolicy;
