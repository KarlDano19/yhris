import Content from "@/components/pages/(auth)/yahshua-connect/tabs/personal-mode/Content";
import PersonalModeLayout from "@/components/pages/(auth)/yahshua-connect/tabs/personal-mode/PersonalModeLayout";

export const metadata = {
  title: "Personal Mode - YAHSHUA CONNECT",
  description: "YAHSHUA CONNECT - Personal Mode Dashboard",
};

const YahshuaConnectPersonalMode = async () => {
  return (
    <PersonalModeLayout>
      <Content />
    </PersonalModeLayout>
  );
};

export default YahshuaConnectPersonalMode;
