import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import { Boxes, Warehouse, BarChart3 } from "lucide-react";

function Input({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-[#0f172a] text-gray-100 text-sm rounded-xl px-4 py-3 outline-none border border-slate-700 transition-all placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );
}

export default function AuthForms({ initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [fields, setFields] = useState({});
  const navigate = useNavigate();
  const { login, signup, loading } = useAuth();

  const set = (key, val) => setFields((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (mode === "login") {
      const result = await login(fields.email || "", fields.password || "");

      if (result.success) {
        toast.success("Signed in successfully!");
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        toast.error(result.message);
      }
    } else {
      if (fields.password !== fields.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const result = await signup(
        fields.name || "",
        fields.email || "",
        fields.password || ""
      );

      if (result.success) {
        toast.success("Account created successfully!");
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        toast.error(result.message);
      }
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setFields({});
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] items-center justify-center p-12">

        <div className="max-w-md text-white">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <Boxes className="text-indigo-400" size={32} />
            <span className="text-2xl font-bold">InvHub</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Smart Inventory <br /> Management Platform
          </h2>

          <p className="text-slate-400 mb-10">
            Replace Excel sheets and manual registers with a modern
            inventory management system built for warehouse teams.
          </p>

          {/* Feature list */}
          <div className="space-y-6">

            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <Boxes className="text-indigo-400" size={20} />
              </div>
              <p className="text-sm text-slate-300">
                Real-time inventory tracking
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <Warehouse className="text-indigo-400" size={20} />
              </div>
              <p className="text-sm text-slate-300">
                Warehouse transfer management
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <BarChart3 className="text-indigo-400" size={20} />
              </div>
              <p className="text-sm text-slate-300">
                Inventory insights & analytics
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 bg-[#020617] flex items-center justify-center p-6">

        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <Link to="/" className="flex justify-center mb-8 lg:hidden">
            <div className="flex items-center gap-2 text-white">
              <Boxes className="text-indigo-400" />
              <span className="font-bold text-lg">InvHub</span>
            </div>
          </Link>

          {/* Auth Card */}
          <div className="bg-[#0b1220] border border-slate-800 rounded-2xl p-8 shadow-2xl">

            {/* Heading */}
            <h1 className="text-2xl font-semibold text-white text-center mb-1">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>

            <p className="text-center text-sm text-slate-400 mb-6">
              {mode === "login"
                ? "Sign in to access your inventory dashboard"
                : "Start managing your inventory today"}
            </p>

            {/* Tabs */}
            <div className="flex bg-[#020617] rounded-xl p-1 mb-6 border border-slate-800">

              {["login", "signup"].map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all
                  ${
                    mode === m
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}

            </div>

            {/* Fields */}
            {mode === "signup" && (
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={fields.name || ""}
                onChange={(e) => set("name", e.target.value)}
              />
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={fields.email || ""}
              onChange={(e) => set("email", e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={fields.password || ""}
              onChange={(e) => set("password", e.target.value)}
            />

            {mode === "signup" && (
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={fields.confirmPassword || ""}
                onChange={(e) => set("confirmPassword", e.target.value)}
              />
            )}

            {/* Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-3 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>

            {/* Footer links */}
            {mode === "login" && (
              <div className="flex justify-center gap-6 mt-5 text-xs text-slate-400">

                <button
                  onClick={() => navigate("/forgot-password")}
                  className="hover:text-indigo-400"
                >
                  Forgot Password
                </button>

                <button
                  onClick={() => switchMode("signup")}
                  className="hover:text-indigo-400"
                >
                  Create Account
                </button>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}