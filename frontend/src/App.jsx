import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Homepage from "./Homepage";
import AuthForms from "./Authentications/Authforms";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/Overview";
import MoveHistory from "./pages/MoveHistory";
import Operations from "./pages/Operations";
import Products from "./pages/Products";
import Warehouses from "./pages/Warehouses";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/forgotPassword";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<AuthForms initialMode="login" />} />
          <Route path="/signup" element={<AuthForms initialMode="signup" />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="products" element={<Products />} />
            <Route path="operations" element={<Operations />} />
            <Route path="history" element={<MoveHistory />} />
            <Route path="warehouses" element={<Warehouses />} />
            <Route path="categories" element={<Categories />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
