import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  History,
  Settings,
  LogOut,
  Moon,
  Sun,
  Warehouse,
  Tag,
  User,
} from "lucide-react";

const navItems = [
  { to: "overview", label: "Dashboard", icon: LayoutDashboard },
  { to: "products", label: "Products", icon: Package },
  { to: "operations", label: "Operations", icon: ArrowLeftRight },
  { to: "history", label: "Move History", icon: History },
  { to: "warehouses", label: "Warehouses", icon: Warehouse },
  { to: "categories", label: "Categories", icon: Tag },
  { to: "profile", label: "Profile", icon: User },
  { to: "settings", label: "Settings", icon: Settings },
];
export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f172a] transition-colors">

      <div className="flex min-h-screen overflow-hidden">

        {/* Sidebar */}
        <div className="w-56 bg-[#0b1326] dark:bg-[#020617] text-white flex flex-col">

          {/* User */}
          <div className="p-5 border-b border-gray-800">
            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-full bg-gray-400"></div>

              <div>
                <p className="text-lg font-semibold">
                  {user?.name || "User"}
                </p>
              </div>

            </div>
          </div>

          {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
  {navItems.map((item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
            isActive
              ? "bg-blue-500 text-white"
              : "text-gray-300 hover:bg-white/10"
          }`
        }
      >
        <Icon size={18} />
        {item.label}
      </NavLink>
    );
  })}
</nav>

          {/* Dark Mode Toggle */}
          <div className="px-3 pb-3">

            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-white/10"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

          </div>

          {/* Logout */}
          <div className="p-3 border-t border-gray-800">

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-400"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>

        </div>

        {/* Main Area */}
        <div className="flex-1 bg-[#f3f4f6] dark:bg-[#020617] p-8 overflow-y-auto transition-colors">

          <div className="bg-white dark:bg-[#111827] rounded-xl shadow-sm p-8 min-h-full text-gray-900 dark:text-gray-100">

            <Outlet />

          </div>

        </div>

      </div>
    </div>
  );
}