import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Protected routes (require authentication)
userRouter.get("/profile", auth, getUserProfile);
userRouter.put("/profile", auth, updateUserProfile);

export default userRouter;
