import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getBlogById,
  getBlogComments,
  togglePublish,
  getUserBlogs,
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router(); //new router

//upload is middleware
blogRouter.post("/add", upload.single("image"), auth, addBlog);

//end point for controller funct - now requires auth to see blogs
blogRouter.get("/all", auth, getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete", auth, deleteBlogById);
blogRouter.post("/toggle-publish", auth, togglePublish);
blogRouter.post("/add-comment", addComment);
blogRouter.post("/comments", getBlogComments);
blogRouter.post("/generate", auth, generateContent);
blogRouter.get("/user-blogs", auth, getUserBlogs);

//lets create api endpoint

export default blogRouter;
