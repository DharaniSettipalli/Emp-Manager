import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import {CgSpinner} from 'react-icons/cg'
import {clsx} from 'clsx'

const CustomLoaderButton = ({
    type='submit',
    isLoading=false,
    text='',
    className=''
    }) => {
  return (
    <button type='submit' className={clsx(className, 'w-full mt-3 bg-indigo-600 disabled:bg-indigo-800 hover:bg-indigo-700 flex items-center justify-center gap-x-1 py-2 rounded text-white')}>
      <span>{text}</span>
      {isLoading ? <CgSpinner className='text-xl animate-spin'/> : <FaArrowRight/>}
    </button>
  )
}

export default CustomLoaderButton
