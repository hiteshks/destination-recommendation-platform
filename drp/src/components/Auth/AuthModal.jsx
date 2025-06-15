import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import "./AuthModal.css";

const AuthModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setAuthError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(null);

    try {
      // Try logging in
      await signInWithEmailAndPassword(auth, email, password);
      handleClose();
    } catch (signInError) {
      if (
        signInError.code === "auth/user-not-found" ||
        signInError.code === "auth/invalid-credential"
      ) {
        try {
          // Sign up and store user
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;

          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            createdAt: new Date().toISOString(),
            hasTakenSurvey: false,
          });

          handleClose();
        } catch (signupError) {
          console.error("Signup failed:", signupError);
          setAuthError(signupError.message);
        }
      } else {
        console.error("Login failed:", signInError);
        setAuthError(signInError.message);
      }
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h4>Login / Signup</h4>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <form className="auth-form" onSubmit={handleAuth}>
          <div className="floating-label-input">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          <div className="floating-label-input">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          <button className="auth-submit" type="submit">
            Login / Signup
          </button>

          {authError && <p className="auth-error">{authError}</p>}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
