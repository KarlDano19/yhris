'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

interface Props {
  label: string;
  className?: string;
  onClick?: () => void;
}

export default function BackButton({ label, className, onClick }: Props) {
  const router = useRouter();
  return (
    <button
      onClick={onClick ?? (() => router.back())}
      className={className ?? 'flex-none flex gap-3 items-center hover:bg-gray-200'}
    >
      <ArrowLeftIcon className='h-5 w-5' />
      <h4>{label}</h4>
    </button>
  );
}
