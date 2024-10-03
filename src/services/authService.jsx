import axios from "axios";

const API_URL = "";

export const signup = async (formDataToSend) => {
  try {
    const response = await axios.post(`${API_URL}/api/signup`, formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error occurred";
  }
};

export const signin = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, { email, password });
    return response.data; // (JwtAuthenticationResponse)
  } catch (error) {
    throw error.response?.data?.message || "Error occurred";
  }
};
