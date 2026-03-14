import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-red-500 font-bold text-3xl mb-8">
        A
      </div>

      <h1 className="text-4xl font-bold text-gray-100 mb-3">Welcome</h1>
      <p className="text-gray-500 text-sm mb-10 text-center max-w-md">
        Manage your inventory, track operations, and stay on top of everything — all in one place.
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-8 py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="px-8 py-3 bg-gray-800 hover:bg-gray-700 active:scale-95 text-gray-200 text-sm font-semibold rounded-xl border border-gray-700 transition-all"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
