import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./Homepage";
import AuthForms from "./Authentications/Authforms";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/Overview";
import MoveHistory from "./pages/MoveHistory";
import Operations from "./pages/Operations";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<AuthForms initialMode="login" />} />
        <Route path="/signup" element={<AuthForms initialMode="signup" />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="history" element={<MoveHistory />} />
          <Route path="operations" element={<Operations />} />
          <Route path="products" element={<Products />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
