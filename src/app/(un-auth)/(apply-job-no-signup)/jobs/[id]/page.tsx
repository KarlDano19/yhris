import type { Metadata, ResolvingMetadata } from 'next';

import Content from '@/components/pages/(un-auth)/apply-job-without-signup/job-detail/Content';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const id = params.id;
  const response = await fetch(`${process.env.NEXT_API_URL}/api/public/jobs/${id}/metadata/`).then((res) => res.json());

  let metaConfig = {};
  let openGraphConfig = {};
  let metaData = {};
  if (Object.keys(response).length !== 0) {
    metaConfig = {
      title: `${response.og_title} - Yahshua HRIS`,
      description: 'HRISS',
    };
    openGraphConfig = {
      url: response.og_url,
      type: response.og_type,
      title: response.og_title,
      description: response.og_description,
      images: [
        {
          url: response.og_image,
          width: response.og_image_width,
          height: response.og_image_height,
        },
      ],
    };
    metaData = {
      other: metaConfig,
      openGraph: openGraphConfig,
    };
  } else {
    metaConfig = {
      title: `Job - Yahshua HRIS`,
      description: 'HRIS',
    };
    metaData = {
      other: metaConfig,
    };
  }

  return metaData;
}

const JobsDetail = ({ params, searchParams }: Props) => {
  return <Content />;
};

export default JobsDetail;
