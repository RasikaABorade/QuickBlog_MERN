import dotenv from "dotenv";
dotenv.config(); // ✅ Load environment variables

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Blog from "../models/blog.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if it's the main admin (hardcoded for backward compatibility)
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email, role: 'admin', isMainAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.json({ 
        success: true, 
        token,
        user: { email, role: 'admin', isMainAdmin: true }
      });
    }

    // Check if it's a user with admin role
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.json({ success: false, message: "Account is deactivated" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//below admin can see all  blog list in admin dashboard  wheter it is published or not
export const getAllBlogsAdmin = async (req, res) => {
  try {
    //empty as it will return all blog posts with author info
    const blogs = await Blog.find({}).populate('author', 'name email').sort({ createdAt: -1 });
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
    const recentBlogs = await Blog.find({}).populate('author', 'name email').sort({ createdAt: -1 }).limit(5);
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

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Toggle user active status (admin only)
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ 
      success: true, 
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully` 
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.json({ success: false, message: "Invalid role" });
    }
    
    const user = await User.findByIdAndUpdate(
      userId, 
      { role }, 
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    
    res.json({ 
      success: true, 
      message: "User role updated successfully",
      user 
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Enhanced dashboard data with user statistics
export const getEnhancedDashboard = async (req, res) => {
  try {
    const recentBlogs = await Blog.find({}).populate('author', 'name email').sort({ createdAt: -1 }).limit(5);
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const drafts = await Blog.countDocuments({ isPublished: false });
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const recentUsers = await User.find({}).select("-password").sort({ createdAt: -1 }).limit(5);

    const dashboardData = {
      blogs,
      comments,
      drafts,
      totalUsers,
      activeUsers,
      recentBlogs,
      recentUsers
    };
    
    res.json({ success: true, dashboardData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
