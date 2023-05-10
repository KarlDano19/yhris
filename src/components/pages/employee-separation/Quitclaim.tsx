import classNames from '@/helpers/classNames'
import ClipIcon from '@/svg/ClipIcon'
import { T_QuitclaimModal } from '@/types/globals'
import React, { Dispatch } from 'react'

const Quitclaim = ({ id, isQuitclaimSigned, isQuitclaimReceived, quitclaimReceivedDate, setIsQuitclaimModalOpen }: { id: number, isQuitclaimSigned: boolean, isQuitclaimReceived: boolean, quitclaimReceivedDate?: string, setIsQuitclaimModalOpen: Dispatch<T_QuitclaimModal> }) => {
    return (
        <div className="flex flex-col gap-2">
            <div>
                <button className={classNames(isQuitclaimSigned ? 'bg-red-500 border-[1px] border-red-500 text-white' : 'border-[1px] border-red-500 text-red-500', 'relative inline-flex items-center rounded-md px-2 py-1 focus:z-10')} onClick={() => setIsQuitclaimModalOpen({
                    isOpen: true,
                    id
                })}>{isQuitclaimSigned ? "Signed" : "Sign"}</button>
            </div>
            <div>
                <button className={classNames(isQuitclaimReceived ? 'bg-savoy-blue text-white' : 'bg-blue-100 text-gray-400', 'relative inline-flex items-center rounded-md px-2 py-1 focus:z-10')}>Received</button>
            </div>
            {isQuitclaimReceived ? (
                <div>
                    <div className="flex gap-1 items-center mt-2">
                        <ClipIcon/>
                        <p className="text-xs">{quitclaimReceivedDate}</p>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default Quitclaim