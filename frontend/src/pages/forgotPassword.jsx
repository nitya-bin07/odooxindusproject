import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api";

export default function ForgotPassword() {

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

    } catch (err) {

      toast.error(err.response?.data?.message || "Reset failed");

    }

  };

  return (

    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">

      <div className="bg-[#111] border border-gray-800 rounded-xl p-6 w-full max-w-sm">

        <h2 className="text-xl text-white font-semibold mb-4">
          Forgot Password
        </h2>

        {step === 1 && (

          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-800 mb-4"
            />

            <button
              onClick={sendOTP}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg"
            >
              Send OTP
            </button>

          </>

        )}

        {step === 2 && (

          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-800 mb-3"
            />

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-800 mb-4"
            />

            <button
              onClick={resetPassword}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg"
            >
              Reset Password
            </button>

          </>

        )}

      </div>

    </div>

  );
}
