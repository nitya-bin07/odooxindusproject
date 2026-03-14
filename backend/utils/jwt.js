import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Sign a JWT for the given user payload.
 */
export const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });

/**
 * Verify a JWT and return the decoded payload.
 * Throws if invalid or expired.
 */
export const verifyToken = (token) => jwt.verify(token, SECRET);
