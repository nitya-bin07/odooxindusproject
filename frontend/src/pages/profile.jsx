import { useState } from "react";
import { useAuth } from "../AuthContext";
import api from "../api";
import { toast } from "react-toastify";

import {
  User,
  Mail,
  Shield,
  Lock,
  KeyRound
} from "lucide-react";

export default function Profile() {

  const { user } = useAuth();

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

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
        newPassword: pwForm.newPassword
      });

      toast.success("Password changed successfully");

      setPwForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }

  };

  return (

    <div className="max-w-full  space-y-8">

      {/* PAGE TITLE */}

      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          My Profile
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage your account information and security settings
        </p>
      </div>

      {/* PROFILE CARD */}

      <div className="bg-white max-w-4xl mx-auto dark:bg-[#111827] rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-6">

        <div className="flex items-center gap-6">

          {/* AVATAR */}

          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow">
            <User size={40} strokeWidth={2.5} />
          </div>

          {/* USER INFO */}

          <div className="flex-1">

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </h2>

            <div className="mt-2 space-y-1 text-sm">

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail size={16} />
                {user?.email}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* SECURITY SECTION */}

      <div className="bg-white max-w-3xl mx-auto dark:bg-[#111827] rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-6">

        <div className="flex items-center gap-2 mb-5">

          <Lock size={18} className="text-gray-600 dark:text-gray-300" />

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Security
          </h2>

        </div>

        <p className="text-sm text-gray-500 mb-6">
          Update your password to keep your account secure.
        </p>

        <div className="space-y-4">

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Current Password
            </label>

            <input
              type="password"
              value={pwForm.currentPassword}
              onChange={(e) =>
                setPwForm({
                  ...pwForm,
                  currentPassword: e.target.value
                })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#020617] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              New Password
            </label>

            <input
              type="password"
              value={pwForm.newPassword}
              onChange={(e) =>
                setPwForm({
                  ...pwForm,
                  newPassword: e.target.value
                })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#020617] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Confirm New Password
            </label>

            <input
              type="password"
              value={pwForm.confirmPassword}
              onChange={(e) =>
                setPwForm({
                  ...pwForm,
                  confirmPassword: e.target.value
                })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#020617] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* BUTTON */}

        <div className="mt-6">

          <button
            onClick={handleChangePw}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg shadow-sm transition"
          >

            <KeyRound size={16} />

            Change Password

          </button>

        </div>

      </div>

    </div>

  );

}