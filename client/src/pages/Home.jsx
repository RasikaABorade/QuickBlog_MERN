import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import BlogList from "../components/BlogList";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const adminToken = localStorage.getItem("token");
    
    
    setIsLoggedIn(!!userToken || !!adminToken);
  }, [navigate]);


  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to QuickBlog</h1>
          <p className="text-gray-600 mb-8">Please login or sign up to access your personal blogging space.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/user-login")}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              User Login / Sign Up
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-black transition-colors"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Header />
      <BlogList />
      <NewsLetter />
      <Footer />
    </>
  );
};

export default Home;
