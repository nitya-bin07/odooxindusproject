import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import { sendSuccess, sendError } from "../utils/response.js";

// GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    return sendSuccess(res, { users });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch users", 500);
  }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return sendError(res, "User not found", 404);
    return sendSuccess(res, { user });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch user", 500);
  }
};

// PATCH /api/users/:id
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, "User not found", 404);

    // Only admin can change roles; users can update their own name
    const { name, role, isActive } = req.body;
    const updates = {};
    if (name)     updates.name = name;
    if (role && req.user.role === "admin") updates.role = role;
    if (isActive !== undefined && req.user.role === "admin")
      updates.isActive = isActive;

    await user.update(updates);
    return sendSuccess(res, {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not update user", 500);
  }
};

// PATCH /api/users/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return sendError(res, "currentPassword and newPassword are required", 422);
    if (newPassword.length < 6)
      return sendError(res, "newPassword must be ≥ 6 characters", 422);

    const user = await User.findByPk(req.user.id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return sendError(res, "Current password is incorrect", 401);

    const hashed = await bcrypt.hash(newPassword, 12);
    await user.update({ password: hashed });
    return sendSuccess(res, {}, "Password changed successfully");
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not change password", 500);
  }
};

// DELETE /api/users/:id  (admin only, soft-delete)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, "User not found", 404);
    await user.destroy();
    return sendSuccess(res, {}, "User deleted");
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not delete user", 500);
  }
};
