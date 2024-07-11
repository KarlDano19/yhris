import type { Metadata, ResolvingMetadata } from 'next';

import Content from '@/components/pages/(un-auth)/apply-job-without-signup/job-detail/Content';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    const id = params.id;
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    const res = await fetch(`${process.env.NEXT_API_URL}/api/public/jobs/${id}/metadata/`, config);
    if (!res.ok) {
      throw res.json();
    }
    const json_response = await res.json();
    let metaConfig = {};
    let openGraphConfig = {};
    let metaData = {};
    if (Object.keys(json_response).length !== 0) {
      metaConfig = {
        title: `${json_response.og_title} - Yahshua HRIS`,
        description: 'HRISS',
      };
      openGraphConfig = {
        url: json_response.og_url,
        type: json_response.og_type,
        title: json_response.og_title,
        description: json_response.og_description,
        images: [
          {
            url: json_response.og_image,
            width: json_response.og_image_width,
            height: json_response.og_image_height,
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
  } catch (err: any) {
    let errStringify = await err;
    console.error(errStringify)
    return {};
  }
}

const JobsDetail = ({ params, searchParams }: Props) => {
  return <Content />;
};

export default JobsDetail;
