import html2canvas from 'html2canvas';

type T_CaptureOptions = Parameters<typeof html2canvas>[1];

// Drop-in replacement for html2canvas that always renders the light theme, so
// exported PDFs and images look the same whatever theme the user is viewing in.
const captureLight = (element: HTMLElement, options: T_CaptureOptions = {}) =>
  html2canvas(element, {
    ...options,
    onclone: (clonedDocument, clonedElement) => {
      clonedDocument.documentElement.classList.remove('dark');
      clonedDocument.documentElement.style.colorScheme = 'light';
      return options?.onclone?.(clonedDocument, clonedElement);
    },
  });

export default captureLight;
