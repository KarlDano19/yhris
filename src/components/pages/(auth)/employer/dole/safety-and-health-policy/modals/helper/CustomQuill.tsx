import dynamic from "next/dynamic";
import { useMemo } from "react";

// Enhanced modules for ReactQuill to handle HTML content better
export const ENHANCED_QUILL_MODULES = {
  toolbar: [
    [{ header: ['1', '2', '3', false] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ color: [] }, { background: [] }],
    ['clean']
  ],
  clipboard: {
    // Make sure pasted content is properly formatted
    matchVisual: false,
  }
};

// Enhanced formats to better support HTML content
export const ENHANCED_QUILL_FORMATS = [
  'header',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'indent',
  'color',
  'background'
];
