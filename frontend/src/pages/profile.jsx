import { useState } from "react";
import { useAuth } from "../AuthContext";
import api from "../api";
import { toast } from "react-toastify";

export default function Profile() {
  const { user } = useAuth();
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const handleChangePw = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await api.patch("/users/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success("Password changed successfully!");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

      {/* User Info */}
      <div className="bg-[#1e293b] rounded-xl border border-gray-800 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-2xl">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-xl font-semibold text-white">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <p className="text-xs text-gray-500 capitalize mt-1">{user?.role?.replace("_", " ")}</p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-[#1e293b] rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Change Password</h2>
        <div className="space-y-3">
          <input type="password" placeholder="Current Password" value={pwForm.currentPassword}
            onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            className="w-full bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none" />
          <input type="password" placeholder="New Password" value={pwForm.newPassword}
            onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
            className="w-full bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none" />
          <input type="password" placeholder="Confirm New Password" value={pwForm.confirmPassword}
            onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
            className="w-full bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none" />
        </div>
        <button onClick={handleChangePw}
          className="mt-4 px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg">Change Password</button>
      </div>
    </div>
  );
}