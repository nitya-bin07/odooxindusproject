import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");

  const handleSubmit = async () => {

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {

      const res = await api.post("/auth/forgot-password", {
        email
      });

      toast.success(res.data.message || "Reset link sent to email");

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Something went wrong"
      );

    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">

      <div className="bg-[#111] border border-gray-800 rounded-xl p-6 w-full max-w-sm">

        <h2 className="text-xl text-white font-semibold mb-4">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-800 mb-4"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg"
        >
          Send Reset Link
        </button>

      </div>

    </div>
  );
}
