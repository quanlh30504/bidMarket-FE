import { useState } from 'react';
import { signup } from '../services/authService';

export const useSignup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    role: 'BIDDER',  // default role
    // profileImageUrl: null,

    // FOR SELLER
    isSeller: false,  // default is false
    idCard: '',
    frontImageURL: null,
    backImageURL: null,
    issuedDate: '',
    expirationDate: ''
  });

  // const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target; // get data from input (name, value/files(if it's file input))

    if (files) {
      setFormData({
        ...formData,  // keep the other fields
        [name]: files[0] // only get the first file
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
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

    const formDataToSend = new FormData();
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    
    if (formData.isSeller) {
      formDataToSend.append('idCard', formData.idCard);
      formDataToSend.append('issuedDate', formData.issuedDate);
      formDataToSend.append('expirationDate', formData.expirationDate);
      formDataToSend.append('frontImageURL', formData.frontImageURL);
      formDataToSend.append('backImageURL', formData.backImageURL);
    }
    // if (formData.profileImageUrl) formDataToSend.append('profileImageUrl', formData.profileImageUrl);  // required = false

    try {
      // setResponse(await signup(formDataToSend));
      await signup(formDataToSend);
      setSuccessMessage('Đăng ký thành công!');
      setError('');
    } catch (error) {
      setError(error);
      setSuccessMessage('');
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    error,
    successMessage,
  };
};
