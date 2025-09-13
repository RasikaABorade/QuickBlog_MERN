import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets, blogCategories } from "../assets/assets";
import Quill from "quill";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { parse } from "marked";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserAddBlog = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isPublished, setIsPublished] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/user-login");
      return;
    }
  }, [navigate]);

  // Generate content with AI
  const generateContent = async () => {
    if (!title) return toast.error("Please Enter a Title");

    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      const { data } = await axios.post("/api/blog/generate", {
        prompt: title,
      }, {
        headers: { Authorization: token }
      });
      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true);

      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("Please login to create a blog");
        navigate("/user-login");
        return;
      }

      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished,
      };

      const formData = new FormData();
      formData.append("blog", JSON.stringify(blog));
      formData.append("image", image);

      const { data } = await axios.post("/api/blog/add", formData, {
        headers: { Authorization: token }
      });

      if (data.success) {
        toast.success(data.message);
        setImage(false);
        setTitle("");
        setSubTitle("");
        quillRef.current.root.innerHTML = "";
        setCategory("Startup");
        setIsPublished(false);
        // Redirect to home to see the new blog
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-blue-50/50 text-gray-600 pt-20">
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-10">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Create New Blog Post</h1>
              <button
                onClick={() => navigate("/user-dashboard")}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to Dashboard
              </button>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Thumbnail
                </label>
                <label htmlFor="image" className="cursor-pointer">
                  <img
                    src={!image ? assets.upload_area : URL.createObjectURL(image)}
                    alt="Upload"
                    className="h-32 w-32 object-cover rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500"
                  />
                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    type="file"
                    id="image"
                    hidden
                    required
                    accept="image/*"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter your blog title"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Title
                </label>
                <input
                  type="text"
                  placeholder="Enter subtitle (optional)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => setSubTitle(e.target.value)}
                  value={subTitle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Content *
                </label>
                <div className="relative">
                  <div 
                    ref={editorRef} 
                    className="min-h-[300px] border border-gray-300 rounded-lg"
                  ></div>
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                      <div className="w-8 h-8 rounded-full border-2 border-t-indigo-600 animate-spin"></div>
                    </div>
                  )}
                  <button
                    disabled={loading}
                    type="button"
                    onClick={generateContent}
                    className="absolute bottom-2 right-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? "Generating..." : "Generate with AI"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {blogCategories.filter(cat => cat !== "All").map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="publish"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="publish" className="text-sm font-medium text-gray-700">
                  Publish immediately
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  disabled={isAdding}
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
                >
                  {isAdding ? "Creating..." : "Create Blog Post"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/user-dashboard")}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserAddBlog;
