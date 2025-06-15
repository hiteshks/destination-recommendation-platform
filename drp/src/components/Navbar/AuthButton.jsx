import React from "react";

const AuthButton = ({ openModal }) => {
  return (
    <button onClick={openModal} className="auth-button">
      Login / Signup
    </button>
  );
};

export default AuthButton;
