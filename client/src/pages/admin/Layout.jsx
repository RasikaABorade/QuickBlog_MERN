import React from "react";
import { assets } from "../../assets/assets";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

const Layout = () => {
  return (
    <div>
      <AdminNavbar />
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-black">
            <h3 className="font-medium">Admin Panel</h3>
            <img src={assets.profile_icon} alt="" className="w-8" />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
