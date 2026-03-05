import Content from '@/components/pages/(un-auth)/directives/Content';

import { DirectiveData } from '@/types/directives';

export const metadata = {
  title: 'Memo/Policy | YAHSHUA HRIS',
  description: 'View and confirm memo or policy',
};

type Props = {
  params: { id: string };
};

async function fetchDirective(
  id: string
): Promise<{ directive: Omit<DirectiveData, 'to'> | null; error?: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/directives/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': process.env.INTERNAL_API_SECRET ?? '',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        directive: null,
        error: errorData.message || `Failed to load this memo/policy.`,
      };
    }

    const data = await res.json();

    // Strip 'to' field — never send recipient emails to the browser
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { to: _to, ...directiveWithoutEmails } = data;

    return { directive: directiveWithoutEmails };
  } catch {
    return { directive: null, error: 'Failed to load this memo/policy.' };
  }
}

const DirectivePage = async ({ params }: Props) => {
  const { directive, error } = await fetchDirective(params.id);
  return <Content initialDirective={directive} initialError={error} />;
};

export default DirectivePage;
