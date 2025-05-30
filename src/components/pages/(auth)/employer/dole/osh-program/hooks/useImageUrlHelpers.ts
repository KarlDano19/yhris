import { useEffect, useState } from 'react';
import useGetOshProgramDetails from './useGetOshProgramDetails';

/**
 * Generates appropriate URLs for different types of OSH program images
 */
export const useImageUrlHelpers = () => {
  const [employerId, setEmployerId] = useState<string | number | null>(null);
  const { data: oshProgramDetails } = useGetOshProgramDetails();
  
  useEffect(() => {
    if (oshProgramDetails?.employer) {
      setEmployerId(oshProgramDetails.employer);
    }
  }, [oshProgramDetails]);

  /**
   * Generate URL for safety signage images
   */
  const getSignageImageUrl = (fileName: string): string => {
    if (!fileName) return '';
    return `${process.env.NEXT_PUBLIC_API_URL}/media/oshprogram/signages/${employerId}/${fileName}`;
  };

  /**
   * Generate URL for signature images
   */
  const getSignatureImageUrl = (fileName: string): string => {
    if (!fileName) return '';
    return `${process.env.NEXT_PUBLIC_API_URL}/media/oshprogram/signatures/${employerId}/${fileName}`;
  };

  return {
    getSignageImageUrl,
    getSignatureImageUrl,
    employerId
  };
}; 