import Content from "@/components/pages/(auth)/yahshua-connect/tabs/personal-mode/pages/trainings/Content";
import PersonalModeLayout from "@/components/pages/(auth)/yahshua-connect/tabs/personal-mode/PersonalModeLayout";

export const metadata = {
  title: "Trainings - YAHSHUA CONNECT",
  description: "Access training courses and programs - YAHSHUA Student Information System",
};

const TrainingsPage = async () => {
  return (
    <PersonalModeLayout>
      <Content />
    </PersonalModeLayout>
  );
};

export default TrainingsPage;

