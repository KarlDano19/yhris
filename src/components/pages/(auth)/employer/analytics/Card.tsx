'use client';

import React from 'react';
import { Tooltip } from 'react-tooltip';

import UpIcon from '@/svg/UpIcon';
import DownIcon from '@/svg/DownIcon';

interface CardProps {
  value: string;
  trend: string;
  isPositive?: boolean;
}

const Card: React.FC<CardProps> = ({ value, trend, isPositive = true }) => {
  return (
    <div className="bg-white rounded-2xl p-6 mt-2 border border-[#A8B5C7] shadow-lg shadow-gray-300">
      <div className="relative flex justify-center items-start mb-2">
        <span className="text-4xl font-bold text-gray-900">{value}</span>
        <div className="absolute right-0 top-0 flex flex-col -mt-1">
          {isPositive ? (
            <UpIcon />
          ) : (
            <DownIcon />
          )}
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center">{trend}</p>
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
    </div>
  );
};

export default Card; 