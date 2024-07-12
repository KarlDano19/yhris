'use client';

import { Popover } from '@headlessui/react';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import classNames from '@/helpers/classNames';

import {
  Bars3Icon,
  XMarkIcon,
  StarIcon,
  TagIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import MainLogo from '@/svg/MainLogo';
import ExitIcon from '@/svg/ExitIcon';
import CaseIcon from '@/svg/CaseIcon';

const UnauthorizedHeader = () => {
  const pathName = usePathname();

  return (
    <>
      <Popover
        as='header'
        className={({ open }) =>
          classNames(open ? 'fixed inset-0 z-40 overflow-y-auto' : '', 'bg-white shadow-md relative')
        }
      >
        {({ open }) => (
          <>
            <div className={`mx-auto max-w-7xl px-4 py-1 sm:px-6 lg:px-8 `}>
              <div className='flex justify-between lg:gap-8 p-2 lg:p-4'>
                <div className='flex lg:static'>
                  <div className='flex flex-shrink-0 items-center'>
                    <Link href='/'>
                      <MainLogo />
                    </Link>
                  </div>
                </div>
                <div className='flex items-center lg:hidden'>
                  {/* Mobile menu button */}
                  <Popover.Button className='-mx-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500'>
                    <span className='sr-only'>Open menu</span>
                    {open ? (
                      <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                    ) : (
                      <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                    )}
                  </Popover.Button>
                </div>
                <div className='hidden lg:flex lg:items-center lg:justify-end lg:space-x-8'>
                  <Link
                    href='/features'
                    className={`${
                      pathName === '/features' ? 'text-savoy-blue' : 'text-indigo-dye'
                    } flex items-center font-semibold opacity-50 pointer-events-none`}
                  >
                    <StarIcon
                      className={`${pathName === '/features' ? 'text-savoy-blue' : 'text-indigo-dye'} h-4 w-4 mr-2.5`}
                    />
                    Features
                  </Link>
                  <Link
                    href='/pricing'
                    className={`${
                      pathName === '/pricing' ? 'text-savoy-blue' : 'text-indigo-dye'
                    }  flex items-center font-semibold`}
                  >
                    <TagIcon
                      className={`${pathName === '/pricing' ? 'text-savoy-blue' : 'text-indigo-dye'} h-4 w-4 mr-2.5`}
                    />
                    Pricing
                  </Link>
                  <Link
                    href='/demo'
                    className={`${
                      pathName === '/demo' ? 'text-savoy-blue' : 'text-indigo-dye'
                    } flex items-center font-semibold opacity-50 pointer-events-none`}
                  >
                    <InformationCircleIcon
                      className={`${pathName === '/demo' ? 'text-savoy-blue' : 'text-indigo-dye'} h-5 w-5 mr-2.5`}
                    />
                    Request Demo
                  </Link>
                  <Link
                    href='/jobs'
                    className={`${
                      pathName === '/jobs' || pathName === '/job-app-form' ? 'text-savoy-blue' : 'text-indigo-dye'
                    } flex items-center font-semibold`}
                  >
                    <CaseIcon
                      className={`${
                        pathName === '/jobs' || pathName === '/job-app-form' ? 'fill-savoy-blue' : 'fill-indigo-dye'
                      } h-4 w-4 mt-0.5 mr-2.5`}
                    />
                    Jobs
                  </Link>
                  <Link href='/login'>
                    <button
                      type='button'
                      className='rounded-md text-indigo-dye bg-[#FFC107] px-6 py-1 font-bold shadow-sm hover:bg-amber-500'
                    >
                      Sign In
                    </button>
                  </Link>
                  {/* <Link href='#'>
                    <MagnifyingGlassIcon
                      className={`${pathName === '/search' ? 'text-savoy-blue' : 'text-indigo-dye'} h-6 w-6`}
                    />
                  </Link> */}
                </div>
              </div>
            </div>
            <Popover.Panel as='nav' className='lg:hidden' aria-label='Global'>
              <div className='mx-auto max-w-3xl space-y-1 px-6 pb-3 pt-2 sm:px-14'>
                <div className='shadow rounded-md'>
                  <Link
                    href='/features'
                    className={`${
                      pathName === '/features' ? 'text-savoy-blue bg-gray-50' : 'text-indigo-dye'
                    } flex items-center font-semibold px-4 py-4`}
                  >
                    <StarIcon
                      className={`${pathName === '/features' ? 'text-savoy-blue' : 'text-indigo-dye'} h-4 w-4 mr-2.5`}
                    />
                    Features
                  </Link>
                  <Link
                    href='/pricing'
                    className={`${
                      pathName === '/pricing' ? 'text-savoy-blue bg-gray-50' : 'text-indigo-dye'
                    }  flex items-center font-semibold px-4 py-4`}
                  >
                    <TagIcon
                      className={`${pathName === '/pricing' ? 'text-savoy-blue' : 'text-indigo-dye'} h-4 w-4 mr-2.5`}
                    />
                    Pricing
                  </Link>
                  <Link
                    href='/demo'
                    className={`${
                      pathName === '/demo' ? 'text-savoy-blue bg-gray-50' : 'text-indigo-dye'
                    } flex items-center font-semibold px-4 py-4`}
                  >
                    <InformationCircleIcon
                      className={`${pathName === '/demo' ? 'text-savoy-blue' : 'text-indigo-dye'} h-5 w-5 mr-1.5`}
                    />
                    Request Demo
                  </Link>
                  <Link
                    href='/jobs'
                    className={`${
                      pathName === '/jobs' ? 'text-savoy-blue bg-gray-50' : 'text-indigo-dye'
                    } flex items-center font-semibold px-4 py-4`}
                  >
                    <CaseIcon
                      className={`${pathName === '/demo' ? 'fill-savoy-blue' : 'fill-indigo-dye'} h-4 w-4 mr-2.5`}
                    />
                    Jobs
                  </Link>
                  <Link
                    href='/login'
                    className={`${
                      pathName === '/login' ? 'text-savoy-blue bg-gray-50' : 'text-indigo-dye'
                    } flex items-center font-semibold px-4 py-4`}
                  >
                    <ExitIcon
                      className={`${
                        pathName === '/login' ? 'fill-savoy-blue bg-gray-50' : 'fill-indigo-dye'
                      } h-4 w-4 mr-2`}
                    />
                    Sign In
                  </Link>
                  {/* <Link
                    href='#'
                    className={`${
                      pathName === '/login' ? 'text-savoy-blue bg-gray-50' : 'text-indigo-dye'
                    } flex items-center font-semibold px-4 py-4`}
                  >
                    <MagnifyingGlassIcon
                      className={`${pathName === '/search' ? 'text-savoy-blue' : 'text-indigo-dye'} h-4 w-4 mr-2`}
                    />
                    Search
                  </Link> */}
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </>
  );
};

export default UnauthorizedHeader;
