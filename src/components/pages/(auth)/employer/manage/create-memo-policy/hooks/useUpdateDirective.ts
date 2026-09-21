import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { DirectiveData } from '@/types/directives';
import { appendLetterhead } from '@/helpers/letterhead';
import { extractInlineImageFiles } from './extractInlineImageFiles';

async function updateDirective(directive: DirectiveData) {
  try {
    const token = getCookie('token');
    const formData = new FormData();

    if (directive.title !== undefined) formData.append('title', directive.title);
    formData.append('to', JSON.stringify(directive.to));
    formData.append('directive_type', directive.directive_type || '');

    // Multi-signatory reconciliation. Send whenever the field is present so the backend
    // adds/removes assignments; already-signed signatories are preserved server-side.
    if (Array.isArray(directive.signatories)) {
      const userIds = directive.signatories.map((signatory: any) =>
        typeof signatory === 'object' ? signatory.user_id : signatory
      );
      formData.append('signatories', JSON.stringify(userIds));
    }

    if (directive.attachments) {
      if (Array.isArray(directive.attachments)) {
        directive.attachments.forEach((item) => {
          if (item instanceof File) formData.append('attachments', item);
        });
      } else if (directive.attachments instanceof File) {
        formData.append('attachments', directive.attachments);
      }
    }

    // Upload mode — a freshly picked PDF replaces whatever document the memo had. Sending
    // document_source on every save is what lets the user switch back to form mode: the
    // backend re-renders the document as soon as it stops being "uploaded".
    if (directive.document instanceof File) {
      formData.append('document', directive.document);
    }
    if (directive.document_source !== undefined) {
      formData.append('document_source', directive.document_source || '');
    }

    if (directive.directive_type === 'memo') {
      if (directive.body !== undefined) formData.append('body', directive.body);
      if (directive.name !== undefined) formData.append('name', directive.name);
      if (directive.position !== undefined) formData.append('position', directive.position);

      // Any images embedded (as base64) in the body get uploaded alongside this same
      // request — the backend ties them to the directive and swaps the body's base64
      // src for the resulting storage path.
      if (directive.body) {
        const inlineImageFiles = await extractInlineImageFiles(directive.body);
        inlineImageFiles.forEach((file) => formData.append('inline_images', file));
      }
      if (directive.signature) {
        if (typeof directive.signature === 'string' && directive.signature.length) {
          const signatureBlob = await fetch(directive.signature).then((res) => res.blob());
          formData.append('signature', signatureBlob, 'signature.jpg');
        } else if (directive.signature instanceof FileList && directive.signature.length > 0) {
          formData.append('signature', directive.signature[0]);
        } else if (directive.signature instanceof File) {
          formData.append('signature', directive.signature);
        }
      }
      if (directive.qr_code instanceof File) {
        formData.append('qr_code', directive.qr_code);
      }
      // Always sent, empty string included, so resetting the signature back to the flow
      // layout actually persists instead of leaving the old coordinates in place.
      if (directive.signature_placement !== undefined) {
        formData.append('signature_placement', directive.signature_placement || '');
      }
    } else {
      if (directive.eligibility !== undefined) formData.append('eligibility', directive.eligibility);
      if (directive.application !== undefined) formData.append('application', directive.application);
      if (directive.coverage !== undefined) formData.append('coverage', directive.coverage);
      if (directive.termination !== undefined) formData.append('termination', directive.termination);
      if (directive.custom_policy_fields !== undefined) {
        formData.append('custom_policy_fields', JSON.stringify(directive.custom_policy_fields));
      }
    }

    // Only a newly picked file is sent — a letterhead already on the memo arrives as a URL
    // and appendLetterhead skips it, so re-saving does not re-upload the same image.
    appendLetterhead(formData, directive.letterhead);

    const config = {
      method: 'PATCH',
      headers: { Authorization: `Token ${token}` },
      body: formData,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directive.id}/manage/`, config);
    if (!res.ok) throw res.json();
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) throw errStringify.response.data.message;
    throw errStringify.message;
  }
}

function useUpdateDirective() {
  const mutation = useMutation((data: DirectiveData) => updateDirective(data));
  return mutation;
}

export default useUpdateDirective;
