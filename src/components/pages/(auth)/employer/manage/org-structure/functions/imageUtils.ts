/**
 * Utility functions for handling images in org structure exports
 */

/**
 * Convert an image URL to base64
 * This is useful for S3 presigned URLs that may have CORS issues with html2canvas
 */
export async function convertImageToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit'
    });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    return '';
  }
}

/**
 * Preload and convert all images in a container to base64
 * This ensures html2canvas can properly capture S3 images
 */
export async function preloadAndConvertImages(container: HTMLElement): Promise<void> {
  const images = container.querySelectorAll('img');
  const imagePromises: Promise<void>[] = [];

  images.forEach((img) => {
    const originalSrc = img.src;
    
    // Only process images that are from S3 (contain amazonaws.com or have query params)
    if (originalSrc && (originalSrc.includes('amazonaws.com') || originalSrc.includes('?'))) {
      const promise = (async () => {
        try {
          // Store original src as data attribute for debugging
          img.setAttribute('data-original-src', originalSrc);
          
          // Convert to base64
          const base64 = await convertImageToBase64(originalSrc);
          
          if (base64) {
            // Replace src with base64
            img.src = base64;
            
            // Wait for the new src to load
            if (!img.complete) {
              await new Promise((resolve) => {
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
              });
            }
          }
        } catch (error) {
          // Silently fail for individual images
        }
      })();
      
      imagePromises.push(promise);
    }
  });

  await Promise.all(imagePromises);
}

/**
 * Restore original image sources after export
 */
export function restoreOriginalImages(container: HTMLElement): void {
  const images = container.querySelectorAll('img[data-original-src]');
  
  images.forEach((img) => {
    const originalSrc = img.getAttribute('data-original-src');
    if (originalSrc) {
      img.setAttribute('src', originalSrc);
      img.removeAttribute('data-original-src');
    }
  });
}

