import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { DirectiveData, DirectiveAttachment } from '@/types/directives';
import { appendLetterhead } from '@/helpers/letterhead';
import { extractInlineImageFiles } from './extractInlineImageFiles';

async function addDirective(directive: DirectiveData) {
  try {
    const token = getCookie('token');
    const data = new FormData();
    data.append('directive_type', directive.directive_type || '');
    data.append('title', directive.title);
    data.append('to', JSON.stringify(directive.to));
    data.append('company_name', directive.company_name || '');

    // Handle attachments as multiple FileField
    if (directive.attachments) {
      if (Array.isArray(directive.attachments)) {
        // Array could be File[] or DirectiveAttachment[]
        directive.attachments.forEach((item) => {
          // Only append if it's a File (new uploads)
          // Skip DirectiveAttachment objects (already uploaded files from backend)
          if (item instanceof File) {
            data.append('attachments', item);
          }
        });
      } else if (directive.attachments instanceof File) {
        // Single File attachment
        data.append('attachments', directive.attachments);
      }
      // Skip string attachments (they are URLs from backend)
    }

    // Upload mode — the user's own PDF *is* the memo, so the backend stores it as-is and
    // skips rendering one from the fields below.
    if (directive.document instanceof File) {
      data.append('document', directive.document);
      data.append('document_source', 'uploaded');
    }

    if (directive.directive_type === 'memo') {
      data.append('body', directive.body || '');
      data.append('name', directive.name || '');
      data.append('position', directive.position || '');

      // Any images embedded (as base64) in the body get uploaded alongside this same
      // request — the backend ties them to the directive and swaps the body's base64
      // src for the resulting storage path.
      if (directive.body) {
        const inlineImageFiles = await extractInlineImageFiles(directive.body);
        inlineImageFiles.forEach((file) => data.append('inline_images', file));
      }
      if (directive.signature) {
        console.log('Signature type:', typeof directive.signature);
        console.log('Signature value:', directive.signature);
        console.log('Is FileList?', directive.signature instanceof FileList);
        console.log('Is File?', directive.signature instanceof File);

        if (typeof directive.signature === 'string' && directive.signature.length) {
          // Handle drawn signature (base64 data URL)
          console.log('Processing drawn signature');
          const signatureBlob = await fetch(`${directive.signature}`).then((res) => res.blob());
          data.append('signature', signatureBlob, 'signature.jpg');
        } else if (directive.signature instanceof FileList && directive.signature.length > 0) {
          // Handle uploaded file from file input (FileList)
          console.log('Processing FileList signature, file:', directive.signature[0]);
          data.append('signature', directive.signature[0]);
        } else if (directive.signature instanceof File) {
          // Handle uploaded file (File object)
          console.log('Processing File signature');
          data.append('signature', directive.signature);
        } else {
          console.log('Signature format not recognized');
        }
      }
      if (directive.qr_code) {
        data.append('qr_code', directive.qr_code as File);
      }
      if (directive.signature_placement) {
        data.append('signature_placement', directive.signature_placement);
      }
    } else {
      // Add custom policy fields as JSON
      if (directive.custom_policy_fields && directive.custom_policy_fields.length > 0) {
        data.append('custom_policy_fields', JSON.stringify(directive.custom_policy_fields));
      }
      
      // Add provisions
      data.append('eligibility', directive.eligibility || '');
      data.append('application', directive.application || '');
      data.append('coverage', directive.coverage || '');
      data.append('termination', directive.termination || '');
    }

    // Both memos and policies print on the letterhead, so this sits outside the branch above.
    appendLetterhead(data, directive.letterhead);

    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: data,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/directives/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useAddDirectivesItems() {
  const query = useMutation((directive: DirectiveData) => addDirective(directive));

  return query;
}

export default useAddDirectivesItems;
