import React, { useState, useEffect } from 'react';

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import ChatBubbleIcon from '@/svg/ChatBubbleIcon';

const FloatingHelpButton = ({ companyName }: { companyName?: string }) => {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [isMenuShow, setShowMenu] = useState(false);
  const [showHelpText, setShowHelpText] = useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (isMenuShow) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuShow]);

  useEffect(() => {
    let showTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;
  
    const showHideHelpText = () => {
      if (!isMenuShow) {
        showTimeout = setTimeout(() => {
          setShowHelpText(true);
          hideTimeout = setTimeout(() => {
            setShowHelpText(false);
            showTimeout = setTimeout(showHideHelpText, 10000);
          }, 3000);
        }, 10000);
      }
    };
  
    showHideHelpText();
  
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [isMenuShow]);

  return (
    <div className='fixed z-10 md:z-50 bottom-4 right-6 cursor-pointer'>
      <div
        onClick={() => setShowMenu(!isMenuShow)}
        className={`${
          !isMenuShow ? 'flex' : 'hidden'
        } bg-[#2c3e56fb] w-12 h-12 justify-center items-center rounded-full relative`}
      >
        <div
          className={`absolute -top-20 left-1/2 transform -translate-x-1/2 w-32 h-24 ${
            showHelpText && !isMenuShow ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-1000`}
        >
          <svg viewBox="0 -62 100 100" className="w-full h-full">
            <path
              id="curve"
              fill="transparent"
              d="M 10,50 A 40,40 0 0,1 85,32"
            />
            <text className="text-xs fill-current text-gray-700 font-bold">
              <textPath xlinkHref="#curve" startOffset="25%">
                Need help?
              </textPath>
            </text>
          </svg>
        </div>
        <ChatBubbleIcon />
      </div>

      {isMenuShow && (
        <div ref={menuRef} className="static py-3">
          <div className='mb-4 bottom-12 right-2 bg-white border-t-[1px] px-6 py-4 border-t-gray-300 drop-shadow-lg shadow-lg  w-80 h-72 absolute rounded-3xl'>
            <h2 className='h2 font-bold'>Hey, {companyName || 'there'}! &#128075;</h2>
            <p className='text-sm mt-1'>Need assistance with YAHSHUA HRIS? We're here to help!</p>
            <p className='text-xs text-gray-600 mt-2'>Choose an option below to get support or share your thoughts.</p>
            <div className='w-70 h-[9rem] overflow-hidden hover:overflow-auto hover:pr-0'>
              <div className='mt-3'>
                <button
                  className='my-2 border shadow-sm bg-[#FFC107] font-bold text-sm px-4 py-3 w-full rounded-md hover:bg-[#e0b532]'
                  onClick={() => {
                    window.open(
                      'https://yahshua.notion.site/173c8ec44231803a94e5ec947a3546e2?pvs=105',
                      '_blank'
                    );
                  }}
                >
                  Report a bug
                </button>
                <button
                  className='my-2 border shadow-sm bg-[#FFC107] font-bold text-sm px-4 py-3 w-full rounded-md hover:bg-[#e0b532]'
                  onClick={() => {
                    window.open(
                      'https://docs.google.com/forms/d/e/1FAIpQLSfshLBcafYQvTgAjcmYu_0AyC8IuuoyXrA5LJtME_kD1oDLww/viewform',
                      '_blank'
                    );
                  }}
                >
                  Give us feedback
                </button>
              </div>
            </div>
          </div>
          <div className={`flex bottom-0 right-0 absolute text-white bg-[#2c3e56fb] w-12 h-12 items-center rounded-full`} onClick={() => setShowMenu(false)}>
            <XMarkIcon className='w-[30px] h-[30px] m-auto' />
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingHelpButton;