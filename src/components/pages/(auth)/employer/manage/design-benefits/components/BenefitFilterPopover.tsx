import { useEffect, useMemo, useState } from 'react';

import useGetDepartmentItems from '@/components/hooks/useGetDepartmentItems';
import useGetPositionItems from '@/components/hooks/useGetPositionItems';

import SelectChevronDown from '@/svg/SelectChevronDown';
import FilterIcon from '@/svg/FilterIcon';

export type T_BenefitFilterValues = {
  department: string;
  position: string;
};

type ApiItem = { id: number; name: string };
type Option = { value: string; label: string };

const toOptions = (items?: ApiItem[]): Option[] => {
  const base: Option[] = [{ value: 'ALL', label: 'ALL' }];
  const dynamic: Option[] = (items ?? [])
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => ({ value: item.name, label: item.name }));
  return [...base, ...dynamic];
};

const ensureValue = (value: string, options: Option[]) =>
  options.some((option) => option.value === value) ? value : 'ALL';

const BenefitFilterPopover = ({
  open,
  onOpenChange,
  initial,
  onApply,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: T_BenefitFilterValues;
  onApply: (vals: T_BenefitFilterValues) => void;
}) => {
  const [draft, setDraft] = useState<T_BenefitFilterValues>(initial);

  const { data: departmentItems, isLoading: isDeptLoading } = useGetDepartmentItems();
  const { data: positionItems, isLoading: isPosLoading } = useGetPositionItems();

  const departmentOptions = useMemo(() => toOptions(departmentItems as ApiItem[]), [departmentItems]);
  const positionOptions = useMemo(() => toOptions(positionItems as ApiItem[]), [positionItems]);

  useEffect(() => {
    if (open) {
      setDraft(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const anyLoading = isDeptLoading || isPosLoading;

  const handleReset = () => {
    setDraft({ department: 'ALL', position: 'ALL' });
  };

  const handleSearch = () => {
    onApply(draft);
    onOpenChange(false);
  };

  return (
    <div className='relative'>
      <button
        onClick={() => onOpenChange(!open)}
        className='flex items-center gap-2 border border-gray-300 bg-white px-3 h-10 text-sm rounded-md hover:bg-gray-50'
        aria-haspopup='dialog'
        aria-expanded={open}
      >
        <FilterIcon />
        <span className='text-gray-800 font-medium'>Filter</span>
      </button>

      {open && (
        <div
          role='dialog'
          aria-label='Benefit filters'
          className='absolute z-40 mt-2 right-0 w-[75vw] max-w-[240px] sm:w-[260px] sm:max-w-none rounded-xl border border-gray-200 bg-white shadow-xl'
        >
          <div className='p-3 space-y-2.5'>
            {/* Department */}
            <div>
              <label className='block text-xs font-semibold text-gray-800 mb-1'>Department</label>
              <div className='relative'>
                <select
                  value={ensureValue(draft.department, departmentOptions)}
                  onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
                  className='w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 pr-8 text-xs text-gray-700 focus:border-[#355fd0] outline-none disabled:opacity-60'
                  disabled={anyLoading}
                >
                  {departmentOptions.map((option) => (
                    <option key={`dept-${option.value}`} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 scale-75'>
                  <SelectChevronDown />
                </div>
              </div>
            </div>

            {/* Position */}
            <div>
              <label className='block text-xs font-semibold text-gray-800 mb-1'>Position</label>
              <div className='relative'>
                <select
                  value={ensureValue(draft.position, positionOptions)}
                  onChange={(e) => setDraft((d) => ({ ...d, position: e.target.value }))}
                  className='w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 pr-8 text-xs text-gray-700 focus:border-[#355fd0] outline-none disabled:opacity-60'
                  disabled={anyLoading}
                >
                  {positionOptions.map((option) => (
                    <option key={`pos-${option.value}`} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 scale-75'>
                  <SelectChevronDown />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className='pt-1 flex items-center justify-between gap-2'>
              <button
                onClick={handleReset}
                className='rounded-md border border-[#355fd0] bg-white px-3 py-1.5 text-xs font-medium text-[#355fd0] hover:bg-[#355fd0]/10'
              >
                Reset
              </button>
              <button
                onClick={handleSearch}
                className='rounded-md bg-[#355fd0] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#355fd0]/90 disabled:opacity-60'
                disabled={anyLoading}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BenefitFilterPopover;
