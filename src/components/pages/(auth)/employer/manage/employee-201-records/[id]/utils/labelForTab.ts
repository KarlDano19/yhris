// ./utils/labelForTab.ts
import type { TabKey } from "../components/EmployeeHeader";

export function labelForTab(key: TabKey) {
  switch (key) {
    case "personal":
      return "Personal Information";
    case "employment":
      return "Employment Details";
    case "training":
      return "Training & Development";
    case "disciplinary":
      return "Disciplinary Records";
    case "performance":
      return "Performance & Evaluation";
    case "benefits":
      return "Benefits & Compliance";
    case "documents":
      return "Document Repository";
    default:
      return key;
  }
}
