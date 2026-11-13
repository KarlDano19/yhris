import Content from '@/components/pages/(un-auth)/directives/Content';

import { DirectiveAckLink, DirectiveData } from '@/types/directives';

export const metadata = {
  title: 'Memo/Policy | YAHSHUA HRIS',
  description: 'View and confirm memo or policy',
  // The URL may carry the employee's acknowledgment token — never leak it to other sites
  referrer: 'no-referrer',
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string | string[] }>;
};

async function fetchDirective(
  id: string,
  token?: string
): Promise<{
  directive: Omit<DirectiveData, 'to'> | null;
  ackLink?: DirectiveAckLink | null;
  error?: string;
}> {
  try {
    const query = token ? `?t=${encodeURIComponent(token)}` : '';
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/directives/${id}/${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
    const { to: _to, ack_link: ackLink, ...directiveWithoutEmails } = data;

    return { directive: directiveWithoutEmails, ackLink: ackLink ?? null };
  } catch {
    return { directive: null, error: 'Failed to load this memo/policy.' };
  }
}

const DirectivePage = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  const { t } = await searchParams;
  const token = Array.isArray(t) ? t[0] : t;
  const { directive, ackLink, error } = await fetchDirective(id, token);
  return (
    <Content
      initialDirective={directive}
      initialError={error}
      ackLink={ackLink ?? null}
      ackToken={ackLink ? token ?? null : null}
    />
  );
};

export default DirectivePage;
