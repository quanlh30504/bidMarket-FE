import myAxios from "./axiosClient";
import imageUtils from "../utils/imageUtils";

class AuthService {
  constructor() {
    this.tokenKey = 'accessToken';
    this.refreshTokenKey = 'refreshToken';
    this.userKey = 'user';
  }

  async signup(formData) {
    try {
      const processedData = await this.processSignupData(formData);
      console.log('processedData:', processedData);
      const response = await myAxios.post('/api/users/signup', processedData);
      console.log('response:', response);
      if (response.data?.jwt) {
        this.handleAuthSuccess(response.data);
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

    try {
      const response = await myAxios.post('/api/users/signin', { email, password});
      console.log('response:', response);

      if (response.data?.jwt) {
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
    const { jwt, refreshToken, user } = data;
    localStorage.setItem(this.tokenKey, jwt);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    myAxios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
  }

  handleError(error) {
    const message = error.response?.data?.message || error.message || 'Authentication Failed';
    console.error('Auth error:', error);
    throw new Error(message);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    delete myAxios.defaults.headers.common['Authorization'];
    window.alert('You have been logged out!');
    window.location.reload();
  }

  getCurrentUser() {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    const token = localStorage.getItem(this.refreshTokenKey);
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    if (!token) return true;
  
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
  
      // Check exp field
      if (!payload.exp) return true;
  
      const expiryTime = payload.exp * 1000; // convert seconds to milliseconds
      return Date.now() > expiryTime;
    } catch (error) {
      console.error("Token is invalid:", error);
      return true;
    }
  }
}

export const authService = new AuthService();