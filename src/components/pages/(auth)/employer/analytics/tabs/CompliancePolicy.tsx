'use client';

import React, { useState } from 'react';

import OverallComplianceRateCard from './components/card-calculations/OverallComplianceRateCard';
import PoliciesDueCard from './components/card-calculations/PoliciesDueCard';
import OverduePoliciesCard from './components/card-calculations/OverduePoliciesCard';
import PoliciesAcknowledgementCard from './components/card-calculations/PoliciesAcknowledgementCard';
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
      name: 'John Santos',
      department: 'Sales',
      score: '91',
      lastEvaluation: 'Apr 10, 2025',
      status: 'Passed'
    },
    {
      name: 'Mia Reyes',
      department: 'IT',
      score: '68',
      lastEvaluation: 'Mar 20, 2025',
      status: 'Did not Pass'
    },
    {
      name: 'Carlo Dela Cruz',
      department: 'HR',
      score: '94',
      lastEvaluation: 'Apr 18, 2025',
      status: 'Passed'
    },
    {
      name: 'Anna Lim',
      department: 'IT',
      score: '71',
      lastEvaluation: 'Mar 28, 2025',
      status: 'Passed'
    }
  ];

  const dolePagination = {
    totalRecords: 4,
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
