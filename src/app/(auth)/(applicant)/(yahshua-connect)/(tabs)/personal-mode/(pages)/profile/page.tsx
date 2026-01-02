import Content from "@/components/pages/(auth)/yahshua-connect/tabs/personal-mode/pages/profile/Content";
import PersonalModeLayout from "@/components/pages/(auth)/yahshua-connect/tabs/personal-mode/PersonalModeLayout";

export const metadata = {
  title: "Profile - YAHSHUA CONNECT",
  description: "View and manage your profile - YAHSHUA Student Information System",
};

const ProfilePage = async () => {
  return (
    <PersonalModeLayout>
      <Content />
    </PersonalModeLayout>
  );
};

export default ProfilePage;

