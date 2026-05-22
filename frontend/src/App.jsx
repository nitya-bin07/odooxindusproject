import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Homepage from "./Homepage";
import AuthForms from "./Authentications/Authforms";
import Dashboard from "./pages/Dashboard.jsx";
import Overview from "./pages/Overview.jsx";
import MoveHistory from "./pages/MoveHistory.jsx";
import Operations from "./pages/Operations.jsx";
import Products from "./pages/Products.jsx";
import Warehouses from "./pages/Warehouses.jsx";
import Categories from "./pages/Categories.jsx";
import Profile from "./pages/Profile.jsx";
import ForgotPassword from "./pages/ForgotPassword";

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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
