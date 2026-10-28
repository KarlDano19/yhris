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
};

// Enhanced formats to better support HTML content
// NOTE: 'bullet' is NOT a separate Quill format - bulleted lists are the 'list' format with
// value 'bullet' (see the toolbar config above: { list: 'bullet' }). Listing 'bullet' here
// causes Quill to log "Cannot register 'bullet' specified in 'formats' config" on every mount.
export const ENHANCED_QUILL_FORMATS = [
  'header',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'indent',
  'color',
  'background'
];
