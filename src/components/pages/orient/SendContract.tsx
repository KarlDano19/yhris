import { Dispatch } from 'react'
import classNames from '@/helpers/classNames'
import { DocumentIcon } from '@heroicons/react/24/outline'

export default function SendContract({isContractSent, isContractReceived, contractReceivedDate, setIsSendContractModalOpen }: { isContractSent: boolean, isContractReceived: boolean, contractReceivedDate?: string, setIsSendContractModalOpen: Dispatch<boolean> }) {
    return (
        <>
            <div className="flex gap-2 mt-2">
                <div>
                    <button className={classNames(isContractSent ? 'bg-red-500 border-[1px] border-red-500 text-white' : 'border-[1px] border-red-500 text-red-500', 'relative inline-flex items-center rounded-md px-2 py-1 focus:z-10')} onClick={() => !isContractSent && setIsSendContractModalOpen(true)}>Send</button>
                </div>
                <div className="flex flex-col">
                    <div>
                        <button className={classNames(isContractReceived ? 'bg-green-500 text-white' : 'bg-blue-100 text-gray-400', 'relative inline-flex items-center rounded-md px-2 py-1 focus:z-10 cursor-default')}>Received</button>
                    </div>
                    { isContractReceived ? (
                        <div className="flex gap-1 items-center mt-2">
                            <DocumentIcon className="text-green-500 w-4 h-4" />
                            <p className="text-xs">{contractReceivedDate}</p>
                        </div>
                    ) : null }
                </div>
            </div>
        </>
    )
}