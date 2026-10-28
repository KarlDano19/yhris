import { ComponentType } from 'react';
import dynamic from 'next/dynamic';

import 'quill-resize-module/dist/resize.css';

// A separate loader from ReactQuillDynamic (not a shared one both use) — this one alone
// pulls in quill-resize-module, so only its callers (the memo/policy body editors) are
// exposed to that dependency. If quill-resize-module ever fails to load, only those
// editors are affected; the ~28 other editors using ReactQuillDynamic are unaffected,
// since they don't import this file at all.
//
// Cast away next/dynamic's inferred type here (once, at the source) instead of in every
// consumer — its wrapping strips react-quill-new's class-component ref support, which
// callers need to reach the underlying Quill instance (e.g. to sync state after
// quill-resize-module resizes an image, since that bypasses Quill's own change events).
const ReactQuillResizableDynamic = dynamic(async () => {
  const { default: RQ, Quill } = await import('react-quill-new');
  const { default: QuillResize } = await import('quill-resize-module');
  Quill.register('modules/resize', QuillResize);
  return RQ;
}, { ssr: false }) as unknown as ComponentType<any>;

export default ReactQuillResizableDynamic;
