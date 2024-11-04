import axiosClient from "./axiosClient";
import imageUtils from "../utils/imageUtils";

class AuthService {
  constructor() {
    this.tokenKey = 'accessToken';
  }

  async signup(formData) {
    try {
      const processedData = await this.processSignupData(formData);
      console.log('processedData:', processedData);
      const response = await axiosClient.post('/api/users/signup', processedData);
      console.log('response:', response);
      if (response.data) {
        return response.data;
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async signin(email, password) {
    console.log('email:', email);
    console.log('password:', password);
    console.log(`${process.env.REACT_APP_BACKEND_URL}`);

    try {
      const response = await axiosClient.post('/api/users/signin', { email, password});
      console.log('response:', response);

      if (response.data?.accessToken) {
        this.handleAuthSuccess(response.data);
        return response.data;
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async processSignupData(formData) {
    const baseData = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      role: formData.role || 'BIDDER'
    };

    if (formData.role === 'SELLER') {
      //process images in parallel
      const [frontImageURL, backImageURL] = await Promise.all([
          formData.frontImage && imageUtils.uploadImage(formData.frontImage, 'id-cards'),
          formData.backImage && imageUtils.uploadImage(formData.backImage, 'id-cards'),
      ]);

      return {
        ...baseData,
        idCard: formData.idCard,
        issuedDate: formData.issuedDate,
        expirationDate: formData.expirationDate,  
        frontImageURL,
        backImageURL
      };
    }

    return baseData;
  }

  handleAuthSuccess(data) {
    const { accessToken } = data;
    localStorage.setItem(this.tokenKey, accessToken);
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }

  handleError(error) {
    const message = error.response?.data?.message || error.message || 'Authentication Failed';
    console.error('Auth error:', error);
    throw new Error(message);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    delete axiosClient.defaults.headers.common['Authorization'];
    window.alert('You have been logged out!');
    // window.location.reload();
  }

  getCurrentUser() {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isTokenExpired(token) {
    if (!token) return true;

    try {
      const payload = this.decodeToken(token);
      if (!payload.exp) return true;

      const expiryTime = payload.exp * 1000; // convert seconds to milliseconds
      return Date.now() > expiryTime;
    } catch (error) {
      console.error("Token is invalid:", error);
      return true;
    }
  }

  getRoleFromToken(token) {
    if (!token) return null;

    try {
      const payload = this.decodeToken(token);
      console.log('roles:', payload.roles);
      return payload.roles;
    } catch (error) {
      console.error("Token is invalid:", error);
      return null;
    }
  }

  decodeToken(token) {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    return JSON.parse(payloadJson);
  }
}

export const authService = new AuthService();