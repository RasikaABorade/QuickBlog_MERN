import express from "express";
import {
  adminLogin,
  approveCommentById,
  deleteCommentById,
  getAllBlogsAdmin,
  getAllComments,
  getdashboard,
  getAllUsers,
  toggleUserStatus,
  updateUserRole,
  getEnhancedDashboard,
} from "../controllers/adminController.js";
import auth, { adminAuth } from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/comments", adminAuth, getAllComments);
adminRouter.get("/blogs", adminAuth, getAllBlogsAdmin);
adminRouter.post("/delete-comment", adminAuth, deleteCommentById);
adminRouter.post("/approve-comment", adminAuth, approveCommentById);
adminRouter.get("/dashboard", adminAuth, getdashboard);

// New user management routes
adminRouter.get("/users", adminAuth, getAllUsers);
adminRouter.post("/toggle-user-status", adminAuth, toggleUserStatus);
adminRouter.post("/update-user-role", adminAuth, updateUserRole);
adminRouter.get("/enhanced-dashboard", adminAuth, getEnhancedDashboard);

export default adminRouter;
