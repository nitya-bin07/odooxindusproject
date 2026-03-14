import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/index.js";
import { sendError } from "../utils/response.js";

/**
 * Protect routes – verifies Bearer JWT and attaches req.user.
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "No token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user || !user.isActive) {
      return sendError(res, "User not found or inactive", 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, "Token expired", 401);
    }
    return sendError(res, "Invalid token", 401);
  }
};

/**
 * Restrict access to specific roles.
 * Usage:  router.delete('/', protect, restrictTo('admin'), handler)
 */
export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return sendError(
      res,
      `Access denied. Required role(s): ${roles.join(", ")}`,
      403
    );
  }
  next();
};
