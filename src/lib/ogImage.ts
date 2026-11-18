// Default social preview image (1200x630) used by the Open Graph and Twitter card tags on every public page.
// The file lives in public/. Relative URLs resolve against metadataBase set in src/app/layout.tsx.
export const OG_IMAGE_ALT = 'YAHSHUA HRIS logo on a laptop screen';

export const OG_IMAGES = [
  { url: '/preview-image.png', width: 1200, height: 630, alt: OG_IMAGE_ALT },
];

export const TWITTER_IMAGES = [{ url: '/preview-image.png', alt: OG_IMAGE_ALT }];
