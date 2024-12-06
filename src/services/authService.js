import axiosClient from "./axiosClient";
import fileUtils from "../utils/fileUtils";
import { authUtils } from "../utils/authUtils";

class AuthService {
  constructor() {
    this.tokenKey = 'accessToken';
    this.userHandler = null;
  }

  setUserHandler(handler) {
    this.userHandler = handler;
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
      throw error;
    }
  }

  async signin(email, password) {
    try {
      const response = await axiosClient.post('/api/users/signin', { email, password});
      console.log('response:', response);

      if (response.data?.accessToken) {
        this.handleAuthSuccess(response.data);
        if (this.userHandler) {
          this.userHandler.setRole(this.getRoleFromToken(response.data.accessToken));
          this.userHandler.setUUID(authUtils.getCurrentUserId());
        } else {
          throw new Error('Role handler is not set');
        }
        return response.data;
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      // throw this.handleError(error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await axiosClient.post('/api/users/logout');  // clear token in httpOnly cookie
      localStorage.removeItem(this.tokenKey);
      if (this.userHandler) {
        this.userHandler.deleteRole();
        this.userHandler.deleteUUID();
      } else {
        throw new Error('Role handler is not set');
      }
      window.alert('Logout success');
      window.location.href = '/';
      return response;
    } catch (error) {
      console.error('Failed to logout:', error);
      throw error;
    }
  }
  
  async changePassword(email, currentPassword, newPassword) {
    try {
      const response = await axiosClient.post(`/api/users/changePassword/${email}`, null, {
        params: { currentPassword, newPassword },
      });
      console.log('response:', response);
      if (response.data) {
        return response.data.message || response.data || 'Change password success';
      }
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }  

  async refreshToken() {
    console.log('try to refresh token...');
    try {
      const response = await axiosClient.post('/api/users/refresh-token');
      const { accessToken } = response.data;
      localStorage.setItem(this.tokenKey, accessToken);
      if (this.userHandler) {
        this.userHandler.setRole(this.getRoleFromToken(accessToken));
        this.userHandler.setUUID(authUtils.getCurrentUserId());
      } else {
        throw new Error('Role handler is not set');
      }
      console.log('refresh token success:', accessToken);
      return accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
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
          formData.frontImage && fileUtils.uploadImage(formData.frontImage, 'id-cards'),
          formData.backImage && fileUtils.uploadImage(formData.backImage, 'id-cards'),
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
  }

  handleError(error) {
    const message = error.response?.data?.message || error.message || 'Authentication Failed';
    console.error('Auth error:', error);
    throw new Error(message);
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
      if (Array.isArray(payload.roles) && payload.roles.length > 0) {
        const role = payload.roles[0];
        if (role === "ROLE_BIDDER") {
          payload.roles = "BIDDER";
        } else if (role === "ROLE_SELLER") {
          payload.roles = "SELLER";
        } else if (role === "ROLE_ADMIN") {
          payload.roles = "ADMIN";
        } else {
          payload.roles = null;
        }
      } else {
        payload.roles = null;
      }
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