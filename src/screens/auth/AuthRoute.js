import { Route, Routes } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";
import { ForgotPassword } from "./ForgotPassword";
import { ChangePasswordInProfile } from "./ChangePasswordInProfile";
export const AuthRoute = () => {
    return (
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="change-password" element={<ChangePasswordInProfile />} />
      </Routes>
    );
  };
  