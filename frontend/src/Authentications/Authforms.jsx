import { useState } from "react";

function Input({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-3 outline-none border transition-all placeholder-gray-600 border-gray-800 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
      />
    </div>
  );
}

export default function AuthForms() {
  const [mode, setMode] = useState("login");
  const [fields, setFields] = useState({});
  const [success, setSuccess] = useState("");

  const set = (key, val) => setFields((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    setSuccess(mode === "login" ? "Signed in successfully!" : "Account created successfully!");
    setFields({});
    setTimeout(() => setSuccess(""), 3000);
  };

  const switchMode = (m) => {
    setMode(m);
    setFields({});
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-red-500 font-bold text-xl">
            A
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-2xl font-semibold text-gray-100 mb-1">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          {mode === "login" ? "Sign in to your account" : "Fill in your details below"}
        </p>

        {/* Card */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">

          {/* Tabs */}
          <div className="flex bg-black rounded-xl p-1 mb-6 border border-gray-800">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all
                  ${mode === m
                    ? "bg-gray-800 text-gray-100 border border-gray-700"
                    : "text-gray-500 hover:text-gray-400"
                  }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Fields */}
          <Input
            label="Login ID"
            placeholder="Enter your login ID"
            value={fields.loginId || ""}
            onChange={(e) => set("loginId", e.target.value)}
          />

          {mode === "signup" && (
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={fields.email || ""}
              onChange={(e) => set("email", e.target.value)}
            />
          )}

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={fields.password || ""}
            onChange={(e) => set("password", e.target.value)}
          />

          {mode === "signup" && (
            <Input
              label="Re-enter Password"
              type="password"
              placeholder="Confirm your password"
              value={fields.confirmPassword || ""}
              onChange={(e) => set("confirmPassword", e.target.value)}
            />
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full mt-2 py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all"
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>

          {/* Success */}
          {success && (
            <div className="mt-4 py-2.5 px-4 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-400 text-sm text-center">
              {success}
            </div>
          )}

          {/* Footer links */}
          {mode === "login" && (
            <div className="flex justify-center gap-5 mt-4">
              <button className="text-xs text-gray-600 hover:text-red-400 transition-colors">
                Forgot Password?
              </button>
              <span className="text-gray-700 text-xs">|</span>
              <button
                onClick={() => switchMode("signup")}
                className="text-xs text-gray-600 hover:text-red-400 transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}