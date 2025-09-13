import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const { axios } = useAppContext();

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Clear any stale auth header for admin session
    if (axios?.defaults?.headers?.common?.Authorization) {
      delete axios.defaults.headers.common["Authorization"];
    }
    // Send to home so both login options are visible
    navigate("/");
  };

  return (
    <div className="py-5 px-5 md:px-12 lg:px-28 bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <img 
          src={assets.logo} 
          alt="" 
          className="w-[130px] sm:w-auto cursor-pointer" 
          onClick={() => navigate("/" )}
        />
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Welcome, Admin!</span>
          <button 
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
