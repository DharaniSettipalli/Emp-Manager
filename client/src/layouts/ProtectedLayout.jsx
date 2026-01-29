import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AuthSlicePath } from "../redux/slice/auth.slice";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserFriends } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useLocation, Link } from "react-router-dom";
import {clsx} from 'clsx' 

const SidebarItemList = [
  {
    name: "Dashboard",
    link: "/",
    Icon: MdDashboard,
  },
  {
    name: "Add employee",
    link: "/add-employee",
    Icon: FaUser,
  },
  {
    name: "All employees",
    link: "/all-employee",
    Icon: FaUserFriends,
  },
];

const ProtectedLayout = () => {
  const user = useSelector(AuthSlicePath);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {pathname} = useLocation();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [user]);
  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex w-[90%] mx-auto items- flex-col lg:flex-row py-10 gap-x-1 gap-y-6">
      <div className="w-1/3 min-h-[70vh] hidden lg:flex flex-col bg-gray-200 py-4">
        {SidebarItemList.map((cur, i) => {
          return <SidebarMenuItem key={i} item={cur} />;
        })}
      </div>

      <ul className="flex list-none lg:hidden items-center">
        {
          SidebarItemList.map((cur,i)=>{
            return (
              <li
              key={i}
                className={clsx(
                  "bg-gray-200 px-5 py-1 list",
                  "hover:bg-gray-300",
                  cur.link === pathname && "bg-gray-300",
                )}
              >
                <Link to={cur.link} className="flex items-center gap-x-1">
                <cur.Icon/>
                <span>{cur.name}</span>
                </Link>
              </li>
            );
          })
        }
      </ul>

      <section className="w-full">
        <Outlet />
      </section>
    </div>
  );
};

const SidebarMenuItem = ({ item }) => {
  const { pathname } = useLocation();
  console.log(item)
  return (
    <Link to={item.link} className={clsx("w-full p-3 flex justify-start gap-x-2 items-center", "hover:bg-gray-300 rounded", item.link===pathname && "bg-gray-300")}>
      <item.Icon className='text-2xl' />{item.name}
    </Link>
  );
};

export default ProtectedLayout;
