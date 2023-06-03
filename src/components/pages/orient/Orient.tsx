import { Dispatch } from 'react'
import classNames from '@/helpers/classNames'

export default function Orient({ isOrientSent, isOriented, setIsOrientFirstModalOpen, setIsNewHireOrientedOpen }: { isOrientSent: boolean, isOriented: boolean, setIsOrientFirstModalOpen: Dispatch<boolean>, setIsNewHireOrientedOpen: Dispatch<boolean> }) {
    return (
        <>
            <div className="flex gap-2 mt-2">
                <div>
                    <button className={classNames(isOrientSent && !isOriented ? 'bg-red-200 border-[1px] border-red-500 text-red-500' : isOrientSent && isOriented ? 'bg-red-500 border-[1px] border-red-500 text-white' : 'border-[1px] border-red-500 text-red-500', 'relative inline-flex items-center rounded-md px-2 py-1 focus:z-10')} onClick={() => !isOrientSent && !isOriented ? setIsOrientFirstModalOpen(true) : isOrientSent && !isOriented ? setIsNewHireOrientedOpen(true) : null}>{isOriented ? "Oriented" : "Orient"}</button>
                </div>
            </div>
        </>
    )
}