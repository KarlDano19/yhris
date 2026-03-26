import Content from "@/components/pages/(auth)/employer/evaluation/Content";
import SmartPagePermissionGuard from "@/components/SmartPermissions/SmartPagePermissionGuard";
import React from "react";

export const metadata = {
  title: "Evaluation - Yahshua HRIS",
};

const Evaluation = async () => {
  return (
    <SmartPagePermissionGuard permission="view_evaluation_page">
      <Content />
    </SmartPagePermissionGuard>
  );
};

export default Evaluation;
