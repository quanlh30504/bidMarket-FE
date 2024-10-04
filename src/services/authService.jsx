import myAxios from "./axiosInstance";

// const API_URL = "";  //define in myAxios

export const signup = async (formDataToSend) => {
  try {
    const response = await myAxios.post(`/api/users/signup`, formDataToSend, {
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
    const response = await myAxios.post(`/api/users/signin`, { email, password });
    return response.data; // (JwtAuthenticationResponse)
  } catch (error) {
    throw error.response?.data?.message || "Error occurred";
  }
};
