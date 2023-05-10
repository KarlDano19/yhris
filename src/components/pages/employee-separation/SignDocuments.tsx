import classNames from '@/helpers/classNames'
import ClipIcon from '@/svg/ClipIcon'
import { T_DocumentsModal } from '@/types/globals'
import React, { Dispatch } from 'react'

const SignDocuments = ({ id, isDocumentsSent, isDocumentsReceived, documentReceivedDate, setIsDocumentModalOpen }: { id: number, isDocumentsSent: boolean, isDocumentsReceived: boolean, documentReceivedDate?: string, setIsDocumentModalOpen: Dispatch<T_DocumentsModal> }) => {
    return (
        <div className="flex flex-col gap-2">
            <div>
                <button className={classNames(isDocumentsSent ? 'bg-red-500 border-[1px] border-red-500 text-white' : 'border-[1px] border-red-500 text-red-500', 'relative inline-flex items-center rounded-md px-2 py-1 focus:z-10')} onClick={() => setIsDocumentModalOpen({
                    isOpen: true,
                    id
                })}>{isDocumentsSent ? "Sent" : "Send"}</button>
            </div>
            <div>
                <button className={classNames(isDocumentsReceived ? 'bg-savoy-blue text-white' : 'bg-blue-100 text-gray-400', 'relative inline-flex items-center rounded-md px-2 py-1 focus:z-10')}>Received</button>
            </div>
            {isDocumentsReceived ? (
                <div>
                    <div className="flex gap-1 items-center mt-2">
                        <ClipIcon/>
                        <p className="text-xs">{documentReceivedDate}</p>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default SignDocuments