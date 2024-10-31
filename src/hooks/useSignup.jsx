import { useState } from 'react';
import { authService } from '../services/authService';

export const useSignup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    role: 'BIDDER',

    // SELLER
    idCard: '',
    frontImage: null,
    backImage: null,
    issuedDate: '',
    expirationDate: ''
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target; // get data from input (name, value/files(if it's file input))

    // image
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0] // only get the first file
      });
    } else {
      setFormData({
        ...formData,  
        [name]: value
      });
    }
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
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Confirm password does not match');
      setSuccessMessage('');
      return;
    }

    // const formDataToSend = new FormData();
    // formDataToSend.append('email', formData.email);
    // formDataToSend.append('password', formData.password);
    // formDataToSend.append('role', formData.role);
    // formDataToSend.append('fullName', formData.fullName);
    // formDataToSend.append('phoneNumber', formData.phoneNumber);
    
    // if (formData.role === 'SELLER') {
    //   formDataToSend.append('idCard', formData.idCard);
    //   formDataToSend.append('issuedDate', formData.issuedDate);
    //   formDataToSend.append('expirationDate', formData.expirationDate);
    //   formDataToSend.append('frontImage', formData.frontImage);
    //   formDataToSend.append('backImage', formData.backImage);
    // }

    try {
      await authService.signup(formData);
      setSuccessMessage('Đăng ký thành công!');
      setError('');
    } catch (error) {
      setError(error.message || error.toString());
      setSuccessMessage('');
    }
  };

  return {
    formData,
    handleChange,
    handleBecomeSellerClick,
    handleSubmit,
    error,
    successMessage,
  };
};
