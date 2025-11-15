import React from 'react';

import { Tooltip } from 'react-tooltip';

import UpIcon from '@/svg/UpIcon';
import DownIcon from '@/svg/DownIcon';

interface CardProps {
  value: string;
  trend: string;
  isPositive?: boolean;
  showSeeMore?: boolean;
}

const Card: React.FC<CardProps> = ({ value, trend, isPositive = true, showSeeMore = false }) => {
  return (
    <div className="bg-white rounded-2xl p-5 mt-2 border border-[#A8B5C7] shadow-lg shadow-gray-300">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-4xl font-bold text-gray-900">{value}</span>
        <span className="-mt-1">
          {isPositive ? <UpIcon /> : <DownIcon />}
        </span>
      </div>
      <p
        className="text-xs text-gray-400 text-center w-full max-w-[150px] mx-auto leading-snug px-2 break-words"
      >
        {trend}
      </p>
      {showSeeMore && (
        <div className="text-center mt-2">
          <button 
            className="opacity-50 cursor-not-allowed text-xs text-blue-600 hover:text-blue-800 font-medium underline"
            data-tooltip-id='see-more-tooltip'
            data-tooltip-content='Coming soon.'
            data-tooltip-place='bottom'
          >
            See more
          </button>
          <Tooltip id='see-more-tooltip' />
        </div>
      )}
    </div>
  );
};

export default Card; 