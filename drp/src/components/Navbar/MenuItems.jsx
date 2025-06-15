import React from "react";
import "./Navbar.css";

const MenuItems = () => {
  return (
    <div className="navbar-menu">
      <a href="/">Home</a>
      <a href="/trending">Trending</a>
      <a href="/plan">Plan Trip</a>
      <a href="/my-trips">My Trips</a>
    </div>
  );
};

export default MenuItems;
