import { Dispatch, Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import classNames from '@/helpers/classNames'
import { LetterModal } from '@/types/globals'
import { DocumentIcon } from '@heroicons/react/24/outline'

const items = [
    { name: 'Letter of Acceptance', type: 'acceptance' },
    { name: 'Letter of Separation', type: 'separation' },
]

export default function SeparationLetter({ id, isLetterSent, isLetterReceived, letterReceivedDate, setIsLetterModalOpen }: { id: number, isLetterSent: boolean, isLetterReceived: boolean, letterReceivedDate?: string, setIsLetterModalOpen: Dispatch<LetterModal> }) {
    return (
        <>
            <div className="inline-flex rounded-md shadow-sm">
                <Menu as="div" className="relative -ml-px block">
                    <Menu.Button className="relative inline-flex items-center rounded-md bg-green-500 pl-4 pr-3 py-2 text-white hover:bg-green-600 focus:z-10">
                        <span className="sr-only">Open options</span>
                        <div className="flex gap-2"><span>Create</span><ChevronDownIcon className="h-5 w-5" aria-hidden="true" /></div>
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-10 -mr-1 mt-2 w-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                {items.map((item) => (
                                    <Menu.Item key={item.name}>
                                        {({ active }) => (
                                            <span
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm cursor-pointer'
                                                )}
                                                onClick={() => setIsLetterModalOpen({
                                                    type: item.type,
                                                    id
                                                })}
                                            >
                                                {item.name}
                                            </span>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
            <div className="flex gap-2 mt-2">
                <div>
                    <button className={classNames(isLetterSent ? 'bg-red-500 border-[1px] border-red-500 text-white' : 'border-[1px] border-red-500 text-red-500', 'relative inline-flex items-center rounded-md px-2 py-1  focus:z-10 cursor-default')}>Send</button>
                </div>
                <div className="flex flex-col">
                    <div>
                        <button className={classNames(isLetterReceived ? 'bg-green-500 text-white' : 'bg-blue-100 text-gray-400', 'relative inline-flex items-center rounded-md px-2 py-1 focus:z-10 cursor-default')}>Received</button>
                    </div>
                    { isLetterReceived ? (
                        <div className="flex gap-1 items-center mt-2">
                            <DocumentIcon className="text-green-500 w-4 h-4" />
                            <p className="text-xs">{letterReceivedDate}</p>
                        </div>
                    ) : null }
                </div>
            </div>
        </>
    )
}