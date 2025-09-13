import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.json({ success: false, message: "No token provided" });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    req.isMainAdmin = decoded.isMainAdmin || false;
    next(); //execute nxt funct
  } catch (error) {
    res.json({ success: false, message: "Invalid Token" });
  }
};

// Admin only middleware
export const adminAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is admin or main admin
    if (decoded.role !== 'admin' && !decoded.isMainAdmin) {
      return res.json({ success: false, message: "Access denied. Admin privileges required." });
    }
    
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    req.isMainAdmin = decoded.isMainAdmin || false;
    next();
  } catch (error) {
    res.json({ success: false, message: "Invalid Token" });
  }
};

export default auth;
