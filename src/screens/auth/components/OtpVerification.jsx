import { Container, Title, PrimaryButton, Caption } from "../../../router";
import { commonClassNameOfInput } from "../../../components/common/Design";
import { useState } from "react";
import { useOtpService } from "../../../router";
import { useNotification } from "../../../notifications/NotificationContext";

export const OTPVerification = ({ email, setEmail, isForgotPassword = false }) => { 
  const [otp, setOtp] = useState(""); // OTP input
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [emailSubmitted, setEmailSubmitted] = useState(!!email); // If props already passes the email value, skip the email import step
  const [verified, setVerified] = useState(false);
  const { sendOtp, verifyOtp, verifyOtpForgotPassword, resendOtp, loading, isCooldownActive, cooldown } = useOtpService();
  const { showToastNotification } = useNotification();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setErrorMessage(null);
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!otp) {
        setErrorMessage("Please enter OTP.");
        return;
      } else if (otp.length !== 6) {
        setErrorMessage("OTP must be 6 digits.");
        return;
      }
      // 2 type of verification: normal and forgot password
      if (isForgotPassword) {
        await verifyOtpForgotPassword(otp, email);
      } else {
        await verifyOtp(otp, email);
      }
      setVerified(true);
      if (isForgotPassword) {
        // setSuccessMessage("OTP has been verified successfully. A new password has been sent to your email.");
        window.location.href = "/auth/login";
      } else {
        // setSuccessMessage("OTP has been verified successfully. You can now login.");
        window.location.href = "/auth/login";
      }
    } catch {
      // setErrorMessage("Failed to verify OTP. Please try again.");
      showToastNotification("Failed to verify OTP. Please try again.", "error");
    }
  };

  // Handle sending OTP after entering email
  const handleSendOtp = async () => {
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email.");
      return;
    }

    try {
      await sendOtp(email);
      // setSuccessMessage("OTP has been sent successfully.");
      showToastNotification("OTP has been sent successfully.", "info");
      setEmailSubmitted(true);
    } catch {
      // setErrorMessage("Failed to send OTP. Please try again.");
      showToastNotification("Failed to send OTP. Please try again.", "error");
    }
  };

  // Handle resending OTP
  const handleResendOtp = async () => {
    try {
      await resendOtp(email);
      // setSuccessMessage("OTP has been sent successfully.");
      showToastNotification("OTP has been sent successfully.", "info");
    } catch {
      // setErrorMessage("Failed to send OTP. Please try again.");
      showToastNotification("Failed to send OTP. Please try again.", "error");
    }
  };

  // Mask email address (abc***@domain)
  const maskEmail = (email) => {
    if (typeof email !== "string" || !email.includes("@")) {
      throw new Error("Invalid email address");
    }
    const [username, domain] = email.split("@");
    if (username.length <= 3) {
      return `${username}@${domain}`;
    }
    const maskedUsername = username.slice(0, 3) + "***";
  
    return `${maskedUsername}@${domain}`;
  }

  return (
    <Container>
      <form
        className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl"
        onSubmit={emailSubmitted ? handleOtpSubmit : (e) => { e.preventDefault(); handleSendOtp(); }}
      >
        <div className="text-center">
          <Title level={5}>OTP Verification</Title>
          {emailSubmitted ? (
            <p className="mt-2 text-lg">
              We have sent an OTP to {maskEmail(email)}. <br />
              { isForgotPassword ? "Please enter the OTP to reset your password." : "Please enter the OTP to verify your email." }
            </p>
          ) : (
            <p className="mt-2 text-lg">Please enter your email to receive an OTP.</p>
          )}
        </div>
        
        {errorMessage && <div className="text-red-500 mt-4 text-center">{errorMessage}</div>}
        {successMessage && <div className="text-green mt-4 text-center">{successMessage}</div>}

        {!emailSubmitted ? (
          <div className="py-5">
            <Caption className="mb-2">Email</Caption>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              className={commonClassNameOfInput}
              placeholder="Enter your email"
              required
            />
            <PrimaryButton
              type="button"
              className="w-full rounded-none my-5"
              disabled={loading}
            >
              Send OTP
            </PrimaryButton>
          </div>
        ) : (
          <>
            <div className="py-5">
              <Caption className="mb-2">OTP Code</Caption>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                className={commonClassNameOfInput}
                placeholder="Enter OTP"
                required
                maxLength={6}
              />
            </div>
            <PrimaryButton
              className="w-full rounded-none my-5"
              disabled={loading || verified}
            >
              VERIFY OTP
            </PrimaryButton>
              <p className="text-center mt-5">
                Didn’t receive the OTP?{" "}
                <span
                  onClick={!isCooldownActive && !loading && !verified ? handleResendOtp : null}
                  className={`underline ${
                    isCooldownActive || loading || verified
                      ? "text-gray-400 cursor-not-allowed"  // disabled
                      : "text-green cursor-pointer"          // enabled
                  }`}
                >
                  {isCooldownActive ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
                </span>
              </p>
          </>
        )}
      </form>
    </Container>
  );
};
