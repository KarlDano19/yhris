import React, { useMemo, useState } from 'react';

import OverallComplianceRateCard from '../cards/compliance-policy/OverallComplianceRateCard';
import PoliciesDueCard from '../cards/compliance-policy/PoliciesDueCard';
import OverduePoliciesCard from '../cards/compliance-policy/OverduePoliciesCard';
import PoliciesAcknowledgementCard from '../cards/compliance-policy/PoliciesAcknowledgementCard';
import OverallComplianceTrend from './components/compliance-policy-tab/OverallComplianceTrend';
import PoliciesAcknowledgementTrend from './components/compliance-policy-tab/PoliciesAcknowledgementTrend';
import PolicyComplianceTable from './components/compliance-policy-tab/PolicyComplianceTable';
import DOLEComplianceTable from './components/compliance-policy-tab/DOLEComplianceTable';

import useGetCompliancePolicy from '../hooks/useGetCompliancePolicy';

const CompliancePolicy = () => {
  const [policyCurrentPage, setPolicyCurrentPage] = useState(1);
  const [policyPageSize, setPolicyPageSize] = useState(10);

  const {
    data: compliancePolicyData,
    isLoading,
    error,
  } = useGetCompliancePolicy();

  // Transform DOLE compliance table from backend snake_case to the component's camelCase shape
  const doleComplianceData = useMemo(() => {
    if (!compliancePolicyData?.dole_compliance_table) return [];
    return compliancePolicyData.dole_compliance_table.map((row) => ({
      doleRequirement: row.dole_requirement,
      frequency: row.frequency || '—',
      lastSubmitted: row.last_submitted || '—',
      nextDueDate: row.next_due_date || '—',
      complianceStatus: row.compliance_status || '—',
    }));
  }, [compliancePolicyData]);

  // Dummy data for Policy Compliance Table (not yet backed by an API)
  const calculateNextReviewDate = (lastUpdated: string) => {
    const date = new Date(lastUpdated);
    const nextYear = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
    return nextYear.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const policyComplianceData = [
    {
      policyName: 'Anti-Sexual Harassment Policy',
      lastUpdated: 'Dec 10, 2024',
      nextReviewDate: calculateNextReviewDate('Dec 10, 2024'),
      complianceStatus: 'Compliant',
      acknowledgedBy: '92% of Employees',
      action: 'View Report',
      directiveId: 1,
    },
    {
      policyName: 'Code of Conduct',
      lastUpdated: 'Aug 6, 2024',
      nextReviewDate: calculateNextReviewDate('Aug 6, 2024'),
      complianceStatus: 'Needs Review/Update',
      acknowledgedBy: '84% of Employees',
      action: 'Review/Update Policy',
      directiveId: 2,
    },
    {
      policyName: 'Remote Work Policy',
      lastUpdated: 'Apr 18, 2024',
      nextReviewDate: calculateNextReviewDate('Apr 18, 2024'),
      complianceStatus: 'Overdue',
      acknowledgedBy: '78% of Employees',
      action: 'Review/Update Policy',
      directiveId: 3,
    },
    {
      policyName: 'Cyber Security Guidelines',
      lastUpdated: 'Nov 14, 2024',
      nextReviewDate: calculateNextReviewDate('Nov 14, 2024'),
      complianceStatus: 'Compliant',
      acknowledgedBy: '88% of Employees',
      action: 'View Report',
      directiveId: 4,
    },
  ];

  const policyPagination = {
    totalRecords: 4,
    totalPages: 1,
  };

  return (
    <div className="space-y-6">
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverallComplianceRateCard
          isLoading={isLoading}
          error={error}
          precomputedRate={compliancePolicyData?.overall_compliance_rate}
        />
        <PoliciesDueCard
          isLoading={isLoading}
          error={error}
          precomputedCount={compliancePolicyData?.policies_due_count}
        />
        <OverduePoliciesCard
          isLoading={isLoading}
          error={error}
          precomputedCount={compliancePolicyData?.overdue_count}
        />
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
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default CompliancePolicy;
