export const QUILL_FORMATS = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];
export const QUILL_MODULES = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

export const CREATEJOB_TEMPLATE = [
  "<p><strong>Ensuring the accounts of the company are accurate and free of error.</strong></p><p><br></p><ul><li>Must have at least 2 years of experience in accounting.</li><li>Any graduate of business course</li><li>Must have attention to details and a good communicator</li></ul>",
];

export const SEPARATION_TEMPLATE = [
    {
        name: 'Please Sign: Offboarding Documents',
        message: "<p>A blessed day!</p><p><br></p><p>Thank you for you contribution in AABA-YAHSHUA.</p><p><br></p><p>To move forward with your separation, please sign the ABBA-YASHUA offboard documents attached on or before 5:30 PM today.</p><p><br></p><p>Let us know if you have any questions.</p><p>Thank you and GOD bless.</p><p><br></p><p>--</p>",
    },
    {
        name: 'Please Sign: Quitclaim',
        message: "<p>A blessed day!</p><p><br></p><p>Thank you for you contribution in AABA-YAHSHUA.</p><p><br></p><p>To move forward with your separation, please sign the ABBA-YASHUA offboard documents attached on or before 5:30 PM today.</p><p><br></p><p>Let us know if you have any questions.</p><p>Thank you and GOD bless.</p><p><br></p><p>--</p>",
    }
];
export const NTE_TEMPLATE = [
    {
        name: "Please Sign: Offboarding Documents",
        message: "<p>A blessed day!</p><p><br></p><p>Thank you for you contribution in AABA-YAHSHUA.</p><p><br></p><p>To move forward with your separation, please sign the ABBA-YASHUA offboard documents attached on or before 5:30 PM today.</p><p><br></p><p>Let us know if you have any questions.</p><p>Thank you and GOD bless.</p><p><br></p><p>--</p>",
    },
];
