import { Caption, Container, CustomNavLink, PrimaryButton, Title, useSignin } from "../../router";
import { commonClassNameOfInput } from "../../components/common/Design";
import { OTPVerification } from "./components/OtpVerification";

export const Login = () => {
  const { email, setEmail, setPassword, handleSubmit, error, needVerification, setNeedVerification } = useSignin();

  return (
    <section className="register pt-16 relative">
      <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
      <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
        <Container>
          <div>
            <Title level={3} className="text-white">
              {needVerification ? "OTP Verification" : "Log In"}
            </Title>
            <div className="flex items-center gap-3">
              <Title level={5} className="text-green font-normal text-xl">Home</Title>
              <Title level={5} className="text-white font-normal text-xl">/</Title>
              <Title level={5} className="text-white font-normal text-xl">
                {needVerification ? "OTP Verification" : "Log In"}
              </Title>
            </div>
          </div>
        </Container>
      </div>

      {/* Body */}
      <div
        className={`transition-all duration-500 ease-in-out transform ${
          needVerification ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {needVerification ? (
          <div className="w-full transform translate-x-full">
            <div className="flex justify-center pt-12">
              <Title className="w-1/2 text-center">
                Your account has been created but not verified yet. You need to verify your email address before you can login.
              </Title>
            </div>
            <OTPVerification email={email}/>
          </div>
        ) : (
          <div className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl">
            <form onSubmit={handleSubmit}>
              <div className="text-center">
                <Title level={5}>Sign in</Title>
                <p className="mt-2 text-lg">
                  Don't have an account? <CustomNavLink href="/auth/register">Signup Here</CustomNavLink>
                </p>
              </div>
              {error && (
                <div className="text-center">
                  <div className="text-red-500 mt-4">{error}</div>
                </div>
              )}
              <div className="py-5 mt-8">
                <Caption className="mb-2">Enter Your Email *</Caption>
                <input
                  type="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className={commonClassNameOfInput}
                  placeholder="Enter Your Email"
                  required
                />
              </div>
              <div>
                <Caption className="mb-2">Password *</Caption>
                <input
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className={commonClassNameOfInput}
                  placeholder="Enter Your Password"
                  required
                />
                <div className="text-right mt-2">
                  <CustomNavLink href="/auth/forgot-password" className="text-sm text-blue-500">Forgot Password?</CustomNavLink>
                </div>
              </div>
              <PrimaryButton className="w-full rounded-none my-5">LOGIN</PrimaryButton>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
