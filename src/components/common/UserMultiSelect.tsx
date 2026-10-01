import { useEffect, useMemo, useState } from 'react';

import { Controller } from 'react-hook-form';
import Select from 'react-select';

import useGetUserSelect from '@/components/hooks/useGetUserSelect';

interface UserOption {
  value: number;
  label: string;
  email: string;
  status?: 'pending' | 'signed';
  isFixed?: boolean;
}

interface UserMultiSelectProps {
  control: any;
  name: string; // form field holding number[] of user_ids
  // user_ids whose chip cannot be removed (already signed)
  lockedIds?: number[];
  // user_id -> current signing status, used to badge the chip label
  statusById?: Record<number, 'pending' | 'signed'>;
  // user_id -> display name, so already-assigned signatories show a name even when the
  // user-list fetch doesn't include them (e.g. yourself, or outside the current search).
  namesById?: Record<number, string>;
  placeholder?: string;
}

const UserMultiSelect = ({
  control,
  name,
  lockedIds = [],
  statusById = {},
  namesById = {},
  placeholder = 'Add signatory...',
}: UserMultiSelectProps) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: users, isFetching } = useGetUserSelect(debouncedSearch || undefined);

  const options: UserOption[] = useMemo(() => {
    return (users ?? [])
      .filter((user) => user.is_active !== false)
      .map((user) => {
        const status = statusById[user.id];
        const baseLabel = user.name || user.email;
        return {
          value: user.id,
          label: status ? `${baseLabel} — ${status === 'signed' ? 'Signed' : 'Pending'}` : baseLabel,
          email: user.email,
          status,
          isFixed: lockedIds.includes(user.id),
        };
      });
  }, [users, statusById, lockedIds]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const selectedIds: number[] = Array.isArray(field.value) ? field.value : [];

        // Build the visible value, preferring fetched options but falling back to a
        // minimal option for ids not in the current search result set.
        const value: UserOption[] = selectedIds.map((id) => {
          const found = options.find((option) => option.value === id);
          if (found) return found;
          const status = statusById[id];
          const displayName = namesById[id] || `Signatory #${id}`;
          return {
            value: id,
            label: status ? `${displayName} — ${status === 'signed' ? 'Signed' : 'Pending'}` : displayName,
            email: '',
            status,
            isFixed: lockedIds.includes(id),
          };
        });

        return (
          <Select
            isMulti
            options={options}
            value={value}
            inputValue={search}
            onInputChange={(next) => setSearch(next)}
            onChange={(selected, actionMeta) => {
              // Never allow removing a locked (already-signed) signatory.
              if (
                (actionMeta.action === 'remove-value' || actionMeta.action === 'pop-value') &&
                actionMeta.removedValue?.isFixed
              ) {
                return;
              }
              if (actionMeta.action === 'clear') {
                // Keep the locked ones on a clear-all.
                field.onChange(selectedIds.filter((id) => lockedIds.includes(id)));
                return;
              }
              field.onChange((selected as UserOption[]).map((option) => option.value));
            }}
            isLoading={isFetching}
            placeholder={placeholder}
            classNamePrefix='react-select'
            isClearable={false}
            styles={{
              multiValueRemove: (base, state) =>
                (state.data as UserOption).isFixed ? { ...base, display: 'none' } : base,
            }}
            noOptionsMessage={() => (debouncedSearch ? 'No users found' : 'Type to search users')}
          />
        );
      }}
    />
  );
};

export default UserMultiSelect;
