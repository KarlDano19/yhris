'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { LockClosedIcon } from '@heroicons/react/24/outline';

import ModalLayout from '@/components/ModalLayout';
import CustomToast from '@/components/CustomToast';

import { useLegacyPermissions } from '@/hooks/useLegacyPermissions';
import { getPermissionForElement } from '@/config/ui-permissions';
import { QUICK_ACCESS_CATALOG, MAX_QUICK_ACCESS_ITEMS } from '@/config/quick-access-catalog';
import useUpdateQuickAccess from './hooks/useUpdateQuickAccess';

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  currentItems: string[];
};

export default function QuickAccessEditModal({ isOpen, handleClose, currentItems }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const { mutate, isLoading } = useUpdateQuickAccess();
  const cachedRights = useLegacyPermissions();

  useEffect(() => {
    if (isOpen) {
      setSelected([...currentItems]);
    }
  }, [isOpen, currentItems]);

  const toggle = (id: string) => {
    const catalogItem = QUICK_ACCESS_CATALOG.find((i) => i.id === id);
    const requiredPermission = catalogItem ? getPermissionForElement(catalogItem.permissionId) : null;
    const hasPermission = requiredPermission
      ? cachedRights?.state?.data?.[requiredPermission] || false
      : true;

    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id); // always allow deselect
      if (!hasPermission) return prev;                              // block no-permission adds
      if (prev.length >= MAX_QUICK_ACCESS_ITEMS) return prev;
      return [...prev, id];
    });
  };

  const handleSave = () => {
    mutate(selected, {
      onSuccess: () => {
        toast.custom(() => <CustomToast message='Quick Access updated.' type='success' />, {
          duration: 3000,
        });
        handleClose();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err?.message || 'Failed to update Quick Access.'} type='error' />, {
          duration: 4000,
        });
      },
    });
  };

  // Group catalog items by parentModule for discoverability
  const groups = QUICK_ACCESS_CATALOG.reduce<Record<string, typeof QUICK_ACCESS_CATALOG>>((acc, item) => {
    if (!acc[item.parentModule]) acc[item.parentModule] = [];
    acc[item.parentModule].push(item);
    return acc;
  }, {});

  const atLimit = selected.length >= MAX_QUICK_ACCESS_ITEMS;

  return (
    <ModalLayout isOpen={isOpen} handleClose={handleClose} title='Edit Quick Access'>
      <div className='p-6'>
        <p className='text-sm text-gray-500 mb-4'>
          Select up to {MAX_QUICK_ACCESS_ITEMS} sub-modules for quick access.{' '}
          <span className={atLimit ? 'text-red-500 font-semibold' : 'text-gray-700'}>
            {selected.length} / {MAX_QUICK_ACCESS_ITEMS} selected
          </span>
        </p>

        <div className='max-h-[60vh] overflow-y-auto space-y-6 pr-1'>
          {Object.entries(groups).map(([module, items]) => (
            <div key={module}>
              <h4 className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2'>
                {module}
              </h4>
              <div className='grid grid-cols-2 gap-2'>
                {items.map((item) => {
                  const isSelected = selected.includes(item.id);
                  const requiredPermission = getPermissionForElement(item.permissionId);
                  const hasPermission = requiredPermission
                    ? cachedRights?.state?.data?.[requiredPermission] || false
                    : true;
                  const isLockedChecked = isSelected && !hasPermission;
                  const isNoPermUnchecked = !hasPermission && !isSelected;
                  const isAtLimitUnchecked = !isSelected && atLimit;
                  const isDisabled = isNoPermUnchecked || isAtLimitUnchecked;
                  return (
                    <label
                      key={item.id}
                      className={`flex items-center gap-2 p-2 rounded-md border transition-colors ${
                        isLockedChecked
                          ? 'border-amber-300 bg-amber-50 cursor-pointer'
                          : isSelected
                          ? 'border-savoy-blue bg-blue-50 cursor-pointer'
                          : isDisabled
                          ? `border-gray-200 bg-gray-50 cursor-not-allowed ${isNoPermUnchecked ? 'opacity-40' : 'opacity-50'}`
                          : 'border-gray-200 hover:border-savoy-blue hover:bg-blue-50 cursor-pointer'
                      }`}
                    >
                      <input
                        type='checkbox'
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => toggle(item.id)}
                        className='accent-savoy-blue shrink-0'
                      />
                      {/* Icon: absolute-centered so no clipping regardless of SVG viewBox offsets */}
                      <div style={{ width: 22, height: 22, flexShrink: 0, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(0.32)', transformOrigin: 'center center' }}>
                          <item.iconComponent />
                        </div>
                      </div>
                      <span className='text-sm text-gray-700 leading-tight'>{item.label}</span>
                      {isLockedChecked && (
                        <span className='ml-auto flex items-center gap-0.5 text-xs text-amber-600 font-medium shrink-0'>
                          <LockClosedIcon className='w-3 h-3' />
                          No access
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-end gap-3 mt-6'>
          <button
            type='button'
            onClick={handleClose}
            className='px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleSave}
            disabled={isLoading}
            className='px-4 py-2 text-sm text-white bg-savoy-blue rounded-md hover:opacity-90 disabled:opacity-60'
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
}
