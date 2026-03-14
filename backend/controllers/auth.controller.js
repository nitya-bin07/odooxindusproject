import bcrypt from "bcrypt";
import { User, OTP } from "../models/index.js";
import { signToken } from "../utils/jwt.js";
import { generateOTP, otpExpiry } from "../utils/otp.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { Op } from "sequelize";

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return sendError(res, "Email already registered", 409);

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "warehouse_staff",
    });

    const token = signToken({ id: user.id, role: user.role });

    return sendSuccess(
      res,
      {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
      "Registration successful",
      201
    );
  } catch (err) {
    console.error(err);
    return sendError(res, "Registration failed", 500);
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !user.isActive)
      return sendError(res, "Invalid credentials", 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendError(res, "Invalid credentials", 401);

    const token = signToken({ id: user.id, role: user.role });

    return sendSuccess(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return sendError(res, "Login failed", 500);
  }
};

// POST /api/auth/forgot-password
// Generates OTP and returns it in the response body.
// In production, you would email this OTP instead.
exports.forgotPassword = (req, res) => {

  const { email } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    (err, results) => {

      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.json({
          message: "If that email exists, an OTP has been sent."
        });
      }

      const user = results[0];

      const otp = Math.floor(100000 + Math.random() * 900000);

      const expiry = new Date(Date.now() + 10 * 60 * 1000);

      db.query(
        "INSERT INTO otp_codes (user_id, code, type, expires_at) VALUES (?,?,?,?)",
        [user.id, otp, "password_reset", expiry],
        (err) => {

          if (err) return res.status(500).json(err);

          res.json({
            message: "OTP generated",
            otp
          });

        }
      );

    }
  );
};
// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {

  const { email, otp, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, users) => {

      if (users.length === 0) {
        return res.status(400).json({
          message: "Invalid request"
        });
      }

      const user = users[0];

      db.query(
        `SELECT * FROM otp_codes
         WHERE user_id=? AND code=? AND used=false AND expires_at > NOW()`,
        [user.id, otp],
        async (err, results) => {

          if (results.length === 0) {
            return res.status(400).json({
              message: "OTP invalid or expired"
            });
          }

          const bcrypt = require("bcrypt");

          const hashed = await bcrypt.hash(password, 10);

          db.query(
            "UPDATE users SET password=? WHERE id=?",
            [hashed, user.id]
          );

          db.query(
            "UPDATE otp_codes SET used=true WHERE id=?",
            [results[0].id]
          );

          res.json({
            message: "Password reset successful"
          });

        }
      );

    }
  );
};

// GET /api/auth/me
export const me = async (req, res) => {
  return sendSuccess(res, { user: req.user });
};
