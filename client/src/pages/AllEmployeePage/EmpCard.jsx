import React from "react";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { Link } from 'react-router-dom';

const EmpCard = ({ data, onDelete }) => {
    const handleDelete = (id)=>{
        const isConfirmed = window.confirm(
          "Are you sure you want to delete this employee? click ok to delete",
        );
        if(isConfirmed){
            onDelete(id);
        }
    }
    
  return (
    <tr>
      <td className="py-3 px-2 border-b border-r">{data.empId}</td>
      <td className="py-3 px-2 border-b border-r">{data.name}</td>
      <td className="py-3 px-2 border-b border-r">{data.gender}</td>
      <td className="py-3 px-2 border-b border-r">{data.dob}</td>
      <td className="py-3 px-2 border-b border-r">{data.state}</td>
      <td className="py-3 px-2 border-b border-r">{data.activeStatus}</td>
      <td className="py-3 px-2 border-b border-r">
       <Link to={data.image}><img src={data.image} className="w-15 h-15 mx-2 rounded-full" /></Link> 
      </td>
      <td className="text-center border-b">
        <button
          className="p-2 mx-1 sm:p-1 bg-indigo-500 text-white mb-2 rounded hover:cursor-pointer"
          onClick={() => handleDelete(data._id)}
        >
          <MdDelete />
        </button>
        <button className="p-2 mx-1 sm:p-1 bg-indigo-500 text-white rounded hover:cursor-pointer">
          <Link to={'/update-employee/'+data._id}>
            <MdEdit />
          </Link>
        </button>
        
      </td>
    </tr>
  );
};

export default EmpCard;
