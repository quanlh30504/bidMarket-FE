import { useState } from "react";
import { authService } from "../services/authService";

export const useSignin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needVerification, setNeedVerification] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log(email, password);

    try {
      await authService.signin(email, password);
      window.location.href = '/';
    } catch (error) {
      if (error.response && error.response.data) {
        const errorCode = error.response.data.code;
        if (errorCode === 1011) {  // USER_IS_NOT_VERIFIED
          setNeedVerification(true);
          alert("Email is not verified. Redirecting to OTP verification.");
        }
      }
      setError(error.message || "An error occurred");
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
