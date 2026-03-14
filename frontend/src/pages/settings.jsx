import { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import { ShieldAlert } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    api.get("/users")
      .then((r) => setUsers(r.data.data.users || []))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const handleToggleActive = async (u) => {
    try {
      await api.patch(`/users/${u.id}`, { isActive: !u.isActive });

      setUsers(
        users.map((x) =>
          x.id === u.id ? { ...x, isActive: !u.isActive } : x
        )
      );

      toast.success(`User ${!u.isActive ? "activated" : "deactivated"}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleRoleChange = async (u, role) => {
    try {
      await api.patch(`/users/${u.id}`, { role });

      setUsers(
        users.map((x) =>
          x.id === u.id ? { ...x, role } : x
        )
      );

      toast.success("Role updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  /* ---------------- STAFF VIEW ---------------- */

  if (!isAdmin) {
    return (
      <div className="max-w-full">
        <h1 className="text-2xl font-semibold  text-gray-900 dark:text-white mb-6">
          Settings
        </h1>

        <div className="flex items-center gap-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 shadow-sm">

          <ShieldAlert size={32} />

          <div>
            <p className="font-semibold text-lg">
              Access Restricted
            </p>

            <p className="text-sm opacity-90">
              Settings are available for admin users only.
              Please contact your administrator if you need access.
            </p>
          </div>

        </div>
      </div>
    );
  }

  /* ---------------- ADMIN VIEW ---------------- */

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        User Management
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <div className="bg-white dark:bg-[#111827] rounded-xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 dark:bg-[#020617] text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Email</th>
                <th className="text-left px-6 py-3">Role</th>
                <th className="text-center px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Joined</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">

              {users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >

                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {u.name}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {u.email}
                  </td>

                  <td className="px-6 py-4">

                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u, e.target.value)
                      }
                      className="bg-gray-100 dark:bg-[#020617] text-gray-800 dark:text-gray-200 text-xs rounded-lg px-3 py-1 border border-gray-300 dark:border-gray-700 outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="inventory_manager">
                        Manager
                      </option>
                      <option value="warehouse_staff">
                        Staff
                      </option>
                    </select>

                  </td>

                  <td className="px-6 py-4 text-center">

                    <button
                      onClick={() => handleToggleActive(u)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                        u.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </button>

                  </td>

                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}
    </div>
  );
}