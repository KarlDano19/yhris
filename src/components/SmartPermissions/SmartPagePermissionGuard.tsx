'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import { useHasPermission, useUserPermissions } from '@/hooks/useUserPermissions';

interface Props {
  permission: string;
  children: React.ReactNode;
}

export default function SmartPagePermissionGuard({ permission, children }: Props) {
  const router = useRouter();
  const { isLoading } = useUserPermissions();
  const hasPermission = useHasPermission(permission);

  useEffect(() => {
    if (!isLoading && !hasPermission) {
      toast.custom(
        () => <CustomToast message="You don't have permission to access this page." type="error" />,
        { duration: 4000 }
      );
      router.replace('/dashboard');
    }
  }, [isLoading, hasPermission, router]);

  if (isLoading || !hasPermission) return null;

  return <>{children}</>;
}
