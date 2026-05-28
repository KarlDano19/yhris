'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

interface Props {
  label: string;
  href?: string;
  className?: string;
  onClick?: () => void;
}

export default function BackButton({ label, href, className, onClick }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    // Custom handler takes full control (e.g. unsaved-changes guard in OSH Program)
    if (onClick) {
      onClick();
      return;
    }

    // If the user arrived via Quick Access, go back to wherever they came from
    // (QuickAccessPanel stores the destination path in sessionStorage before pushing)
    const fromQA = sessionStorage.getItem('fromQuickAccess');
    if (fromQA === pathname) {
      sessionStorage.removeItem('fromQuickAccess');
      router.back();
      return;
    }

    // Normal navigation: push to the hardcoded parent page
    if (href) {
      router.push(href);
      return;
    }

    // Fallback
    router.back()

  };

  return (
    <button
      onClick={handleClick}
      className={className ?? 'flex-none flex gap-3 items-center hover:bg-gray-200'}
    >
      <ArrowLeftIcon className='h-5 w-5' />
      <h4>{label}</h4>
    </button>
  );
}
