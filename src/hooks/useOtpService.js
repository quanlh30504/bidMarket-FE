import { useState, useCallback, useEffect } from 'react';
import { otpService } from '../services/otpService';

export const useOtpService = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cooldown, setCooldown] = useState(0);
    const [isCooldownActive, setIsCooldownActive] = useState(false);

    const sendOtp = async (email) => {
        setLoading(true);
        setError(null);
        try {
            const result = await otpService.sendOtp(email);
            return result;
        } catch (error) {
            setError(error?.response?.data?.message || "An error occurred")
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (otp, email) => {
        setLoading(true);
        setError(null);
        try {
            const result = await otpService.verifyOtp(otp, email);
            return result;
        } catch (error) {
            setError(error?.response?.data?.message || "An error occurred")
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const verifyOtpForgotPassword = async (otp, email) => {
        setLoading(true);
        setError(null);
        try {
            const result = await otpService.verifyOtpForgotPassword(otp, email);
            return result;
        } catch (error) {
            setError(error?.response?.data?.message || "An error occurred")
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = useCallback(async (email) => {
        if (isCooldownActive) return;
        
        setLoading(true);
        setError(null);
        setIsCooldownActive(true);
        setCooldown(30);

        try {
            const result = await otpService.sendOtp(email);
            return result;
        } catch (error) {
            setError(error?.response?.data?.message || "An error occurred")
            throw error;
        } finally {
            setLoading(false);
        }
    }, [isCooldownActive]);

    // cooldown
    useEffect(() => {
        if (isCooldownActive && cooldown > 0) {
            const intervalId = setInterval(() => {
                setCooldown(prev => {
                    if (prev === 1) {
                        setIsCooldownActive(false);
                        clearInterval(intervalId);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [isCooldownActive, cooldown]);

    return { sendOtp, verifyOtp, verifyOtpForgotPassword, resendOtp, loading, error, cooldown, isCooldownActive };
};
