import { ComponentType } from 'react';
import dynamic from 'next/dynamic';

// Its own loader, like ReactQuillResizableDynamic, so the registrations below only load with this editor.
// Cast as there: next/dynamic's type strips react-quill-new's ref, which the editor needs for the cursor.
const TemplateQuill = dynamic(async () => {
  const { default: RQ, Quill } = await import('react-quill-new');

  // Undo/redo have no built-in toolbar icons
  const icons = Quill.import('ui/icons') as Record<string, string>;
  icons.undo =
    '<svg viewBox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon><path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path></svg>';
  icons.redo =
    '<svg viewBox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon><path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path></svg>';

  // Display-only highlight for {{field}} text. The class never reaches the database: the backend
  // sanitizer drops it, and the editor strips the span before saving.
  const Inline = Quill.import('blots/inline') as any;
  class TemplateFieldBlot extends Inline {
    static blotName = 'template-field';
    static tagName = 'span';
    static className = 'ql-template-field';

    // A plain span reads as "no format" to Parchment and gets unwrapped; the class is what marks it
    static formats(domNode: HTMLElement) {
      return domNode.classList.contains(TemplateFieldBlot.className) || undefined;
    }
  }
  Quill.register(TemplateFieldBlot, true);

  return RQ;
}, { ssr: false }) as unknown as ComponentType<any>;

export default TemplateQuill;
