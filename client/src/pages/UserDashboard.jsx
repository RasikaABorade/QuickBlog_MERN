import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserDashboard = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userData = localStorage.getItem("userData");
    
    if (!token || !userData) {
      navigate("/user-login");
      return;
    }
    
    setUser(JSON.parse(userData));
    fetchUserBlogs();
  }, []);

  const fetchUserBlogs = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const { data } = await axios.get("/api/blog/user-blogs", {
        headers: { Authorization: token }
      });
      
      if (data.success) {
        setUserBlogs(data.blogs);
      }
    } catch (error) {
      toast.error("Failed to fetch your blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
                <p className="text-gray-600">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {user?.role === 'admin' ? 'Admin User' : 'Regular User'}
                </span>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => navigate("/add-blog")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Create Blog
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Your Blog Posts</h2>
            
            {userBlogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You haven't created any blog posts yet.</p>
                <button
                  onClick={() => navigate("/add-blog")}
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                >
                  Create Your First Blog
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userBlogs.map((blog) => (
                  <div key={blog._id} className="border rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src={blog.image} 
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
                      <p className="text-gray-600 text-sm mb-3" 
                         dangerouslySetInnerHTML={{ __html: blog.description.slice(0, 100) + "..." }}>
                      </p>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          blog.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <button
                          onClick={() => navigate(`/blog/${blog._id}`)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
