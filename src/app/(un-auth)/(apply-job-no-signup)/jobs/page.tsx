import Content from "@/components/pages/(un-auth)/apply-job-without-signup/jobs/Content";
import Navigation from "@/components/pages/(un-auth)/landing-page/Navigation";

export const metadata = {
  title: 'Jobs - Yahshua HRIS',
  description: 'HRIS',
};

const Jobs = () => {
  return (
    <>
      <Navigation />
      <div style={{ background: "hsl(var(--lp-page))" }} className="min-h-screen">
        <Content />
      </div>
    </>
  );
};

export default Jobs;
