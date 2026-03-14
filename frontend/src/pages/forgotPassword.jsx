import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { Boxes, Warehouse, ShieldCheck } from "lucide-react";

function Input({ placeholder, type = "text", value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-[#0f172a] text-gray-100 px-4 py-3 rounded-xl border border-slate-700 outline-none mb-4 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
    />
  );
}

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const sendOTP = async () => {
    if (!email) {
      toast.error("Enter your email");
      return;
    }

    try {
      const res = await api.post("/auth/forgot-password", { email });

      toast.success(res.data.message || "OTP sent");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const resetPassword = async () => {
    if (!otp || !password) {
      toast.error("Enter OTP and new password");
      return;
    }

    try {
      const res = await api.post("/auth/reset-password", {
        email,
        otp,
        password
      });

      toast.success(res.data.message || "Password reset successful");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] items-center justify-center p-12">

        <div className="max-w-md text-white">

          <div className="flex items-center gap-2 mb-8">
            <Boxes className="text-indigo-400" size={32} />
            <span className="text-2xl font-bold">InvHub</span>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Secure Account Recovery
          </h2>

          <p className="text-slate-400 mb-10">
            Reset your password securely and regain access to your
            inventory dashboard.
          </p>

          <div className="space-y-6">

            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <Warehouse className="text-indigo-400" size={20} />
              </div>
              <p className="text-sm text-slate-300">
                Manage inventory securely
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <ShieldCheck className="text-indigo-400" size={20} />
              </div>
              <p className="text-sm text-slate-300">
                Secure authentication system
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex-1 bg-[#020617] flex items-center justify-center p-6">

        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link to="/" className="flex justify-center mb-8 lg:hidden text-white">
            <div className="flex items-center gap-2">
              <Boxes className="text-indigo-400" />
              <span className="font-bold text-lg">InvHub</span>
            </div>
          </Link>

          {/* CARD */}
          <div className="bg-[#0b1220] border border-slate-800 rounded-2xl p-8 shadow-2xl">

            <h2 className="text-2xl text-white font-semibold text-center mb-2">
              Forgot Password
            </h2>

            <p className="text-center text-sm text-slate-400 mb-6">
              {step === 1
                ? "Enter your email to receive an OTP"
                : "Enter the OTP and create a new password"}
            </p>

            {/* Step indicator */}
         

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  onClick={sendOTP}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold transition"
                >
                  Send OTP
                </button>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <Input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  onClick={resetPassword}
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-semibold transition"
                >
                  Reset Password
                </button>
              </>
            )}

            {/* Back */}
            <div className="text-center mt-6 text-xs text-slate-400">

              <button
                onClick={() => navigate("/login")}
                className="hover:text-indigo-400"
              >
                Back to Login
              </button>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}