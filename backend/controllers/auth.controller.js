import bcrypt from "bcrypt";
import { User, OTP } from "../models/index.js";
import { signToken } from "../utils/jwt.js";
import { generateOTP, otpExpiry } from "../utils/otp.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { Op } from "sequelize";
import { sendOTPEmail } from "../utils/mailer.js";

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
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    // avoid email enumeration
    if (!user) {
      return sendSuccess(res, {}, "If that email exists, an OTP has been sent.");
    }

    // invalidate old OTPs
    await OTP.update(
      { used: true },
      { where: { userId: user.id, used: false, type: "password_reset" } }
    );

    const code = generateOTP();
    const expiresAt = otpExpiry();

    await OTP.create({
      userId: user.id,
      code,
      type: "password_reset",
      expiresAt,
    });
    await sendOTPEmail(user.email, code);
    return sendSuccess(
      res,
      { otp: code },
      "OTP generated. In production this would be sent via email."
    );
    
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not process request", 500);
  }
};
// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) return sendError(res, "Invalid request", 400);

    const record = await OTP.findOne({
      where: {
        userId: user.id,
        code: otp,
        used: false,
        type: "password_reset",
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!record) return sendError(res, "OTP is invalid or expired", 400);

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return sendError(res, "New password cannot be the same as the old password", 400);
    }

    const hashed = await bcrypt.hash(password, 12);

    await user.update({ password: hashed });

    await record.update({ used: true });

    return sendSuccess(res, {}, "Password reset successful");

  } catch (err) {
    console.error(err);
    return sendError(res, "Reset failed", 500);
  }
};

// GET /api/auth/me
export const me = async (req, res) => {
  return sendSuccess(res, { user: req.user });
};
