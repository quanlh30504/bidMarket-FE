import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Caption, Container, CustomNavLink, PrimaryButton, Title, useSignup } from "../../router";
import { commonClassNameOfInput } from "../../components/common/Design";

export const Register = () => {
  const {
    formData,
    handleChange,
    handleBecomeSellerClick,
    handleSubmit,
    error,
    successMessage,
  } = useSignup();

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
          
          {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
          {successMessage && <div className="text-green mt-4 text-center">{successMessage}</div>}

          {formConfig.map(({ name, label, type, placeholder, required, condition }) => {
            if (condition && !condition(formData)) return null; // if condition is false, return null
            
            return (
              <div key={name} className="py-5">
                <Caption className="mb-2">{label}</Caption>
                <input
                  type={type}
                  name={name}
                  value={type === 'file' ? undefined : formData[name]}
                  onChange={handleChange}
                  className={commonClassNameOfInput}
                  placeholder={placeholder}
                  required={required}
                />
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
            By clicking the signup button, you create a BidMarket account, and you agree to BidMarket 
            <span className="text-green underline">Terms & Conditions</span> & 
            <span className="text-green underline">Privacy Policy</span>.
          </p>
        </form>
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute bottom-96 right-0"></div>
      </section>
    </>
  );
};



const formConfig = [
  { name: 'fullName', label: 'Fullname *', type: 'text', placeholder: 'Full Name', required: true },
  { name: 'email', label: 'Enter Your Email *', type: 'email', placeholder: 'Enter Your Email', required: true },
  { name: 'password', label: 'Password *', type: 'password', placeholder: 'Enter Your Password', required: true },
  { name: 'confirmPassword', label: 'Confirm Password *', type: 'password', placeholder: 'Confirm password', required: true },
  {
    name: 'idCard',
    label: 'ID card number *',
    type: 'text',
    placeholder: 'ID card number',
    required: true,
    condition: (formData) => formData.role === 'SELLER'
  },
  {
    name: 'frontImage',
    label: 'Front ID card image *',
    type: 'file',
    required: true,
    condition: (formData) => formData.role === 'SELLER'
  },
  {
    name: 'backImage',
    label: 'Back ID card image *',
    type: 'file',
    required: true,
    condition: (formData) => formData.role === 'SELLER'
  },
  {
    name: 'issuedDate',
    label: 'Issued date *',
    type: 'date',
    required: true,
    condition: (formData) => formData.role === 'SELLER'
  },
  {
    name: 'expirationDate',
    label: 'Expiration date *',
    type: 'date',
    required: true,
    condition: (formData) => formData.role === 'SELLER'
  }
];
