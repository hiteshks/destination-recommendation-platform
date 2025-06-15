import React, { useState, useRef, useEffect } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import "./Navbar.css";

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate(); // <-- add this

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="hamburger-wrapper" ref={menuRef}>
      <button
        className="hamburger-menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <HiOutlineMenu size={24} className="hamburger-icon" />
      </button>

      {open && (
        <div className="dropdown-menu">
          <div className="dropdown-item">
            <FaQuestionCircle className="dropdown-icon" />
            <span>Help Centre</span>
          </div>

          <hr />

          <div className="dropdown-item">
            <strong>Become a Guide</strong>
          </div>
          <div className="dropdown-item">
            <strong>Add Destination</strong>
          </div>

          <hr />

          <div
            className="dropdown-item"
            onClick={() => {
              navigate("/survey");
              setOpen(false); // optional: close menu after click
            }}
          >
            Take Survey
          </div>

          <hr />

          <div className="dropdown-item logout" onClick={() => auth.signOut()}>
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
