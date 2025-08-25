import React from 'react';
import { generateAdvertiseOptions, getRegionsAndProvinces } from './philippines';

// Export the generated advertise options with proper JSX formatting
export const philippinesAdvertiseOptions = () => {
  const rawOptions = generateAdvertiseOptions();
  
  return rawOptions.map(option => {
    if (option.isDisabled && option.label) {
      // Convert string labels to JSX for headers
      return {
        ...option,
        label: <strong>{option.label}</strong>
      };
    }
    return option;
  });
};

// Export regions and provinces only (without Metro Manila)
export const philippinesRegionsAndProvinces = () => {
  const rawOptions = getRegionsAndProvinces();
  
  return rawOptions.map(option => {
    if (option.isDisabled && option.label) {
      // Convert string labels to JSX for headers
      return {
        ...option,
        label: <strong>{option.label}</strong>
      };
    }
    return option;
  });
};

// Export the default advertise options (same as the original but using philippines data)
export const advertiseOptions = philippinesAdvertiseOptions();

// Helper function to get all valid region values (excluding headers and disabled options)
export const getValidRegions = () => {
  return advertiseOptions
    .filter(option => option.value && !option.isDisabled)
    .map(option => option.value);
};

// Helper function to get region by value
export const getRegionByValue = (value: string) => {
  return advertiseOptions.find(option => option.value === value);
};

// Helper function to get region group for a specific region
export const getRegionGroup = (regionValue: string) => {
  const regionIndex = advertiseOptions.findIndex(option => option.value === regionValue);
  if (regionIndex === -1) return null;
  
  // Find the most recent header before this region
  for (let i = regionIndex - 1; i >= 0; i--) {
    if (advertiseOptions[i].isDisabled && advertiseOptions[i].label) {
      // Extract text content from JSX element
      const label = advertiseOptions[i].label;
      if (typeof label === 'string') {
        return label;
      } else if (label && typeof label === 'object' && 'props' in label) {
        return label.props.children;
      }
    }
  }
  return null;
};
