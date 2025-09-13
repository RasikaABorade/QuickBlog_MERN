import React, { useState, useEffect } from "react";
import { blog_data, blogCategories } from "../assets/assets";
import { motion } from "motion/react";
import BlogCard from "./BlogCard";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const { blogs, setBlogs, input, axios } = useAppContext();
  console.log("blogs from context:", blogs);
  // const { blogs: contextBlogs, input } = useAppContext();
  // const blogs = contextBlogs.length === 0 ? blog_data : contextBlogs; // ✅ FIXED HERE

  const fetchBlogs = async () => {
    try {
      // Support both user and admin tokens
      const token = localStorage.getItem("userToken") || localStorage.getItem("token");
      if (!token) {
        setBlogs([]);
        return;
      }
      
      const { data } = await axios.get("/api/blog/all", {
        headers: { Authorization: token }
      });
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Refresh blogs when user logs in or page loads
  useEffect(() => {
    const userToken = localStorage.getItem("userToken") || localStorage.getItem("token");
    if (userToken) {
      fetchBlogs();
    }
  }, [window.location.pathname]);

  //filter bcoz when we will search andything it will filter
  const filteredBlogs = () => {
    //' '  measn we have not added any input field
    if (input === "") {
      return blogs;
    }
    //if we have anything in input we will filter the blog
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
    ); //cheking blog category and also title
  };
  console.log("Filtered Blogs:", filteredBlogs());

  return (
    <div>
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {blogCategories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => setMenu(item)}
              className={`cursor-pointer text-gray-500 ${
                menu === item && "text-white px-4 pt-0.5"
              }`}
              //it will set on category
              //and also update category
            >
              {item}
              {/* //below div is adding color to menu */}
              {menu === item && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute left-0 right-0 top-0 h-7 -z-1 bg-indigo-600 rounded-full  "
                ></motion.div>
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
        {filteredBlogs()
          .filter((blog) => menu === "All" || blog.category === menu)
          .map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
      </div>
    </div>
  );
};

export default BlogList;
