import Navigation from "@/components/pages/(un-auth)/landing-page/Navigation";
import LpFooter from "@/components/pages/(un-auth)/landing-page/LpFooter";
import Content from "@/components/pages/(un-auth)/apply-job-without-signup/jobs/Content";

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
        <LpFooter />
      </div>
    </>
  );
};

export default Jobs;
