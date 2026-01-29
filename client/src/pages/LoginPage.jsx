import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import * as yup from "yup";
import { HiRefresh } from "react-icons/hi";
import CustomLoaderButton from "../components/CustomLoaderButton";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useMainContext } from "../context/mainContext";
import { axiosClient } from "../utils/axiosClient";

const LoginPage = () => {
  const initialValues = {
    email: "",
    password: "",
    captcha: "",
  };
  const navigate = useNavigate();

  let [isShow, setIsShow] = useState(false);
  let [captcha, setCaptcha] = useState("");
  const [loading, setLoading] = useState(false);
  const { fetchUserProfile } = useMainContext();

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Email must be valid")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
    captcha: yup.string().required("Captcha is required"),
  });

  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);
      //validate captcha

      if (values.captcha != eval(captcha)) {
        toast.error("Enter valid captcha");
        generateCaptcha();
      } else {
        delete values.captcha;
        const response = await axiosClient.post("/login", values);
        const data = await response.data;

        localStorage.setItem("token", data.token);

        console.log(data);

        await fetchUserProfile();

        setTimeout(() => {
          toast.success("User logged in successfully");
          navigate("/"); //redirecting/navigating user to home/dashboard page
        }, 200);
        helpers.resetForm();
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCaptcha = () => {
    let operators = ["+", "-", "*"];
    let firstvalue = Math.ceil(Math.random() * 10);
    let secondvalue = Math.ceil(Math.random() * 10);
    let operator = operators[Math.floor(Math.random() * 3)];

    let str = `${firstvalue}${operator}${secondvalue}`;
    setCaptcha(str);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);
  return (
    <div className="min-h-[70vh] flex items-center justify-center flex-col py-10">
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={onSubmitHandler}
      >
        <Form className="w-[98%] md:w-1/2 lg:1/3 border-3 py-10 px-4 rounded border-gray-400">
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
            <CustomLoaderButton isLoading={loading} text="Login" />
          </div>
          <div className="mb-3">
            <p className="text-end">
              Don't have an account ?
              <Link
                to={"/register"}
                className="font-sm font-semibold text-indigo-500"
              >
                Register
              </Link>
            </p>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginPage;
