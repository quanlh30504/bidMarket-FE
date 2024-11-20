import { Container, Title, PrimaryButton, Caption, authService } from "../../../router";
import { commonClassNameOfInput } from "../../../components/common/Design";
import { useState, useRef } from "react";

export const ChangePassword = ({ email, setEmail }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const isEmailProvided = useRef(!!email).current;

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
    setErrorMessage(null);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setErrorMessage(null);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setErrorMessage(null);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage(null);
    setSuccessMessage(null); 
  };

  // api
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    try {
        await authService.changePassword(email, currentPassword, newPassword);
        setSuccessMessage("Password has been changed successfully.");
    } catch (error) {
      setErrorMessage(error.message || "An error occurred");
    }
  };

  return (
    <Container>
      <form
        className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl"
        onSubmit={handleChangePassword}
      >
        <div className="text-center">
          <Title level={5}>Change Password</Title>
        </div>

        {errorMessage && <div className="text-red-500 mt-4 text-center">{errorMessage}</div>} 
        {successMessage && <div className="text-green mt-4 text-center">{successMessage}</div>}

        {isEmailProvided ? null : (
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
          </div>
        )}
        <div className="py-5">
          <Caption className="mb-2">Current Password</Caption>
          <input
            type="password"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            className={commonClassNameOfInput}
            placeholder="Enter current password"
            required
          />
        </div>

        <div className="py-5">
          <Caption className="mb-2">New Password</Caption>
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            className={commonClassNameOfInput}
            placeholder="Enter new password"
            required
          />
        </div>

        <div className="py-5">
          <Caption className="mb-2">Confirm New Password</Caption>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={commonClassNameOfInput}
            placeholder="Confirm new password"
            required
          />
        </div>

        <PrimaryButton
          className="w-full rounded-none my-5"
          type="submit"
        >
          Change Password
        </PrimaryButton>
      </form>
    </Container>
  );
};
