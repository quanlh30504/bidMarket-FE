import { useState } from 'react';
import { authService } from '../services/authService';
import {useNotification} from "../notifications/NotificationContext";

export const useSignup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    role: 'BIDDER',
    idCard: '',
    frontImage: null,
    backImage: null,
    issuedDate: '',
    expirationDate: ''
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);  
  const { showToastNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const validateInput = (name, value) => {
    let error = "";

    switch (name) {
      case 'email':
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(value)) {
          error = "Invalid email format";
        }
        break;

      case 'password':
        if (value.length < 8) {
          error = "Password must be at least 8 characters";
        }
        break;

      case 'confirmPassword':
        if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;

      case 'phoneNumber':
        const phoneRegex = /^[0-9]{10,12}$/;
        if (!phoneRegex.test(value)) {
          error = "Phone number must be between 10 and 12 digits";
        }
        break;

      case 'idCard':
        const idCardRegex = /^[0-9]{9,12}$/;
        if (!idCardRegex.test(value)) {
          error = "ID card number must be between 9 and 12 digits";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    validateInput(name, files ? files[0] : value);
  };

  const handleBecomeSellerClick = () => {
    if (formData.role === 'BIDDER') {
      setFormData({
        ...formData,
        role: 'SELLER'
      });
    } else {
      setFormData({
        ...formData,
        role: 'BIDDER'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formIsValid = true;
    console.log('Current errors:', errors);
    Object.keys(formData).forEach((key) => {
      validateInput(key, formData[key]);
      if (errors[key]) {
        formIsValid = false;
      }
    });
    setErrors({});  // clear errors

    console.log(errors)
    if (!formIsValid) {
      // window.alert('Please fix the errors in the form');
      showToastNotification('Please fix the errors in the form', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      // window.alert('Password and confirm password do not match!');
      showToastNotification('Password and confirm password do not match!', 'error');
      return;
    }

    setLoading(true);
    try {
      await authService.signup(formData);
      await showToastNotification(`Register successful. Please check your email for the OTP code.`, 'success');
      setIsSuccess(true);
    } catch (error) {
      if (error?.response?.data?.code === 1009) {  // email already exists
        await showToastNotification(`Email already exists. Please login instead.`, 'error');
      }
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    isSuccess,
    handleChange,
    handleBecomeSellerClick,
    handleSubmit,
    loading
  };
};
