import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import React from 'react'

const Content = () => {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex p-4">
                <Link href="/" className="flex-none flex gap-3 items-center hover:bg-gray-200">
                    <ArrowLeftIcon className="h-5 w-5" />
                    <h4>Home</h4>
                </Link>
            </div>
            <div className="px-2 md:px-8 lg:px-4">
                <h2 className="text-xl font-bold text-indigo-dye">Hired Applicants</h2>
                <div className="mt-6 grid grid-cols-3 items-center gap-6">
                    <div className="p-4 h-44 rounded-lg shadow-sm bg-white flex flex-col gap-2 items-center justify-center">
                        <h3 className="text-lg">Accounting Officer</h3>
                        <button type="button" className="bg-[#EAC645] text-[#2C3F58] font-semibold px-8 py-2 rounded-md hover:bg-opacity-90">2 Hired Applicant/s</button>
                    </div>
                    <div className="p-4 h-44 rounded-lg bg-[#EBF3FF] shadow-sm">
                        
                    </div>
                    <div className="p-4 h-44 rounded-lg bg-[#EBF3FF] shadow-sm">
                        
                    </div>
                    <div className="p-4 h-44 rounded-lg bg-[#EBF3FF] shadow-sm">
                        
                    </div>
                    <div className="p-4 h-44 rounded-lg bg-[#EBF3FF] shadow-sm">
                        
                    </div>
                    <div className="p-4 h-44 rounded-lg bg-[#EBF3FF] shadow-sm">
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Content