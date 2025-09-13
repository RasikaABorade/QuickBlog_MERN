import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const adminToken = localStorage.getItem("token");
    
    if (userData) {
      setUser(JSON.parse(userData));
    } else if (adminToken) {
      // Set admin user info for navbar display
      setUser({ name: "Admin", email: "admin", role: "admin" });
    }
  }, []);

  const handleLogout = () => {
    const adminToken = localStorage.getItem("token");
    
    if (adminToken) {
      // Admin logout
      localStorage.removeItem("token");
      navigate("/admin");
    } else {
      // User logout
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      navigate("/user-login");
    }
    setUser(null);
  };

  return (
    <div className="py-5 px-5 md:px-12 lg:px-28">
      <div className="flex justify-between items-center">
        <img 
          src={assets.logo} 
          alt="" 
          className="w-[130px] sm:w-auto cursor-pointer" 
          onClick={() => {
            const adminToken = localStorage.getItem("token");
            if (adminToken) {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }}
        />
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}!</span>
            <button 
              onClick={() => navigate("/user-dashboard")}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Dashboard
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate("/user-login")}
            className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000]"
          >
            Get started <img src={assets.arrow} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
