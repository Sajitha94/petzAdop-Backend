import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const protect = async (req, res, next) => {
  try {
    const authString = req.headers.authorization;

    if (!authString || !authString.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized, no token provided",
      });
    }

    const token = authString.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_AUTH_SECRET_KEY);

    // find user by decoded id
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized, user not found",
      });
    }

    // check if token matches currentToken (invalidation logic)
    if (user.currentToken !== token) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized, token is expired or no longer valid",
      });
    }

    // attach user to request
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      usertype: user.usertype,
      role: user.usertype,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({
      status: "error",
      message: "Unauthorized, invalid or expired token",
    });
  }
};
