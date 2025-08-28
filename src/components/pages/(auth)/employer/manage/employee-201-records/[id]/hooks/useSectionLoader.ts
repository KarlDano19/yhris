// hooks/useSectionLoader.ts
import { useRef, useCallback } from "react";
import type { TabKey } from "../components/EmployeeHeader";

type BaseSectionState = {
  loaded: boolean;
  loading: boolean;
  dirty: boolean;
  saving: boolean;
  savedAt?: number;
};

/** Simulated fetch; replace with your real call if needed. */
async function mockFetchSection(_key: TabKey) {
  await new Promise<void>((resolve) =>
    setTimeout(resolve, 600 + Math.random() * 600)
  );
}

/**
 * Race-safe loader for sections.
 * Generic over your own SectionMap type.
 */
export function useSectionLoader<TMap extends Record<TabKey, BaseSectionState>>(
  setSections: React.Dispatch<React.SetStateAction<TMap>>,
  fetcher: (key: TabKey) => Promise<void> = mockFetchSection
) {
  const inflight = useRef<Partial<Record<TabKey, number>>>({});

  const loadSection = useCallback(
    async (key: TabKey) => {
      // optimistically mark loading
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
        // commit only if still latest
        if (inflight.current[key] === token) {
          setSections((prev) => ({
            ...prev,
            [key]: { ...prev[key], loading: false, loaded: true },
          }));
        }
      }
    },
    [setSections, fetcher]
  );

  return { loadSection };
}
