import classNames from '@/helpers/classNames'
import { DocumentsModal } from '@/types/globals'
import { DocumentIcon } from '@heroicons/react/24/outline'
import React, { Dispatch } from 'react'

const SignDocuments = ({ id, isDocumentsSent, isDocumentsReceived, documentReceivedDate, setIsDocumentModalOpen }: { id: number, isDocumentsSent: boolean, isDocumentsReceived: boolean, documentReceivedDate?: string, setIsDocumentModalOpen: Dispatch<DocumentsModal> }) => {
    return (
        <div className="flex flex-col gap-2">
            <div>
                <button className={classNames(isDocumentsSent ? 'bg-red-500 border-[1px] border-red-500 text-white' : 'border-[1px] border-red-500 text-red-500', 'relative inline-flex items-center rounded-md px-2 py-1 focus:z-10')} onClick={() => setIsDocumentModalOpen({
                    isOpen: true,
                    id
                })}>Send</button>
            </div>
            <div>
                <button className={classNames(isDocumentsReceived ? 'bg-green-500 text-white' : 'bg-blue-100 text-gray-400', 'relative inline-flex items-center rounded-md px-2 py-1 focus:z-10')}>Received</button>
            </div>
            {isDocumentsReceived ? (
                <div>
                    <div className="flex gap-1 items-center mt-2">
                        <DocumentIcon className="text-green-500 w-4 h-4" />
                        <p className="text-xs">{documentReceivedDate}</p>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default SignDocuments