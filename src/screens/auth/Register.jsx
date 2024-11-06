import {
  Caption,
  Container,
  CustomNavLink,
  PrimaryButton,
  Title,
  useSignup,
} from "../../router";
import { commonClassNameOfInput } from "../../components/common/Design";
import { OTPVerification } from "./components/OtpVerification";
import { useState } from "react";

const formConfig = [
  { name: 'fullName', label: 'Fullname *', type: 'text', placeholder: 'Full Name', required: true },
  { name: 'email', label: 'Enter Your Email *', type: 'email', placeholder: 'Enter Your Email', required: true },
  { name: 'password', label: 'Password *', type: 'password', placeholder: 'Enter Your Password', required: true },
  { name: 'confirmPassword', label: 'Confirm Password *', type: 'password', placeholder: 'Confirm password', required: true },
  { name: 'idCard', label: 'ID card number *', type: 'text', placeholder: 'ID card number', required: true, condition: (formData) => formData.role === 'SELLER' },
  { name: 'frontImage', label: 'Front ID card image *', type: 'file', required: true, condition: (formData) => formData.role === 'SELLER' },
  { name: 'backImage', label: 'Back ID card image *', type: 'file', required: true, condition: (formData) => formData.role === 'SELLER' },
  { name: 'issuedDate', label: 'Issued date *', type: 'date', required: true, condition: (formData) => formData.role === 'SELLER' },
  { name: 'expirationDate', label: 'Expiration date *', type: 'date', required: true, condition: (formData) => formData.role === 'SELLER' }
];

export const Register = () => {
  const [email, setEmail] = useState("");
  const {
    formData,
    isSuccess,
    handleChange,
    handleBecomeSellerClick,
    handleSubmit,
    errors,
  } = useSignup();

  return (
    <section className="register pt-16 relative">
      <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
      <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
        <Container>
          <div>
            <Title level={3} className="text-white">
              {isSuccess ? "OTP Verification" : "Sign Up"}
            </Title>
            <div className="flex items-center gap-3">
              <Title level={5} className="text-green font-normal text-xl">
                Home
              </Title>
              <Title level={5} className="text-white font-normal text-xl">
                /
              </Title>
              <Title level={5} className="text-white font-normal text-xl">
                {isSuccess ? "OTP Verification" : "Sign Up"}
              </Title>
            </div>
          </div>
        </Container>
      </div>

      <div
        className={`transition-all duration-500 ease-in-out transform ${
          isSuccess ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {!isSuccess ? (
          <form className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl" onSubmit={handleSubmit}>
            <div className="text-center">
              <Title level={5}>Sign Up</Title>
              <p className="mt-2 text-lg">
                Do you already have an account? <CustomNavLink href="/login">Log In Here</CustomNavLink>
              </p>
            </div>
            {formConfig.map(({ name, label, type, placeholder, required, condition }) => {
              if (condition && !condition(formData)) return null;
              return (
                <div key={name} className="py-5">
                  <Caption className="mb-2">{label}</Caption>
                  <input
                    type={type}
                    name={name}
                    value={type === 'file' ? undefined : formData[name]}
                    onChange={(e) => {
                      handleChange(e);
                      if (name === "email") setEmail(e.target.value);
                    }}
                    className={commonClassNameOfInput}
                    placeholder={placeholder}
                    required={required}
                  />
                  {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
                </div>
              );
            })}
            <div className="flex items-center gap-2 py-4">
              <input onClick={handleBecomeSellerClick} type="checkbox" />
              <Caption>Become a Seller</Caption>
            </div>
            <div className="flex items-center gap-2 py-4">
              <input type="checkbox" required />
              <Caption>I agree to the Terms & Policy</Caption>
            </div>
            <p className="text-center mt-5">
              By clicking the signup button, you create a BidMarket account, and you agree to BidMarket <span className="text-green underline">Terms & Conditions</span> & 
              <span className="text-green underline"> Privacy Policy </span>.
            </p>
            <PrimaryButton className="w-full rounded-none my-5">CREATE ACCOUNT</PrimaryButton>
          </form>
        ) : (
          <div className="w-full transform translate-x-full">
            <div className="flex justify-center pt-12">
              <Title className="w-1/2 text-center">
                Your account has been created successfully. But before you can start using it, we need to verify your email address!
              </Title>
            </div>
            <OTPVerification email={email}/>
          </div>
        )}
      </div>
    </section>
  );
};

