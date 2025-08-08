import React, { useState } from 'react';

import OverallComplianceRateCard from '../cards/compliance-policy/OverallComplianceRateCard';
import PoliciesDueCard from '../cards/compliance-policy/PoliciesDueCard';
import OverduePoliciesCard from '../cards/compliance-policy/OverduePoliciesCard';
import PoliciesAcknowledgementCard from '../cards/compliance-policy/PoliciesAcknowledgementCard';
import OverallComplianceTrend from './components/compliance-policy-tab/OverallComplianceTrend';
import PoliciesAcknowledgementTrend from './components/compliance-policy-tab/PoliciesAcknowledgementTrend';
import PolicyComplianceTable from './components/compliance-policy-tab/PolicyComplianceTable';
import DOLEComplianceTable from './components/compliance-policy-tab/DOLEComplianceTable';

const CompliancePolicy = () => {
  // Pagination state for Policy Compliance Table
  const [policyCurrentPage, setPolicyCurrentPage] = useState(1);
  const [policyPageSize, setPolicyPageSize] = useState(10);

  // Pagination state for DOLE Compliance Table
  const [doleCurrentPage, setDoleCurrentPage] = useState(1);
  const [dolePageSize, setDolePageSize] = useState(10);

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

  // Dummy data for DOLE Compliance Table (keeping as is for now)
  const doleComplianceData = [
    {
      doleRequirement: 'Work Accident & Illness Report (WAIR)',
      frequency: 'Annual (Jan 31)',
      lastSubmitted: 'Jan 28 2025',
      nextDueDate: 'Jan 31 2026',
      complianceStatus: 'Compliant',
      action: 'View Report'
    },
    {
      doleRequirement: 'Annual Medical Report',
      frequency: 'Annual (Feb 15)',
      lastSubmitted: 'Feb 14 2025',
      nextDueDate: 'Feb 15 2026',
      complianceStatus: 'Needs Review/Update',
      action: 'Upload'
    },
    {
      doleRequirement: 'Health & Safety Org Report',
      frequency: 'Annual (Dec 14)',
      lastSubmitted: 'Dec 14 2023',
      nextDueDate: 'Dec 14 2024',
      complianceStatus: 'Overdue',
      action: 'Upload'
    },
    {
      doleRequirement: 'OSH Committee Minutes of Meeting',
      frequency: 'Quarterly',
      lastSubmitted: 'Q1 2025 Submitted',
      nextDueDate: 'Q2 2025 Due',
      complianceStatus: 'Compliant',
      action: 'Upload Q2'
    },
    {
      doleRequirement: 'Safety & Health Policy',
      frequency: 'One-time + updates',
      lastSubmitted: 'Apr 12 2024 (approved)',
      nextDueDate: '—',
      complianceStatus: 'Compliant',
      action: 'View'
    },
    {
      doleRequirement: 'OSH Program (DOLE Approved)',
      frequency: 'One-time + updates',
      lastSubmitted: 'Aug 06 2023 (approved)',
      nextDueDate: '—',
      complianceStatus: 'Compliant',
      action: 'View'
    },
    {
      doleRequirement: 'Work Environment Measurement (WEM)',
      frequency: 'Every 2 years',
      lastSubmitted: 'May 02 2023',
      nextDueDate: 'May 02 2025',
      complianceStatus: 'Compliant',
      action: 'Schedule Renewal'
    },
    {
      doleRequirement: 'Employee Compensation Logbook',
      frequency: 'Continuous',
      lastSubmitted: '— (Ongoing log)',
      nextDueDate: 'Continuous',
      complianceStatus: 'Compliant',
      action: 'View Log'
    }
  ];

  const dolePagination = {
    totalRecords: 8,
    totalPages: 1
  };

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
          pagination={dolePagination}
          currentPage={doleCurrentPage}
          pageSize={dolePageSize}
          onPageChange={(event: any) => setDoleCurrentPage(event.selected + 1)}
          onPageSizeChange={setDolePageSize}
        />
      </div>
    </div>
  );
};

export default CompliancePolicy;
