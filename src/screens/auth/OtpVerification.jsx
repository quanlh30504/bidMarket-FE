import { useState } from "react";
import { Container, Title, PrimaryButton, Caption } from "../../router";
import { commonClassNameOfInput } from "../../components/common/Design";

export const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setOtp(e.target.value);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }
    verifyOtp(otp)
      .then((res) => {
        setSuccessMessage("OTP verified successfully!");
        setError(null);
      })
      .catch((err) => {
        setError("Invalid OTP. Please try again.");
      });
  };

  const resendOtp = () => {
    resendOtpCode()
      .then(() => setSuccessMessage("OTP has been resent successfully."))
      .catch(() => setError("Failed to resend OTP. Please try again."));
  };

  return (
    <section className="regsiter pt-16 relative">
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
        <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
          <Container>
            <div>
              <Title level={3} className="text-white">
                Sign Up
              </Title>
              <div className="flex items-center gap-3">
                <Title level={5} className="text-green font-normal text-xl">
                  Home
                </Title>
                <Title level={5} className="text-white font-normal text-xl">
                  /
                </Title>
                <Title level={5} className="text-white font-normal text-xl">
                  Sign Up
                </Title>
              </div>
            </div>
          </Container>
        </div>

      <Container>
        <div className="text-center my-16">
          <Title level={3} className="text-black">
            OTP Verification
          </Title>
          <p className="mt-2 text-lg">
            Enter the 6-digit OTP sent to your registered email or phone number.
          </p>
        </div>

        <form
          className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl"
          onSubmit={handleSubmit}
        >
          {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
          {successMessage && <div className="text-green-500 mt-4 text-center">{successMessage}</div>}

          <div className="py-5">
            <Caption className="mb-2">OTP Code</Caption>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={handleChange}
              className={commonClassNameOfInput}
              placeholder="Enter OTP"
              required
              maxLength={6}
            />
          </div>

          <PrimaryButton className="w-full rounded-none my-5">VERIFY OTP</PrimaryButton>

          <p className="text-center mt-5">
            Didn’t receive the OTP?{" "}
            <span
              onClick={resendOtp}
              className="text-green underline cursor-pointer"
            >
              Resend OTP
            </span>
          </p>
        </form>
      </Container>
    </section>
  );
};

const verifyOtp = async (otp) => {
  // API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      otp === "123456" ? resolve("Verified") : reject("Invalid OTP");
    }, 1000);
  });
};

const resendOtpCode = async () => {
  // API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Resent");
    }, 1000);
  });
};
