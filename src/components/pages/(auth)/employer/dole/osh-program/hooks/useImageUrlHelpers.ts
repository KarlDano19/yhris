/**
 * Utility hooks for handling image URLs in the OSH program
 */

/**
 * Generates appropriate URLs for different types of OSH program images
 */
export const useImageUrlHelpers = () => {
  /**
   * Generate URL for safety signage images
   */
  const getSignageImageUrl = (fileName: string): string => {
    if (!fileName) return '';
    return `${process.env.NEXT_PUBLIC_API_URL}/media/oshprogram/signages/${fileName}`;
  };

  /**
   * Generate URL for signature images
   */
  const getSignatureImageUrl = (fileName: string): string => {
    if (!fileName) return '';
    return `${process.env.NEXT_PUBLIC_API_URL}/media/oshprogram/signatures/${fileName}`;
  };

  return {
    getSignageImageUrl,
    getSignatureImageUrl
  };
}; 