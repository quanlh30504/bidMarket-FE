import { OTPVerification } from "./components/OtpVerification";
import { Container, Title } from "../../components/common/Design";
import { useState } from "react";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    return (
        <section className="register pt-16 relative">
      <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
      <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
        <Container>
          <div>
            <Title level={3} className="text-white">
              Forgot Password
            </Title>
            <div className="flex items-center gap-3">
              <Title level={5} className="text-green font-normal text-xl">Home</Title>
              <Title level={5} className="text-white font-normal text-xl">/</Title>
              <Title level={5} className="text-white font-normal text-xl">
                Forgot Password
              </Title>
            </div>
          </div>
        </Container>
      </div>

      {/* Body */}
        <div className="flex justify-center pt-12">
            <Title className="w-1/2 text-center">
                Forgot your password? <br/> Enter your email here and verify OTP to reset your password.
            </Title>
        </div>
            <OTPVerification email={email} setEmail={setEmail} isForgotPassword={true}/>   
    </section>
    );
}