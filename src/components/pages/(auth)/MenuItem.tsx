import Link from 'next/link';

import { Tooltip } from 'react-tooltip';

function MenuItem({ menu, onGrayedOutClick }: { menu: any; onGrayedOutClick?: (link: string) => void }) {
  const isGrayedOut = menu.isGrayedOut || false;
  
  const handleGrayedOutClick = () => {
    if (onGrayedOutClick && menu.link) {
      onGrayedOutClick(menu.link);
    }
  };
  
  return (
    <>
      {(menu.isAvailable && menu.link) && (
        <Link
          href={menu.link}
          aria-disabled={isGrayedOut}
          className={`bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none focus:opacity-80 ${
            isGrayedOut ? 'opacity-50 cursor-pointer' : ''
          }`}
          onClick={isGrayedOut ? (e) => {
            e.preventDefault();
            handleGrayedOutClick();
          } : undefined}
        >
          {menu.icon}
          <h3 className='text-indigo-dye font-semibold text-center'>{menu.text}</h3>
        </Link>
      )}
      {(menu.isAvailable && menu.onClickEvent) && (
        <div
          className={`cursor-pointer bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none ${
            isGrayedOut ? 'opacity-50 cursor-pointer' : ''
          }`}
          onClick={isGrayedOut ? handleGrayedOutClick : menu.onClickEvent}
        >
          {menu.icon}
          <h3 className='text-indigo-dye font-semibold text-center'>{menu.text}</h3>
        </div>
      )}
      {!menu.isAvailable && (
        <>
          <div
            data-tooltip-id='dashboard-item-tooltip'
            data-tooltip-content='Coming soon.'
            data-tooltip-place='bottom'
            aria-disabled={true}
            className='bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none  opacity-50'
          >
            {menu.icon}
            <h3 className='text-indigo-dye font-semibold text-center'>{menu.text}</h3>
          </div>
          <Tooltip id='dashboard-item-tooltip' />
        </>
      )}
    </>
  );
}

export default MenuItem;
