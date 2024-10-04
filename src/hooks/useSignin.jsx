import { useState } from "react";
import { signin } from "../services/authService";

export const useSignin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const [token, setToken] = useState({
//     accessToken: "",
//     tokenType: "",
//     refreshToken: "",
//   });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log(email, password);

    try {
      const data = await signin(email, password);
    //   setToken({
    //     accessToken: data.accessToken,
    //     tokenType: data.tokenType || "Bearer",
    //     refreshToken: data.refreshToken,
    //   });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("tokenType", data.tokenType || "Bearer");
      localStorage.setItem("refreshToken", data.refreshToken);
    } catch (err) {
      setError(err);
    }
  };

  return {
    // token,
    setEmail,
    setPassword,
    handleSubmit,
    error,
  };
};
