'use client';
import React, { useEffect, useState } from 'react';

// Commented out old chat widget imports
// import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
// import ChatBubbleIcon from '@/svg/ChatBubbleIcon';

const FloatingHelpButton = ({ companyName }: { companyName?: string }) => {
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    // Fetch user session data to get email
    const fetchUserSession = async () => {
      try {
        const response = await fetch('/api/get-session');
        if (response.ok) {
          const sessionData = await response.json();
          setUserEmail(sessionData.email);
        }
      } catch (error) {
        console.error('Failed to fetch session data:', error);
      }
    };

    fetchUserSession();
  }, []);

  useEffect(() => {
    // Tawk.to chat widget script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/68872e04ec9db219126f8445/1j180nhfm';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    // Add the script to the document head
    document.head.appendChild(script);
    
    // Initialize Tawk_API
    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    // Set up callback to capture user attributes when widget is ready
    (window as any).Tawk_API.onLoad = function() {
      // Set user attributes including email and company name
      if (userEmail || companyName) {
        (window as any).Tawk_API.setAttributes({
          'email': userEmail,
          'company': companyName || 'Unknown'
        }, function(error: any) {
          if (error) {
            console.error('Failed to set tawk.to attributes:', error);
          }
        });
      }
    };
    
    // Cleanup function to remove script when component unmounts
    return () => {
      const existingScript = document.querySelector('script[src="https://embed.tawk.to/68872e04ec9db219126f8445/1j180nhfm"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [userEmail, companyName]);

  // Return null since Tawk.to will render its own widget
  return null;

  /* Commented out old chat widget UI
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
    <div className='fixed z-10 md:z-50 bottom-2 md:bottom-4 right-3 md:right-6 cursor-pointer'>
      <div
        className={`${
          !isMenuShow ? 'flex' : 'hidden'
        } bg-[#2c3e56fb] w-9 h-9 md:w-12 md:h-12 justify-center items-center rounded-full relative`}
      >
        <div
          className={`absolute -top-16 md:-top-20 left-1/2 transform -translate-x-1/2 w-24 h-16 md:w-32 md:h-24 ${
            showHelpText && !isMenuShow ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-1000 pointer-events-none`}
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
        <span className="z-10" onClick={() => setShowMenu(!isMenuShow)}>
          <ChatBubbleIcon />
        </span>
      </div>

      {isMenuShow && (
        <div ref={menuRef} className="static py-3">
          <div className='mb-2 md:mb-4 bottom-11 md:bottom-12 right-0 md:right-2 bg-white border-t-[1px] px-3 md:px-6 py-2 md:py-4 border-t-gray-300 drop-shadow-lg shadow-lg w-60 md:w-80 h-64 md:h-72 absolute rounded-2xl md:rounded-3xl'>
            <h2 className='h2 font-bold'>Hey, {companyName || 'there'}! &#128075;</h2>
            <p className='text-sm mt-1'>Need assistance with YAHSHUA HRIS? We&apos;re here to help!</p>
            <p className='text-xs text-gray-600 mt-2'>Choose an option below to get support or share your thoughts.</p>
            <div className='w-full h-[6rem] md:h-[9rem] overflow-hidden hover:pr-0 mt-3'>
              <button
                className='my-2 border shadow-sm bg-[#FFC107] font-bold text-xs md:text-sm px-3 md:px-4 py-2 md:py-3 w-full rounded-md hover:bg-[#e0b532]'
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
                className='my-2 border shadow-sm bg-[#FFC107] font-bold text-xs md:text-sm px-3 md:px-4 py-2 md:py-3 w-full rounded-md hover:bg-[#e0b532]'
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
          <div className={`flex bottom-0 right-0 absolute text-white bg-[#2c3e56fb] w-9 h-9 md:w-12 md:h-12 items-center rounded-full`} onClick={() => setShowMenu(false)}>
            <XMarkIcon className='w-[22px] h-[22px] md:w-[30px] md:h-[30px] m-auto' />
          </div>
        </div>
      )}
    </div>
  );
  */
};

export default FloatingHelpButton;