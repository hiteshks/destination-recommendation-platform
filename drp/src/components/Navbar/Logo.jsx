import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Logo = () => {
  return (
    <Link to="/" className="navbar-logo">
      Yatrik
    </Link>
  );
};

export default Logo;
