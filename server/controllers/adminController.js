import dotenv from "dotenv";
dotenv.config(); // ✅ Load environment variables

import jwt from "jsonwebtoken";
import Blog from "../models/blog.js";
import Comment from "../models/Comment.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 🧪 DEBUG LOG:
    console.log("Frontend sent Email:", email);
    console.log("Frontend sent Password:", password);

    if (email !== "rasika@gmail.com" || password !== "girl123") {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//below admin can see all  blog list in admin dashboard  wheter it is published or not
export const getAllBlogsAdmin = async (req, res) => {
  try {
    //empty as it will return all blog posts
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//below admin can see all comments whether it is approved or not approved

export const getAllComments = async (req, res) => {
  try {
    //empty {} as it will return all the comments
    const comments = await Comment.find({})
      .populate("blog")
      .sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//admin can get dashboard data
export const getdashboard = async (req, res) => {
  try {
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
    const blogs = await Blog.countDocuments(); //it will total no. of blogs
    const comments = await Comment.countDocuments();
    const drafts = await Blog.countDocuments({ isPublished: false }); //it means blogs is not published it will count in drafts

    const dashboardData = {
      blogs,
      comments,
      drafts,
      recentBlogs,
    };
    res.json({ success: true, dashboardData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//admin can delete the comment
export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndDelete(id); //this comment will be deleted
    res.json({ success: true, message: "Comment deleted Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//admin can approve the comment
export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndUpdate(id, { isApproved: true }); //this comment will be updated or approved
    res.json({ success: true, message: "Comment Approved Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
