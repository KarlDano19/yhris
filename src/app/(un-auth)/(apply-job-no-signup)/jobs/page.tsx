import Content from "@/components/pages/(un-auth)/apply-job-without-signup/jobs/Content";

export const metadata = {
  title: 'Browse Jobs - Yahshua HRIS',
  description: 'Browse open job positions from Philippine companies hiring on YAHSHUA HRIS. Find your next opportunity and apply directly.',
  alternates: {
    canonical: 'https://yahshuahris.com/jobs',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/jobs#webpage",
      "name": "Browse Jobs on YAHSHUA HRIS",
      "description": "Browse open job positions from Philippine companies hiring on YAHSHUA HRIS.",
      "url": "https://yahshuahris.com/jobs",
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    }
  ]
};

const Jobs = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Content />
    </>
  );
};

export default Jobs;
