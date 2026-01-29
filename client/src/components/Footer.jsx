import React from 'react'

const Footer = () => {
  return (
    <div className='py-10 bg-gray-200 text-center'>
      <p className='text-center'>Dharani@<span className='font-semibold'>{new Date().getFullYear()}</span></p>
    </div>
  )
}

export default Footer
