import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Caption, Container, CustomNavLink, PrimaryButton, Title, useSignup } from "../../router";
import { commonClassNameOfInput } from "../../components/common/Design";
import { useState } from "react";

export const Register = () => {
  const {
    formData,
    handleChange,
    handleSubmit,
    error,
    successMessage,
  } = useSignup();
  const [isSeller, setIsSeller] = useState(false);
  const handleBecomeSellerClick = () => {
    formData.isSeller = !isSeller;
    setIsSeller(!isSeller);
    console.log(formData.isSeller);
  };

  return (
    <>
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

        <form className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl" onSubmit={handleSubmit}>
          <div className="text-center">
            <Title level={5}>Sign Up</Title>
            <p className="mt-2 text-lg">
              Do you already have an account? <CustomNavLink href="/login">Log In Here</CustomNavLink>
            </p>
          </div>
          <div className="text-center">
            {error && (<div className="text-red-500 mt-4">{error}</div>)}
            {successMessage && (<div className="text-green mt-4">{successMessage}</div>)}
          </div>
          <div className="py-5">
            <Caption className="mb-2">Fullname *</Caption>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={commonClassNameOfInput} placeholder="Full Name" required />
          </div>
          <div className="py-5">
            <Caption className="mb-2">Enter Your Email *</Caption>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={commonClassNameOfInput} placeholder="Enter Your Email" required />
          </div>
          <div>
            <Caption className="mb-2">Password *</Caption>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className={commonClassNameOfInput} placeholder="Enter Your Password" required />
          </div>
          <div>
            <Caption className="mb-2">Confirm Password *</Caption>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={commonClassNameOfInput} placeholder="Confirm password" />
          </div>
          <div  className="flex items-center gap-2 py-4">
            <input onClick={handleBecomeSellerClick} type="checkbox" />
            <Caption>Become a Seller</Caption>
          </div>
          {isSeller && (
            <div>
               <div className="py-5">
            <Caption className="mb-2">ID card number *</Caption>
            <input type="text" name="idCard" value={formData.idCard} onChange={handleChange} className={commonClassNameOfInput} placeholder="ID card number" required />
          </div>
          <div className="py-5">
            <Caption className="mb-2">Front ID card image *</Caption>
            <input type="file" name="frontImageURL" value={formData.frontImageURL} onChange={handleChange} className={commonClassNameOfInput} required />
          </div>
          <div className="py-5">
            <Caption className="mb-2">Back ID card image *</Caption>
            <input type="file" name="backImageURL" value={formData.backImageURL} onChange={handleChange} className={commonClassNameOfInput} required />
          </div>
          <div className="py-5">
            <Caption className="mb-2">Issued date *</Caption>
            <input type="date" name="issuedDate" value={formData.issuedDate} onChange={handleChange} className={commonClassNameOfInput} required />
          </div>
          <div className="py-5">
            <Caption className="mb-2">Expiration date *</Caption>
            <input type="date" name="expirationDate" value={formData.expirationDate} onChange={handleChange} className={commonClassNameOfInput} required />
          </div>
            </div>
          )}
          <div className="flex items-center gap-2 py-4">
            <input type="checkbox" required/>
            <Caption>I agree to the Terms & Policy</Caption>
          </div>
          <PrimaryButton className="w-full rounded-none my-5">CREATE ACCOUNT</PrimaryButton>
          <div className="text-center border py-4 rounded-lg mt-4">
            <Title>OR SIGNUP WITH</Title>
            <div className="flex items-center justify-center gap-5 mt-5">
              <button className="flex items-center gap-2 bg-red-500 text-white p-3 px-5 rounded-sm">
                <FaGoogle />
                <p className="text-sm">SIGNUP WITH GOOGLE</p>
              </button>
              <button className="flex items-center gap-2 bg-indigo-500 text-white p-3 px-5 rounded-sm">
                <FaFacebook />
                <p className="text-sm">SIGNUP WITH FACEBOOK</p>
              </button>
            </div>
          </div>
          <p className="text-center mt-5">
            By clicking the signup button, you create a BidMarket account, and you agree to BidMarket <span className="text-green underline">Terms & Conditions</span> &
            <span className="text-green underline"> Privacy Policy </span> .
          </p>
        </form>
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute bottom-96 right-0"></div>
      </section>
    </>
  );
};
