// This "gatekeeper" checks that a request comes from a logged-in user
// before allowing it to reach a protected route (like creating a playlist).
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "No login token provided. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists." });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Login session invalid or expired. Please log in again." });
  }
};
