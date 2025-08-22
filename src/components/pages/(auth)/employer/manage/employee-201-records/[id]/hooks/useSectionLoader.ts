import { useRef } from "react";
import type { TabKey } from "../components/EmployeeHeader";

type SectionState = {
  loaded: boolean;
  loading: boolean;
  dirty: boolean;
  saving: boolean;
  savedAt?: number;
};
type SectionMap = Record<TabKey, SectionState>;

/** Simulated fetch for a section. Replace with a real call if needed. */
async function mockFetchSection(_key: TabKey) {
  await new Promise<void>((resolve) => setTimeout(resolve, 600 + Math.random() * 600));
}

/**
 * Returns a race-safe loader for sections.
 * Commits the loaded state only if the in-flight token still matches.
 */
export function useSectionLoader(
  setSections: React.Dispatch<React.SetStateAction<SectionMap>>,
  fetcher: (key: TabKey) => Promise<void> = mockFetchSection
) {
  const inflight = useRef<Record<TabKey, number>>({} as any);

  async function loadSection(key: TabKey) {
    setSections((prev) => {
      const s = prev[key];
      if (!s || s.loaded || s.loading) return prev;
      return { ...prev, [key]: { ...s, loading: true } };
    });

    const token = Date.now();
    inflight.current[key] = token;

    try {
      await fetcher(key);
    } finally {
      if (inflight.current[key] === token) {
        setSections((prev) => ({
          ...prev,
          [key]: { ...prev[key], loading: false, loaded: true },
        }));
      }
    }
  }

  return { loadSection };
}
