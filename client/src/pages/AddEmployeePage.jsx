import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState, useEffect, useRef } from "react";
import { Gender, Active, indianStates } from "../utils/constant";
import * as yup from "yup";
import CustomLoaderButton from "../components/CustomLoaderButton";
import { axiosClient } from "../utils/axiosClient";
import { toast } from "react-toastify";
import { useMainContext } from "../context/mainContext";
import { useNavigate } from "react-router-dom";

const AddEmployeePage = () => {
  const initialValues = {
    name: "",
    gender: "",
    dob: "",
    state: "",
    activeStatus: "",
  };
  //   const formik = useFormik(initialValues);
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);
  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dgpu8pyvs/image/upload";
  //const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState();
  const { fetchUserProfile } = useMainContext();
  const navigate = useNavigate()
  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!profileImage) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(profileImage);
    console.log("Add url::", objectUrl)
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [profileImage]);

  const handleFileChange = (e) => {
    console.log("Files: ", e.target.files[0]);
    setProfileImage(e.target.files[0]);

    //initialValues.image = e.target.files[0]
    //console.log(initialValues)
  };

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

  const handleDeleteUpload = () => {
    console.log("Inside handle delete upload method");
    setProfileImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);
      const url = await handleUpload();
      const default_image_url =
        "https://res.cloudinary.com/dgpu8pyvs/image/upload/v1768824742/default-avatar_oqxqx6.jpg";
      values.image = url ? url : default_image_url;
      console.log("Public image url generated from cloudinary", url);
      console.log("values: ", values);
      const response = await axiosClient.post("/add-employee", values, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await response.data;
      helpers.resetForm();
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
        setPreview(null);
      }
      await fetchUserProfile();
      toast.success("Employee added successfully");
      navigate('/all-employee')
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
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
          {profileImage && (
            <div>
              <div>
                Uploaded image
                <button 
                className="p-2 mx-1 sm:p-1 bg-indigo-500 text-white rounded hover:cursor-pointer"
                onClick={() => handleDeleteUpload()}
                >
                  Delete uploaded image
                </button>
              </div>
              <img src={preview} className="mt-4" />
            </div>
          )}
        </div>

        <div className="mb-3">
          <CustomLoaderButton isLoading={loading} text="Add Employee" />
        </div>
      </Form>
    </Formik>
  );
};

export default AddEmployeePage;
