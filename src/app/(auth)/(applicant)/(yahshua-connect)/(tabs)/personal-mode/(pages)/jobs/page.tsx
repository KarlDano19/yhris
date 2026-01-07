import Content from "@/components/pages/(auth)/yahshua-connect/tabs/personal-mode/pages/jobs/Content";
import PersonalModeLayout from "@/components/pages/(auth)/yahshua-connect/tabs/personal-mode/PersonalModeLayout";

export const metadata = {
  title: "Jobs - YAHSHUA CONNECT",
  description: "Browse and apply for jobs - YAHSHUA Student Information System",
};

const JobsPage = async () => {
  return (
    <PersonalModeLayout>
      <Content />
    </PersonalModeLayout>
  );
};

export default JobsPage;

