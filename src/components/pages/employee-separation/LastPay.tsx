import classNames from '@/helpers/classNames'
import { T_LastPayModal } from '@/types/globals'
import React, { Dispatch } from 'react'

const LastPay = ({ id, isLastPayReleased, setIsLastPayModalOpen }: { id: number, isLastPayReleased: boolean, setIsLastPayModalOpen: Dispatch<T_LastPayModal> }) => {
  return (
    <button className={classNames(isLastPayReleased ? 'bg-red-500 border-[1px] border-red-500 text-white' : 'border-[1px] border-red-500 text-red-500', 'relative inline-flex items-center rounded-md px-2 py-1 focus:z-10')} onClick={() => setIsLastPayModalOpen({
        isOpen: true,
        id
    })}>{isLastPayReleased ? 'Released' : 'Release' } </button>
  )
}

export default LastPay