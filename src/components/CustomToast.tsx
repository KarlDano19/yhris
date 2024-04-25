import React from 'react';
import toast from 'react-hot-toast';
import { XMarkIcon, CheckCircleIcon, InformationCircleIcon, HandRaisedIcon } from '@heroicons/react/20/solid';
import classNames from '@/helpers/classNames';
import CircleXmarkIcon from '@/svg/CircleXmarkIcon';

const CustomToast = ({ message, type }: { message: string, type: 'success' | 'error' | 'info' | 'warning' }) => {

    const renderIcon = () => {
        const className = "h-9 w-9 text-white";
        if(type === "success") {
            return <CheckCircleIcon className={className} aria-hidden="true" />
        } else if(type === "error") {
            return <CircleXmarkIcon aria-hidden="true" />
        } else if(type === "info") {
            return <InformationCircleIcon className={className} aria-hidden="true" />
        } else if(type === "warning") {
            return <HandRaisedIcon className={className} aria-hidden="true" />
        }
    }

    return (
        <div 
            className={classNames(
                'pointer-events-auto w-full max-w-sm overflow-hidden rounded-sm bg-green-500 shadow-lg ring-1 ring-black ring-opacity-5',
                type === "success" ? 'bg-green-500' : '',
                type === "error" ? 'bg-red-500' : '',
                type === "info" ? 'bg-blue-500' : '',
                type === "warning" ? 'bg-orange-500' : '',
            )}
        >
            <div className="px-4 py-3">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        {renderIcon()}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className="mt-1 text-sm text-white">{message}</p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                        <button
                            type="button"
                            className="inline-flex rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => toast.remove()}
                        >
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-7 w-7 text-white" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomToast