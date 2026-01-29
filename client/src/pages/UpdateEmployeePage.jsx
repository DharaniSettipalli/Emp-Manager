import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState, useEffect, useRef } from "react";
import { Gender, Active, indianStates } from "../utils/constant";
import * as yup from "yup";
import CustomLoaderButton from "../components/CustomLoaderButton";
import { axiosClient } from "../utils/axiosClient";
import { toast } from "react-toastify";
import { useMainContext } from "../context/mainContext";
import { useNavigate, useParams } from "react-router-dom";

const UpdateEmployeePage = () => {
  const [emp, setEmp] = useState(null);
  const params = useParams();
  const [loader, setLoader] = useState(true);
  const [profileImage, setProfileImage] = useState()
  const navigate = useNavigate()
  //fetching employee details based on id
  const fetchEmp = async () => {
    try {
      const response = await axiosClient.get("/emp/" + params.id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await response.data;
      setEmp(data);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoader(false);
    }
  };

 

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dgpu8pyvs/image/upload";
  //const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState();
  const { fetchUserProfile } = useMainContext();
  const default_image_url =
    "https://res.cloudinary.com/dgpu8pyvs/image/upload/v1768824742/default-avatar_oqxqx6.jpg";

     useEffect(() => {
       if (params.id) {
         fetchEmp();
       }
     }, []);

  const handleFileChange = (e) => {
    console.log("Files: ", e.target.files[0]);
      setProfileImage(e.target.files[0]);
      
      if(profileImage || e.target.files[0]){
        const url = URL.createObjectURL(e.target.files[0]);
        
        setPreview(url);

        return () => URL.revokeObjectURL(objectUrl);
      } 
    }


  const handleUpload = async () => {
    if (!profileImage) return;

    const formData = new FormData();
    formData.append("file", profileImage);
    formData.append("upload_preset", "cloudinary_upload");

    setLoading(true);

    try {
      const response = await axiosClient.post(CLOUDINARY_URL, formData);
      const url = await response.data.secure_url;
      //setImageUrl(url);
      console.log("Uploaded URL:", url);
      return url;
      // Store 'url' in your database here
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    gender: yup.string().required("Gender is required"),
    dob: yup.string().required("Date of birth is required"),
    state: yup.string().required("State is required"),
    activeStatus: yup.string().required("Active status is required"),
  });

  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);
      let url;
      if(initialValues.image !== default_image_url && !profileImage){
        values.image = initialValues.image
      }
      else if(profileImage){
        url = await handleUpload();
        values.image = url
        console.log('profile image:', values.image)
      }else{
        values.image = default_image_url
      }
      //url = await handleUpload();
      //values.image = url ? url : default_image_url;
      console.log("Public image url generated from cloudinary", url);
      console.log("values: ", values);
      const response = await axiosClient.put("/emp/"+ params.id,values, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const {data} = await response.data;
      await fetchUserProfile();
      toast.success("Employee updated successfully");
      navigate('/all-employee')
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };
  if (loader) {
    return <div>Loading...</div>;
  }
  if (!emp) {
    return (
      <h1 className="text-center font-bold text-4xl">Employee Not found</h1>
    );
  }
  const handleDeleteUpload = () => {
    console.log("Inside handle delete upload method")
    setProfileImage(null)
    setPreview(null)
    emp.image=default_image_url
     if (fileInputRef.current) {
       fileInputRef.current.value = null;
     }
  };

  const initialValues = {
    name: emp.name,
    gender: emp.gender,
    dob: emp.dob,
    state: emp.state,
    activeStatus: emp.activeStatus,
    image: emp.image,
  };
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmitHandler}
    >
      <Form className="w-[90%] mx-auto py-10 bg-zinc-100">
        <div className="mb-3 flex flex-col gap-2">
          <label htmlFor="name">
            Employee Name <span className="text-red-500">*</span>
          </label>
          <Field
            type="text"
            name="name"
            id="name"
            className="py-2 border border-gray-300 rounded outline-none px-3 placeholder:text-sm"
            placeholder="Enter employee name"
          />
          <ErrorMessage
            name="name"
            component={"p"}
            className="text-red-500 text-xs"
          />
        </div>
        <div className="mb-3 flex flex-col gap-2">
          <label htmlFor="gender">
            Gender <span className="text-red-500">*</span>
          </label>
          <Field
            as="select"
            name="gender"
            id="gender"
            className="w-full py-2 border border-gray-300 rounded outline-none px-3 placeholder:text-sm"
          >
            <option value="">----Select----</option>
            {Gender.map((cur, i) => {
              return (
                <option value={cur} key={i} className="text-sm">
                  {cur}
                </option>
              );
            })}
          </Field>
          <ErrorMessage
            name="gender"
            component={"p"}
            className="text-red-500 text-xs"
          />
        </div>

        <div className="mb-3 flex flex-col gap-2">
          <label htmlFor="dob">
            Date of birth <span className="text-red-500">*</span>
          </label>
          <Field
            type="date"
            name="dob"
            id="dob"
            className="py-2 border border-gray-300 rounded outline-none px-3 placeholder:text-sm"
            placeholder="Enter Date of birth"
          />
          <ErrorMessage
            name="dob"
            component={"p"}
            className="text-red-500 text-xs"
          />
        </div>

        <div className="mb-3 flex flex-col gap-2">
          <label htmlFor="state">
            Employee's State <span className="text-red-500">*</span>
          </label>
          <Field
            as="select"
            name="state"
            id="state"
            className="py-2 border border-gray-300 rounded outline-none px-3 placeholder:text-sm"
            placeholder="Enter employee state"
          >
            <option value="">----Select----</option>
            {indianStates.map((cur, i) => {
              return (
                <option value={cur} key={i} className="text-sm">
                  {cur}
                </option>
              );
            })}
          </Field>
          <ErrorMessage
            name="state"
            component={"p"}
            className="text-red-500 text-xs"
          />
        </div>

        <div className="mb-3 flex flex-col gap-2">
          <label htmlFor="activeStatus">
            Employee Active/In active status{" "}
            <span className="text-red-500">*</span>
          </label>
          <Field
            as="select"
            name="activeStatus"
            id="activeStatus"
            className="w-full py-2 border border-gray-300 rounded outline-none px-3 placeholder:text-sm"
          >
            <option value="">----Select----</option>
            {Active.map((cur, i) => {
              return (
                <option value={cur} key={i} className="text-sm">
                  {cur}
                </option>
              );
            })}
          </Field>
          <ErrorMessage
            name="activeStatus"
            component={"p"}
            className="text-red-500 text-xs"
          />
        </div>

        <div className="mb-3 flex flex-col gap-2">
          <label htmlFor="image">Upload Profile Image</label>
          <input
            type="file"
            name="image"
            id="image"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e)}
            className="w-full py-2 border border-gray-300 rounded outline-none px-3 placeholder:text-sm"
          />
          {(
            <div>
              <span>Uploaded image: </span>
              <span>
                <button
                  type="button"
                  onClick={() => handleDeleteUpload()}
                  className="p-2 mx-1 sm:p-1 bg-indigo-500 text-white rounded hover:cursor-pointer"
                >
                  Delete uploaded image
                </button>
              </span>
              {<img
                src={preview ? preview : (emp.image !== default_image_url ? emp.image: null) }
                className="mt-4"
              />}
            </div>
          )}
        </div>

        <div className="mb-3">
          <CustomLoaderButton isLoading={loading} text="Update Employee" nav />
        </div>
      </Form>
    </Formik>
  );
};;

export default UpdateEmployeePage;
