import Content from "@/components/pages/(un-auth)/apply-job-without-signup/jobs/Content";

export const metadata = {
  title: 'Jobs - Yahshua HRIS',
  description: 'HRIS',
};

const Jobs = () => {
  return (
    <div style={{ background: "hsl(var(--lp-page))" }} className="min-h-screen">
      <Content />
    </div>
  );
};

export default Jobs;
