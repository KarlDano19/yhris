import Content from "@/components/pages/(auth)/employer/onboarding/hired-applicants/Content";
import SmartPagePermissionGuard from "@/components/SmartPermissions/SmartPagePermissionGuard";
import React from "react";

export const metadata = {
  title: "Onboarding - Yahshua HRIS",
};

const Onboarding = async () => {
  return (
    <SmartPagePermissionGuard permission="view_onboarding_page">
      <Content />
    </SmartPagePermissionGuard>
  );
};

export default Onboarding;
