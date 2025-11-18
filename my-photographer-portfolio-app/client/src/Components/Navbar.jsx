import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../Assets/CSS/Navbar.css";
import { Menu, X } from "lucide-react";
import Logo from "../Assets/Images/navbar/Logo.png";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar-container">
      <div className="navbar">
        {/* ✅ Logo + Text Centered */}
        <div className="navbar-logo">
          <NavLink to="/">
            {/* <img src={Logo} alt="logo" /> */}
            <span>Hoang Truc Portfolio</span>
          </NavLink>
        </div>

        {/* Hamburger Icon */}
        <div className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </div>

        {/* Menu */}
        <nav className={`navbar-menu ${isOpen ? "active" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/show-case" onClick={closeMenu}>Show Case</NavLink>
          {/* <NavLink to="/motion" onClick={closeMenu}>Motion</NavLink>
          <NavLink to="/social" onClick={closeMenu}>Social</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink> */}
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && <div className="navbar-overlay" onClick={closeMenu}></div>}
    </header>
  );
};

export default Navbar;
