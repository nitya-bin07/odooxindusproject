import { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";

export default function Settings() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    api.get("/users").then(r => setUsers(r.data.data.users || []))
      .catch(() => toast.error("Failed to load users")).finally(() => setLoading(false));
  }, [isAdmin]);

  const handleToggleActive = async (u) => {
    try {
      await api.patch(`/users/${u.id}`, { isActive: !u.isActive });
      setUsers(users.map(x => x.id === u.id ? { ...x, isActive: !u.isActive } : x));
      toast.success(`User ${!u.isActive ? "activated" : "deactivated"}`);
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleRoleChange = async (u, role) => {
    try {
      await api.patch(`/users/${u.id}`, { role });
      setUsers(users.map(x => x.id === u.id ? { ...x, role } : x));
      toast.success("Role updated");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  if (!isAdmin) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>
        <div className="bg-[#1e293b] rounded-xl border border-gray-800 p-6">
          <p className="text-gray-400">Settings are available for admin users only.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>

      {loading ? <p className="text-gray-400">Loading…</p> : (
        <div className="bg-[#1e293b] rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-center px-5 py-3">Active</th>
                <th className="text-left px-5 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((u) => (
                <tr key={u.id} className="text-gray-300 hover:bg-white/5">
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <select value={u.role} onChange={e => handleRoleChange(u, e.target.value)}
                      className="bg-[#0f172a] text-gray-200 text-xs rounded px-2 py-1 border border-gray-700 outline-none">
                      <option value="admin">Admin</option>
                      <option value="inventory_manager">Manager</option>
                      <option value="warehouse_staff">Staff</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button onClick={() => handleToggleActive(u)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.isActive ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"
                      }`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}