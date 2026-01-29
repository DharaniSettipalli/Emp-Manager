import React from 'react'
import { FaUserFriends } from 'react-icons/fa'
import { useSelector } from 'react-redux';
import { AuthSlicePath } from './../redux/slice/auth.slice';

const DashboardPage = () => {
  const authUser = useSelector(AuthSlicePath)
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 py-10'>
      <div className='w-full border p-3 flex justify-between items-start border-gray-300'>
        <FaUserFriends className='text-5xl'/>
        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold">Total employees</p>
          <p className="text-end ">{authUser && authUser.total_emp}</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
