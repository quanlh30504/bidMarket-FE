import { useState } from "react";
import { authService } from "../services/authService";
import {useNotification} from "../notifications/NotificationContext";
import {toast} from "react-toastify";

export const useSignin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { showToastNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log('Attempting login:', email);

    try {
      const response = await authService.signin(email, password);
      console.log('Login successful:', response);

      showToastNotification('Login successful!', 'info');

      await new Promise(resolve => setTimeout(resolve, 1000));
      // setTimeout(() => {
      //   window.location.href = '/';
      // }, 2000);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || "An error occurred");
      toast.error(err.message || "Login failed");
    }
  };

  return {
    setEmail,
    setPassword,
    handleSubmit,
    error,
  };
};
