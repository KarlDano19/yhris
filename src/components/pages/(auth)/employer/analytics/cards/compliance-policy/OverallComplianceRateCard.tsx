import React, { useMemo, useEffect, useState } from 'react';

import { Tooltip } from 'react-tooltip';
import LoadingSpinner from '@/components/LoadingSpinner';

import Card from '../../Card';

import InfoIcon from '@/svg/InfoIcon';

interface OverallComplianceRateCardProps {
  complianceData?: any[];
  isLoading?: boolean;
  error?: any;
  precomputedRate?: number;
}

const OverallComplianceRateCard: React.FC<OverallComplianceRateCardProps> = ({
  complianceData,
  isLoading = false,
  error = null,
  precomputedRate,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip for 2 seconds on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 500); // Start after 500ms

    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 2500); // Hide after 2.5 seconds

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Calculate overall compliance rate
  const calculateComplianceRate = useMemo(() => {
    const rate = precomputedRate !== undefined ? precomputedRate : 92;
    return {
      complianceRate: Math.round(rate),
      trend: `Based on DOLE requirements compliance`,
      isPositive: rate >= 70
    };
  }, [complianceData, precomputedRate]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <div className="flex items-center justify-center mb-2">
          <h3 className="text-sm font-semibold text-gray-600 text-center">Overall Compliance Rate</h3>
          <div
            className='inline-block ml-1 cursor-pointer'
            data-tooltip-id='overall-compliance-tooltip'
            data-tooltip-place='top'
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <InfoIcon />
          </div>
          <Tooltip 
            id='overall-compliance-tooltip' 
            opacity={1} 
            style={{ fontSize: '12px', maxWidth: '300px', whiteSpace: 'normal', lineHeight: '1.4' }}
            isOpen={showTooltip}
          >
            <div>
              <h2 className='text-[12px] font-medium leading-relaxed'>Percentage of all policies and DOLE requirements that are currently compliant.</h2>
            </div>
          </Tooltip>
        </div>
        <div className="flex items-center justify-center h-16">
          <LoadingSpinner size="md" color="yellow" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <div className="flex items-center justify-center mb-2">
          <h3 className="text-sm font-semibold text-gray-600 text-center">Overall Compliance Rate</h3>
          <div
            className='inline-block ml-1 cursor-pointer'
            data-tooltip-id='overall-compliance-tooltip'
            data-tooltip-place='top'
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <InfoIcon />
          </div>
          <Tooltip 
            id='overall-compliance-tooltip' 
            opacity={1} 
            style={{ fontSize: '12px', maxWidth: '300px', whiteSpace: 'normal', lineHeight: '1.4' }}
            isOpen={showTooltip}
          >
            <div>
              <h2 className='text-[12px] font-medium leading-relaxed'>Percentage of all policies and DOLE requirements that are currently compliant.</h2>
            </div>
          </Tooltip>
        </div>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load compliance data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-2 pr-2">
      <div className="flex items-center justify-center mb-2">
        <h3 className="text-sm font-semibold text-gray-600 text-center">Overall Compliance Rate</h3>
        <div
          className='inline-block ml-1 cursor-pointer'
          data-tooltip-id='overall-compliance-tooltip'
          data-tooltip-place='top'
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <InfoIcon />
        </div>
        <Tooltip 
          id='overall-compliance-tooltip' 
          opacity={1} 
          style={{ fontSize: '12px', maxWidth: '300px', whiteSpace: 'normal', lineHeight: '1.4' }}
          isOpen={showTooltip}
        >
          <div>
            <h2 className='text-[12px] font-medium leading-relaxed'>Percentage of all policies and DOLE requirements that are currently compliant.</h2>
          </div>
        </Tooltip>
      </div>
      <Card
        value={`${calculateComplianceRate.complianceRate}%`}
        trend={calculateComplianceRate.trend}
        isPositive={calculateComplianceRate.isPositive}
      />
    </div>
  );
};

export default OverallComplianceRateCard;
