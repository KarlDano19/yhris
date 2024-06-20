export const QUILL_FORMATS = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
];
export const QUILL_MODULES = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};
export const CREATEJOB_TEMPLATE = ['<p>Ensuring the accounts of the company are accurate and free of error.</p>'];
export const QUALIFICATION_TEMPLATE = [
  '<ul><li>Must have at least 2 years of experience in accounting.</li><li>Any graduate of business course</li><li>Must have attention to details and a good communicator</li></ul>',
];
