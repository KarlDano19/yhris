import React from 'react';

import { PlusIcon, MinusIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, UserGroupIcon } from '@heroicons/react/24/solid';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullscreenToggle: () => void;
  onShowAllEmployees: () => void;
  isFullscreen: boolean;
  zoomLevel: number;
  hasEmployees: boolean;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut, onFullscreenToggle, onShowAllEmployees, isFullscreen, zoomLevel, hasEmployees }) => {
  return (
    <>
    <div className="absolute bottom-8 left-10 z-10 flex flex-col items-start gap-3">
      {/* Zoom Percentage Display */}
      <div className="bg-gray-800 rounded-lg px-3 py-2 shadow-lg">
        <div className="text-white text-sm font-medium text-center">
          {Math.round(zoomLevel * 100)}%
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="bg-gray-800 rounded-full p-1 flex flex-col shadow-lg">
        <button
          onClick={onZoomIn}
          className="p-2 text-white hover:bg-gray-700 rounded-t-full transition-colors"
          title="Zoom In"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
        <div className="h-px bg-gray-600 mx-2"></div>
        <button
          onClick={onZoomOut}
          className="p-2 text-white hover:bg-gray-700 transition-colors"
          title="Zoom Out"
        >
          <MinusIcon className="w-5 h-5" />
        </button>
        <div className="h-px bg-gray-600 mx-2"></div>
        {hasEmployees && (
          <>
            <button
              onClick={onShowAllEmployees}
              className="p-2 text-white hover:bg-gray-700 transition-colors"
              title="Show All Employees"
            >
              <UserGroupIcon className="w-5 h-5" />
            </button>
            <div className="h-px bg-gray-600 mx-2"></div>
          </>
        )}
        <button
          onClick={onFullscreenToggle}
          className="p-2 text-white hover:bg-gray-700 rounded-b-full transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <ArrowsPointingInIcon className="w-5 h-5" />
          ) : (
            <ArrowsPointingOutIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
    </>
  );
};

export default ZoomControls;
