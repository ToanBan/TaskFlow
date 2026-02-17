import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ChangePasswordPage from "./pages/ChangePassword";
import ResetPasswordPage from "./pages/ResetPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import "./index.css";
import ActiveAccount from "./pages/ActiveAccount";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/active-account" element={<ActiveAccount />} />
        <Route path="/" element={<Home />} />

        {/* <Route path="/dashboard" element={<DashboardPage />} />  */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
