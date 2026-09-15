// Like "protect", but doesn't block the request if there's no token.
// Used for routes that behave differently for logged-in users but still
// work for guests (e.g. recommended songs).
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      // invalid token -> just treat as a guest, don't error out
    }
  }
  next();
};
