import axiosClient from "./axiosClient";

class OtpService {
    async sendOtp(email) {
        try {
            const response = await axiosClient.post(`/emails/sendOtp/${email}`);
            console.log('response:', response);
            
            if (response.data) {
                return response.data;
            }
            throw new Error('Invalid response from server');
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async verifyOtp(otp, email) {
        try {
            const response = await axiosClient.post(`/emails/register/verifyOtp/${otp}/${email}`);
            console.log('response:', response);

            if (response.data) {
                return response.data;
            }
            throw new Error('Invalid response from server');
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async verifyOtpForgotPassword(otp, email) {
        try {
            const response = await axiosClient.post(`/emails/forgotPassword/verifyOtp/${otp}/${email}`);
            console.log('response:', response);

            if (response.data) {
                return response.data;
            }
            throw new Error('Invalid response from server');
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleError(error) {
        console.error('API Error:', error);
        if (error.response && error.response.data && error.response.data.message) {
            return new Error(error.response.data.message);
        }
        return new Error('An unexpected error occurred');
    }
}

export const otpService = new OtpService();
