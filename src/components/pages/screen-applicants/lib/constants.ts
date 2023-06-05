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
]
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
}

export const BODY_TEMPLATE = {
  message:
    "<p>A blessed day, Mr. Malinawon!</p><p><br></p><p>Thank you for taking our call today.</p><p>As discussed, please take the following to move forward with your application:</p><ol><li>Operational Test</li><li>Personality Test</li></ol><p><br></p><p>Thank you and GOD bless,</p><p>--</p>",
}
