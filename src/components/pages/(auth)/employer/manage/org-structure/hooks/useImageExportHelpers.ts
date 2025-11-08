import { useCallback, useMemo } from 'react';
import { getCookie } from 'cookies-next';

export type ConvertedImage = {
  img: HTMLImageElement;
  originalSrc: string;
};

type ConvertResponse = {
  data_uri?: string;
};

/**
 * Provides helper utilities for converting external images to data URIs so that html2canvas
 * can render them without CORS issues during exports.
 */
function useImageExportHelpers() {
  const token = getCookie('token');
  const tokenValue = useMemo(
    () => (typeof token === 'string' ? token : undefined),
    [token],
  );

  const convertImagesToDataUri = useCallback(
    async (images: HTMLImageElement[]): Promise<ConvertedImage[]> => {
      const converted: ConvertedImage[] = [];

      for (const img of images) {
        const src = img.getAttribute('src') ?? '';

        // Skip empty or already converted data URIs
        if (!src || src.startsWith('data:')) {
          continue;
        }

        let parsedUrl: URL | null = null;
        try {
          parsedUrl = new URL(src, window.location.href);
        } catch {
          parsedUrl = null;
        }

        if (!parsedUrl) {
          continue;
        }

        // Skip same-origin URLs; they can be captured without conversion
        if (parsedUrl.origin === window.location.origin) {
          continue;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/to-base64/`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              ...(tokenValue ? { Authorization: `Token ${tokenValue}` } : {}),
            },
            body: JSON.stringify({ url: parsedUrl.toString() }),
          });

          if (!response.ok) {
            console.warn('Image conversion failed', parsedUrl.toString(), response.status);
            continue;
          }

          const payload = (await response.json()) as ConvertResponse;
          if (!payload?.data_uri) {
            continue;
          }

          const originalSrc = img.src;

          await new Promise<void>((resolve) => {
            img.onload = () => {
              img.onload = null;
              img.onerror = null;
              resolve();
            };
            img.onerror = () => {
              img.onload = null;
              img.onerror = null;
              resolve();
            };
            img.src = payload.data_uri!;
          });

          converted.push({ img, originalSrc });
        } catch (error) {
          console.warn('Unable to convert image for export', parsedUrl?.toString(), error);
        }
      }

      return converted;
    },
    [tokenValue],
  );

  const revertConvertedImages = useCallback((converted: ConvertedImage[]) => {
    converted.forEach(({ img, originalSrc }) => {
      if (img) {
        img.src = originalSrc;
      }
    });
  }, []);

  return {
    convertImagesToDataUri,
    revertConvertedImages,
  };
}

export default useImageExportHelpers;

