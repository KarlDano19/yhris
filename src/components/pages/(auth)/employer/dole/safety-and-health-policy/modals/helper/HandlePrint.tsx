export function HandlePrint() {
  const content = document.getElementById("pdf-content");
  if (!content) {
    console.error("Content not found for printing.");
    return;
  }

  // Create a hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    console.error('Could not access iframe document.');
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Safety and Health Policy</title>
        <style>
          /* Hide Quill's custom bullet points */
          .quill-editor-container .ql-editor ul > li::before {
            display: none !important;
          }

          /* Shared styles for both preview and editor */
          .policy-content,
          .quill-editor-container .ql-editor {
            font-family: Arial, sans-serif;
            font-size: 0.8rem;
            color: #222;
          }

          .policy-content ul,
          .quill-editor-container .ql-editor ul {
            list-style-type: disc !important;
            margin-left: 1.5rem !important;
            margin-bottom: 0.75rem;
            padding-left: 1.5rem !important;
          }

          .policy-content li,
          .quill-editor-container .ql-editor li {
            line-height: 1.5;
            list-style-type: disc !important;
            padding-left: 0.25rem;
            display: list-item !important;
          }

          .policy-content h2,
          .quill-editor-container .ql-editor h2 {
            font-size: 1rem;
            font-weight: bold;
            color: #333;
            margin-bottom: -1rem;
          }

          .policy-content h3,
          .quill-editor-container .ql-editor h3 {
            font-size: 0.9rem;
            font-weight: bold;
            margin-top: 1.5rem;
            margin-bottom: -0.9rem;
            color: #333;
          }

          .policy-content p,
          .quill-editor-container .ql-editor p {
            line-height: 1.5;
          }

          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            margin: 0;
            color: #333;
            line-height: 1.5;
          }
          @media print {
            body {
              padding: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="policy-content">
          ${content.innerHTML}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.focus();
              window.print();
            }, 250);
          };
        <\/script>
      </body>
    </html>
  `);
  doc.close();

  // Remove the iframe after printing
  const removeIframe = () => {
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  // Listen for print events
  iframe.contentWindow?.addEventListener('afterprint', removeIframe);
}
