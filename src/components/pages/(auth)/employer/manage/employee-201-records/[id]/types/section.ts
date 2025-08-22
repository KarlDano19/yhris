// ./types/section.ts
import type { TabKey } from "../components/EmployeeHeader";

export type SectionState = {
  loaded: boolean;
  loading: boolean;
  dirty: boolean;
  saving: boolean;
  savedAt?: number;
};

export type SectionMap = Record<TabKey, SectionState>;

export const sectionOrder: TabKey[] = [
  "personal",
  "employment",
  "training",
  "disciplinary",
  "performance",
  "benefits",
  "documents",
];
