import Link from "next/link"
import { WrapperPropTypes as PropTypes } from "./types"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"

export default function Wrapper({ children, maxWidth = "max-w-7xl", title, backText, backLink }: PropTypes) {
  return (
    <div className="min-h-screen">
      <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 scroll-smooth`}>
        {backLink && backText ? (
          <div className="flex px-4 pt-4 pb-2">
            <Link
              href={backLink as string}
              className='flex-none flex gap-3 items-center hover:bg-gray-200'
            >
              <ArrowLeftIcon className='h-5 w-5' />
              <h4>{backText}</h4>
            </Link>
          </div>
        ) : null}    
        <div className="p-2 md:px-8 lg:px-4">
          <h2 className="text-xl font-bold text-indigo-dye">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  )
}
