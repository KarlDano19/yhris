import { useCallback, useState } from 'react';

export type BusinessFilters = {
  is_urgent?: boolean;
  category?: string;
  location?: string | string[];
  min_budget?: number;
  max_budget?: number;
  date_from?: string;
  date_to?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  page_size?: number;
  current_page?: number;
};

/**
 * Hook to manage business-mode filters (shared across pages).
 * - Keeps a filters object in state
 * - Provides a helper to apply modal payloads to the filters
 * - Provides reset and setter utilities
 */
export default function useBusinessModeFilters(initial?: BusinessFilters) {
  const [filters, setFilters] = useState<BusinessFilters>(initial || {});

  const applyFromModal = useCallback(
    (payload: {
      location?: string;
      skills?: string[]; // included for modal compatibility, not directly used
      urgentOnly?: boolean;
      category?: string;
      min_budget?: number;
      max_budget?: number;
      date_from?: string;
      date_to?: string;
    }) => {
      setFilters((prev) => {
        const next: BusinessFilters = { ...prev };

        if (payload.location) next.location = payload.location;
        if (payload.category) next.category = payload.category;
        if (payload.min_budget !== undefined) next.min_budget = payload.min_budget;
        if (payload.max_budget !== undefined) next.max_budget = payload.max_budget;
        if (payload.date_from) next.date_from = payload.date_from;
        if (payload.date_to) next.date_to = payload.date_to;

        // urgentOnly true sets is_urgent, false clears it
        if (payload.urgentOnly) {
          next.is_urgent = true;
        } else {
          // clear flag when user explicitly disables urgent toggle
          delete next.is_urgent;
        }

        return next;
      });
    },
    []
  );

  const resetFilters = useCallback(() => setFilters({}), []);

  return {
    filters,
    setFilters,
    applyFromModal,
    resetFilters,
  };
}






