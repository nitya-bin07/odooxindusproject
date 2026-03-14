import { useState } from "react";
import { useAuth } from "./AuthContext"; // Adjust path as needed

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const { forgotPassword, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await forgotPassword(email);
    setMessage({ 
      type: result.success ? "success" : "error", 
      text: result.message 
    });
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password?</h2>
      <p>Enter your email address and we'll send you a link to reset your password.</p>
      
      {message.text && (
        <div className={`alert ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      
      <div className="footer">
        <a href="/login">Back to Login</a>
      </div>
    </div>
  );
}
