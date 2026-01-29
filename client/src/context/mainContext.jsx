import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { axiosClient } from '../utils/axiosClient'
import { removeUser, setUser } from '../redux/slice/auth.slice'
import ScreenLoaderComponent from '../components/ScreenLoaderComponent'
import { useNavigate } from 'react-router-dom'
import { removeListener } from '@reduxjs/toolkit'

const mainContext = createContext()

export const useMainContext = ()=> useContext(mainContext)

export const MainContextProvider = ({children})=>{
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutHandler = ()=>{
      localStorage.removeItem('token')
      navigate('/login')
      dispatch(removeUser({}))
      toast.success('Logout Success')
    }

    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        if (!token) return;
        const response = await axiosClient.get("/profile", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        const data = await response.data; //user
        dispatch(setUser(data));
        console.log(data)
      } catch (error) {
        toast.error(error.message)
      }finally{
        setLoading(false)
      }
    }
    useEffect(()=>{
        fetchUserProfile()
    },[])
    if(loading){
        return <ScreenLoaderComponent/>
    }
    
    return (
      <mainContext.Provider value={{ fetchUserProfile, logoutHandler }}>
        {children}
      </mainContext.Provider>
    );
}

