import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage,  } from "formik";
import {FaEyeSlash,FaEye} from 'react-icons/fa'
import * as yup from "yup";
import {HiRefresh} from 'react-icons/hi'
import CustomLoaderButton from "../components/CustomLoaderButton";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../utils/axiosClient";
import { useMainContext } from "../context/mainContext";

const RegisterPage = () => {
  const initialValues = {
    name: "",
    email: "",
    password: "",
    captcha: "",
  };
  const navigate = useNavigate()
  let [isShow, setIsShow] = useState(false);
  let [captcha, setCaptcha] = useState('')
  const [loading, setLoading] = useState(false)
  const { fetchUserProfile } = useMainContext();

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Email must be valid")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
    captcha: yup.string().required("Captcha is required"),
  });

  const onSubmitHandler = async (values, helpers) => {
    try {
        setLoading(true)
        //validate captcha

        if(values.captcha != eval(captcha)){
            toast.error("Enter valid captcha")
            generateCaptcha();
            return
        }
        else{
            delete values.captcha
            const response = await axiosClient.post('/register', values)
            const data = await response.data

            localStorage.setItem('token', data.token)

            console.log(data)
            
            await fetchUserProfile();
            helpers.resetForm();
            setTimeout(()=>{
              toast.success("User Registered successfully");
              navigate("/");
            },200)
            
            //redirecting user to home/dashboard page
        }
      
    } catch (error) {
        console.log(error?.response?.data?.message);
        console.log(error)
      toast.error(error?.response?.data?.error || error.message);
    }finally{
        setLoading(false)
    }
  };


  const generateCaptcha = () => {
    let operators = ["+", "-", "*"];
    let firstvalue = Math.ceil(Math.random() * 10);
    let secondvalue = Math.ceil(Math.random() * 10);
    let operator = operators[Math.floor(Math.random() * 3)];

    let str =`${firstvalue}${operator}${secondvalue}`
    setCaptcha(str)
  };

  useEffect(()=>{
    generateCaptcha();
  },[])
  return (
    <div className="min-h-[70vh] flex items-center justify-center flex-col py-10">
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={onSubmitHandler}
      >
        <Form className="w-[98%] md:w-1/2 lg:1/3 border-3 py-10 px-4 rounded border-gray-400">
          <div className="mb-3">
            <label htmlFor="name">Name</label>
            <Field
              name="name"
              type="text"
              className="w-full py-2 border placeholder:font-md border-gray-500 rounded px-3 outline-none"
              placeholder="Enter your name"
            />
            <ErrorMessage
              name="name"
              className="text-red-500 text-xs"
              component={"p"}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <Field
              name="email"
              type="email"
              className="w-full py-2  placeholder:font-md border border-gray-500 rounded px-3 outline-none"
              placeholder="Enter your email"
            />
            <ErrorMessage
              name="email"
              className="text-red-500 text-xs"
              component={"p"}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <div className="flex w-full border rounded border-gray-500 items-center justify-between px-4 py-3">
              <Field
                name="password"
                type={isShow ? "text" : "password"}
                className="py-2 placeholder:font-md  w-full outline-none"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => {
                  setIsShow(!isShow);
                }}
              >
                {isShow ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <ErrorMessage
              name="password"
              className="text-red-500 text-xs"
              component={"p"}
            />
          </div>

          <div className="w-full flex items-center justify-between">
            <p>{captcha}</p>
            <button type="button" onClick={() => generateCaptcha()}>
              <HiRefresh />
            </button>
            <div className="flex flex-col">
              <Field
                name="captcha"
                className="w-full py-2  placeholder:font-md border border-gray-500 rounded px-3 outline-none"
                placeholder="Enter captcha"
              />
              <ErrorMessage
                name="captcha"
                className="text-red-500 text-xs"
                component={"p"}
              />
            </div>
          </div>
          <div className="mb-3">
            <CustomLoaderButton isLoading={loading} text="Register" />
          </div>
          <div className="mb-3">
            <p className="text-end">
                Already have an account ?  
                <Link to={'/login'} className='font-sm font-semibold text-indigo-500'>Login</Link>
            </p>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default RegisterPage;
