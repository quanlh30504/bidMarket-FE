import { useState } from "react";
import { authService } from "../services/authService";

export const useSignin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log(email, password);

    try {
      await authService.signin(email, password);
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  return {
    setEmail,
    setPassword,
    handleSubmit,
    error,
  };
};
