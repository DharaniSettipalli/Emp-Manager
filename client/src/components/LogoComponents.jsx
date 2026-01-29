import React from 'react'
import { Link } from 'react-router-dom'

const LogoComponents = () => {
  return (
    <div>
      <Link to={'/'} className='flex items-center gap-x-1 text-2xl font-bold'><span>Emp</span> <span className='w-5 h-5 animate-bounce bg-indigo-500 rounded-full'></span></Link>
    </div>
  )
}

export default LogoComponents
