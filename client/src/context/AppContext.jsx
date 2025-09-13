import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL; //for api call

const AppContext = createContext();

//children
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  //token for user authentication
  const [token, setToken] = useState(null);
  //store all blog data
  const [blogs, setBlogs] = useState([]);
  //we can filter blogs with input
  const [input, setInput] = useState("");

  //to display notification we use react  hot toast
  const fetchBlogs = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        setBlogs([]);
        return;
      }
      
      const { data } = await axios.get("/api/blog/all", {
        headers: { Authorization: userToken }
      });
      data.success ? setBlogs(data.blogs) : toast.error(data.message);
      //it will store data from database from blogstate
    } catch (error) {
      toast.error(error.message);
    }
  };

  //we have to execute above funct whenever we open the app so for that we'll use useEffrct
  useEffect(() => {
    fetchBlogs();
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `${token}`; //whwnever admin is logged in this token will be called
    }
  }, []);

  // Add function to refresh blogs
  const refreshBlogs = () => {
    fetchBlogs();
  };
  const value = {
    axios,
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    input,
    setInput,
    refreshBlogs,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

//bcoz to use context data we have to use usContext hook, so whwnever we have to use data from context we will simply call the useAppContext
export const useAppContext = () => {
  return useContext(AppContext);
};
