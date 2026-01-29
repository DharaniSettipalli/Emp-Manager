import React, { useState, useEffect } from "react";
import { axiosClient } from "../../utils/axiosClient";
import EmpCard from "./EmpCard";
import { toast } from "react-toastify";
import { MdPrint } from "react-icons/md";
import { FaFilter } from "react-icons/fa";



const AllEmployeePage = () => {

        const [emps,setEmps] = useState([])
        const [search,setSearch] = useState('')
        const [gender,setGender] = useState('')
        const [active,setActive] = useState('')
        const [selectedOption,setSelectedOption] = useState('')
        const [selectedActiveOption, setSelectedActiveOption] = useState('')

        const [showgenderInput, setShowGenderInput] = useState(false)
        const [showActiveInput, setShowActiveInput] = useState(false)

    const fetchAllEmployees = async (search='', gender='', active='')=>{

        try{
            const endpoint = `/all-employee?search=${search}&gender=${gender}&active=${active}`
            const response = await axiosClient.get(endpoint , {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            });
            const {data} = await response.data
            console.log('fetch all emp data::', data)
            setEmps(data)

        }catch(error){
            toast.error("Error fetching employee data")
        }
    }
    useEffect(()=>{
        fetchAllEmployees(search,gender,active)
    },[search,gender,active])

    const deleteEmp = async (id)=>{
        try{
          const response = await axiosClient.delete('/emp/'+id, {
            headers:{
              'Authorization': "Bearer "+ localStorage.getItem('token')
            }
          })
          const {data,message} = await response.data
          await fetchAllEmployees(search,gender,active)
          // toast.dismiss()
          toast.success(message)
        }catch(error){
          toast.error("Error deleting employee data: ", error);
        }
    }

    const handlePrint = ()=>{
      window.print();
    }

    const handleSearch = (e) => {
      setSearch(e.target.value)
    };
    const handleGenderFilter = ()=>{
      // alert('filter is clicked')
      setShowGenderInput(!showgenderInput)
    }
    const handleChange = (e, inputField)=>{
      
      if(inputField==='gender'){
        setSelectedOption(e.target.value);
        setGender(e.target.value)
      }
      if(inputField==='active'){
        setSelectedActiveOption(e.target.value)
        setActive(e.target.value)
      }  
    }


  return (
    <>
      <div className="flex justify-end align-center">
        <button
          className="p-1 w-1/2 flex justify-center items-center gap-x-3 my-3 mx-3 bg-indigo-500 text-white rounded hover:cursor-pointer"
          onClick={() => handlePrint()}
        >
          Print employee list
          <MdPrint />
        </button>
        <div className="w-full mt-2  p-1">
          <input
            type="text"
            onChange={(e) => handleSearch(e)}
            className="p-1 w-3/4 border rounded"
            placeholder="Enter employee name to search"
          />
        </div>
      </div>
      <table className="border w-full table-auto bg-zinc-100 py-10 ml-3">
        <thead>
          <tr>
            <th className="py-5 border-b border-r">ID</th>
            <th className="py-5 border-b border-r">Name</th>
            <th className="py-5 border-b border-r">
              <div className="flex flex-col">
                <div className="flex justify-center gap-x-1 align-center">
                  Gender
                  <FaFilter onClick={(e) => handleGenderFilter()} />
                </div>

                {showgenderInput && (
                  <select
                    value={selectedOption}
                    className="border border-1"
                    onChange={e=>handleChange(e,'gender')}
                  >
                    <option value=""></option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                )}
              </div>
            </th>
            <th className="py-5 border-b border-r">Date of birth</th>
            <th className="py-5 border-b border-r">State</th>
            <th className="py-5 border-b border-r">
              <div className="flex flex-col">
                <div className="flex justify-center gap-x-1 align-center">
                  Active status
                  <FaFilter onClick={() => setShowActiveInput(!showActiveInput)} />
                </div>
                {showActiveInput && (
                  <select
                    value={selectedActiveOption}
                    className="border border-1"
                    onChange={(e)=>handleChange(e,'active')}
                  >
                    <option value=""></option>
                    <option value="Active">Active</option>
                    <option value="In active ">In active</option>
                  </select>
                )}
              </div>
            </th>
            <th className="py-5 border-b border-r">Profile image</th>
            <th className="py-5 border-b border-r">Actions</th>
          </tr>
        </thead>
        <tbody>
          {emps && emps.length > 0 ? (
            emps.map((cur, i) => {
              return <EmpCard key={i} data={cur} onDelete={deleteEmp} />;
            })
          ) : (
            <tr>
              <td>No records to show</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default AllEmployeePage;
