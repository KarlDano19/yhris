import type { Metadata, ResolvingMetadata } from 'next';

import Content from '@/components/pages/(applicant-side)/(un-auth)/apply-job-without-signup/job-detail/Content';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const id = params.id;
  const response = await fetch(`${process.env.NEXT_API_URL}/api/public/jobs/${id}/metadata/`).then((res) => res.json());
  
  let metaConfig = {};
  if (Object.keys(response).length !== 0) {
    metaConfig = {
      'title': `${response.og_title} - Yahshua HRIS`,
      'description': 'HRIS',
      ['fb:app_id']: '592696726158737',
      ['og:url']: response.og_url,
      ['og:type']: response.og_type,
      ['og:title']: response.og_title,
      ['og:description']: response.og_url,
      ['og:image']: response.og_image,
      ['og:image:width']: response.og_image_width,
      ['og:image:height']: response.og_image_height,
    }
  } else {
    metaConfig = {
      'title': `Job - Yahshua HRIS`,
      'description': 'HRIS',
    }
  }

  return {
    other: metaConfig,
  };
}

const JobsDetail = ({ params, searchParams }: Props) => {
  return <Content />;
};

export default JobsDetail;
