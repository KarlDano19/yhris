import React, { useEffect, useRef, Fragment } from 'react';
import { Transition } from '@headlessui/react';

const RightClickMenu = ({
  options,
  position,
  onClose,
  isOpen,
  setShowContextMenu,
  selectedJobId,
}: {
  options: any;
  position: any;
  onClose: any;
  isOpen: any;
  setShowContextMenu: any;
  selectedJobId: any;
}) => {
  const contextMenuRef = useRef(null);
  const handleClickOutsideContextMenu = (event: any) => {
    if (contextMenuRef.current && !(contextMenuRef.current as any).contains(event.target)) {
      setShowContextMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideContextMenu);
    return () => {
      document.removeEventListener('click', handleClickOutsideContextMenu);
    };
  }, []);

  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter='transition ease-out duration-100'
      enterFrom='transform opacity-0 scale-95'
      enterTo='transform opacity-100 scale-100'
      leave='transition ease-in duration-75'
      leaveFrom='transform opacity-100 scale-100'
      leaveTo='transform opacity-0 scale-95'
    >
      <div
        ref={contextMenuRef}
        className='border-[1px] border-stone-400 rounded-md bg-white hover:bg-gray-300 w-[150px] text-center'
        style={{ position: 'absolute', top: position.y, left: position.x }}
      >
        <ul>
          {options.map((option: any, index: any) => (
            <li
              key={index}
              className='cursor-pointer block px-8 py-2 text-sm text-gray-800 hover:bg-green-500 hover:text-white'
              onClick={() => {
                option.action(selectedJobId);
                onClose();
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </Transition>
  );
};

export default RightClickMenu;
