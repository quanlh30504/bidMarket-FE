import axios from 'axios';

const API_URL = '';

export const signup = async (formDataToSend) => {
  try {
    const response = await axios.post(`${API_URL}/api/signup`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error occurred';
  }
};

