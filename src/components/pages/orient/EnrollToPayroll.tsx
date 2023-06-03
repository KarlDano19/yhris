import { Dispatch } from 'react'
import classNames from '@/helpers/classNames'

export default function EnrollToPayroll({ isEnrolled, setIsEnrollModalOpen }: { isEnrolled: boolean, setIsEnrollModalOpen: Dispatch<boolean> }) {
    return (
        <>
            <div className="flex gap-2 mt-2">
                <div>
                    <button className={classNames(isEnrolled ? 'bg-red-500 border-[1px] border-red-500 text-white' : 'border-[1px] border-red-500 text-red-500', 'relative inline-flex items-center rounded-md px-2 py-1 focus:z-10')} onClick={() => !isEnrolled && setIsEnrollModalOpen(true)}>{ !isEnrolled ? "Enroll" : "Enrolled" }</button>
                </div>
            </div>
        </>
    )
}