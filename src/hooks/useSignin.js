import { useState } from "react";
import { authService } from "../services/authService";
import {useNotification} from "../notifications/NotificationContext";
import { useNavigate } from "react-router-dom";
import { otpService } from "../services/otpService";

export const useSignin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needVerification, setNeedVerification] = useState(false);
  const { showToastNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log('Attempting login:', email);

    try {
      const response = await authService.signin(email, password);
      console.log('Login successful:', response);

      showToastNotification('Login successful!', 'info');
      navigate('/');
      
    } catch (error) {
      if (error?.response?.data) {
        const errorCode = error.response.data.code;
        if (errorCode === 1011) {  // USER_IS_NOT_VERIFIED
          setNeedVerification(true);
          showToastNotification("Email is not verified. Redirecting to OTP verification.", "info");
        } else {
          showToastNotification(error.response.data?.message || 'An error occurred', 'error');
        }
      }
      // setError(error.message || "An error occurred");
    }
  };

  return {
    email,
    setEmail,
    setPassword,
    handleSubmit,
    error,
    needVerification,
    setNeedVerification,
  };
};
