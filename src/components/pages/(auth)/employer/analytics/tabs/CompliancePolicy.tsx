'use client';

import React, { useState } from 'react';

import useGetDirectivesItems from '../hooks/useGetDirectivesItems';

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

  // Fetch directives data
  const { data: directivesData, isLoading: isLoadingDirectives, error: directivesError } = useGetDirectivesItems({
    currentPage: policyCurrentPage,
    pageSize: policyPageSize
  });

  // Transform directives data for Policy Compliance Table
  const transformDirectivesToPolicyData = (directives: any[]) => {
    return directives.map((directive) => {
      // Calculate compliance status based on directive data
      const getComplianceStatus = () => {
        const createdDate = new Date(directive.date);
        const currentDate = new Date();
        const daysSinceCreation = Math.floor((currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceCreation > 365) {
          return 'Overdue';
        } else if (daysSinceCreation > 300) {
          return 'Needs Review/Update';
        } else {
          return 'Compliant';
        }
      };

      // Determine action based on compliance status
      const getAction = (status: string) => {
        switch (status) {
          case 'Overdue':
          case 'Needs Review/Update':
            return 'Review/Update Policy';
          default:
            return 'View Report';
        }
      };

      const complianceStatus = getComplianceStatus();
      
      return {
        policyName: directive.title,
        lastUpdated: new Date(directive.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        nextReviewDate: new Date(new Date(directive.date).getTime() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        complianceStatus,
        acknowledgedBy: '0% of Employees', // Will be updated by ReadStatusCell component
        action: getAction(complianceStatus),
        directiveId: directive.id // Keep the directive ID for potential actions
      };
    });
  };

  // Transform data for the table
  const policyComplianceData = directivesData?.records 
    ? transformDirectivesToPolicyData(directivesData.records)
    : [];

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
        pagination={directivesData ? {
          totalRecords: directivesData.total_records || 0,
          totalPages: directivesData.total_pages || 1
        } : undefined}
        isLoading={isLoadingDirectives}
        error={directivesError}
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
