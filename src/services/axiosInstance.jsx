import axios from 'axios';

const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

// Axios instance
const myAxios = axios.create({
  baseURL: '(Url)',  // url fill later
});

myAxios.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// try get new access token when the old one is expired
myAxios.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;

  // 401 (Unauthorized) and not retry yet
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true; // mark as retry
    try {
      const refreshToken = getRefreshToken();
      const response = await axios.post('(url)/api/users/refresh-token', {  // url fill later
        refreshToken: refreshToken,
      });

      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

      return myAxios(originalRequest);
    } catch (refreshError) {
      if (refreshError.response === "Invalid refresh token") { // refreshToken invalid = phien dang nhap ket thuc
        //call logout (implement later)
      }
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
});

export default myAxios;
