import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { DirectiveData } from '@/types/directives';
import { appendLetterhead } from '@/helpers/letterhead';

export interface MemoPreviewInput extends DirectiveData {
  directiveId?: number; // Lets the backend read a signature/letterhead already stored on this memo
}

/**
 * Renders the memo/policy PDF for content that has not been saved yet.
 *
 * The preview is the real document rather than a React lookalike, so what the user approves
 * is byte-identical to what recipients open. Returns an object URL the caller must revoke.
 */
async function generateMemoPreview(directive: MemoPreviewInput): Promise<string> {
  try {
    const token = getCookie('token');
    const data = new FormData();

    data.append('directive_type', directive.directive_type || 'memo');
    data.append('title', directive.title || '');

    if (directive.directiveId) data.append('directive_id', String(directive.directiveId));

    // Both document types print on the letterhead. When the user has not picked a new one the
    // backend falls back to the letterhead already stored on directive_id, so editing an
    // existing memo previews on the same page recipients will open.
    appendLetterhead(data, directive.letterhead);

    if (directive.directive_type === 'policy') {
      data.append('eligibility', directive.eligibility || '');
      data.append('application', directive.application || '');
      data.append('coverage', directive.coverage || '');
      data.append('termination', directive.termination || '');
      if (directive.custom_policy_fields) {
        data.append('custom_policy_fields', JSON.stringify(directive.custom_policy_fields));
      }
    } else {
      data.append('body', directive.body || '');
      data.append('name', directive.name || '');
      data.append('position', directive.position || '');
      data.append('signature_placement', directive.signature_placement || '');

      // A signature the user just drew arrives as a data URL and a picked one as a File;
      // either way it is sent inline. When neither is present the backend falls back to the
      // signature already stored on directive_id, so editing an existing memo still previews
      // with its signature.
      if (typeof directive.signature === 'string' && directive.signature.startsWith('data:')) {
        const signatureBlob = await fetch(directive.signature).then((res) => res.blob());
        data.append('signature', signatureBlob, 'signature.png');
      } else if (directive.signature instanceof FileList && directive.signature.length > 0) {
        data.append('signature', directive.signature[0]);
      } else if (directive.signature instanceof File) {
        data.append('signature', directive.signature);
      }
    }

    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: data,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/directives/preview-document/`,
      config
    );
    if (!res.ok) {
      throw res.json();
    }

    return URL.createObjectURL(await res.blob());
  } catch (err: any) {
    const errStringify = await err;
    if (errStringify && Object.hasOwn(errStringify, 'message')) throw new Error(errStringify.message);
    throw new Error('Failed to generate the preview.');
  }
}

function useGenerateMemoPreview() {
  return useMutation((directive: MemoPreviewInput) => generateMemoPreview(directive));
}

export default useGenerateMemoPreview;
